import fs from 'fs';

/* 

Brainstorming notes:

Naively, you can run the same algo as part 1 until it returns 0, meaning that no additional rolls can be removed.

However, our time complexity for part 1 is O(n . m). We'd be running this an additional p times, making that solution O(n . m . p)
p, in its worst case scenario, is n . m, if we can only remove 1 roll per iteration but can eventually remove them all.
meaning the complexity for the above is actually O(n^2 . m^2)

We can do better. 

When do we need to recompute a roll that we've already determined is immovable?
Whenever any of its surrounding rolls is removed.

So how about this, we can do a first pass to find the coordinates of all *movable* rolls.

We maintain a map of coordinates and their state:
    - processed (we know, right now, that we can't remove this roll)
    - unprocessed (we don't know if we can or can't remove this roll)

Then, we add the initial coordinates to a queue. 
We process (visit) coordinates from the queue as follows:
    0. Is this a roll?
    1. if this is already processed, skip it
    2. if we can't move it, update it as processed in the memo map
    3. If we can move it, move it (update accumulator)
       - update it as processed in the memo map
       - update the surrounding directions as unprocessed in the memo map 

*/

const directions = [
    [0,1], 
    [0,-1],
    [1,0], 
    [-1,0],
    [1,1], 
    [1,-1],
    [-1,1],
    [-1,-1],
];

function getValidSurroundingCoords(grid: string[][], x: number, y: number ): number[][] {
    const validCoord = (a: number, b: number) => a >= 0 && b >= 0 && a < grid[0].length && b < grid[0].length;

    return directions
        .map(([a,b]) => [a+x,b+y])
        .filter(([a, b]) => validCoord(a, b));
}

const memoHash = (x: number, y:number) => `x${x}-y${y}`

function isRollAccessible(grid: string[][], removedRollMap: Record<string, boolean>, x: number, y: number ): boolean {
    const coordinatesToConsider = getValidSurroundingCoords(grid, x, y).filter(([a,b]) => !removedRollMap[memoHash(a,b)]);
    const nearbyRolls = coordinatesToConsider.reduce((acc, cur) => acc + (grid[cur[0]][cur[1]] == '@' ? 1 : 0), 0);


    return nearbyRolls < 4;
}

function numAccessibleRolls(grid: string[][]): number {
    let removedRolls = 0;
    const removedRollMemoMap: Record<string, boolean> = {};

    const visitQueue: number[][] = grid.reduce((outerAcc, outerCurr, outerIndex) => {
        return [
            ...outerAcc,
            ...outerCurr.reduce((innerAcc, innerCurrent, innerIndex) => {
                if (innerCurrent === '@' && isRollAccessible(grid, removedRollMemoMap, outerIndex, innerIndex)) {
                    // remove the found roll on this pass and add all of its neighbors to the visit queue
                    removedRolls++;
                    // remember that we removed this, so that we don't reprocess
                    removedRollMemoMap[memoHash(outerIndex, innerIndex)] = true;
                    return [
                        ...innerAcc,
                        ...getValidSurroundingCoords(grid, outerIndex, innerIndex)
                    ]
                }

                return innerAcc;
            }, [] as number[][])
        ]
    }, [] as number[][]);

    while(visitQueue.length) {
        const [x,y] = visitQueue.shift();

        // not a roll!
        if (grid[x][y] !== '@') {
            continue;
        }

        const curMemoHash = memoHash(x,y)
        // we already removed this one
        if (removedRollMemoMap[curMemoHash]) {
            continue;
        }

        // we can't remove this roll
        if (!isRollAccessible(grid,removedRollMemoMap, x, y)) {
            continue;
        }

        removedRolls++;
        removedRollMemoMap[curMemoHash] = true;
        getValidSurroundingCoords(grid, x, y).forEach((coord) => visitQueue.push(coord));

    }

    return removedRolls;
}

const inputGrid: string[] = fs.readFileSync('input.txt', 'utf-8').split('\n').map(a => a.split(''));


console.log(numAccessibleRolls(inputGrid));

