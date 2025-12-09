/*
    One way to construct this is:
        for each point, if your connection to another point is the shortest connection for that other point, connect.
            otherwise, don't

    Once a point has been connected, we no longer care about it.

    So we could take an O ( n^2 ) hit to create an undirected graph with weighted edges.

    Then we perform an O(n) traversal with a queue. 
*/

import fs from 'node:fs';

function parseRawInput(inputFile: string): number[][] {
    return fs.readFileSync(inputFile, 'utf-8').split('\n').map((e) => e.split(',').map((e) => parseInt(e)));
}

type PointDistance = {
    positionA: number[],
    positionB: number[],
    distance: number
}

// O(n^2 . logn) time
function getDistances(coordinates: number[][]): PointDistance[] {
    const result: PointDistance[] = [];

    for (let i = 0; i < coordinates.length; i++) {
        const [p1, p2, p3]= coordinates[i];
        for (let j = i+1; j < coordinates.length; j++) {
            const [q1, q2, q3] = coordinates[j];
            const distance = Math.sqrt(Math.pow(p1-q1, 2) + Math.pow(p2-q2, 2) + Math.pow(p3-q3, 2));
            result.push({
                positionA: coordinates[i],
                positionB: coordinates[j],
                distance
            })
        }
    }

    return result.sort((a, b) => a.distance - b.distance);
}

const nodePositionHash = ([x,y,z]: number[]) => `x${x}y${y}z${z}`;

function unionize(distances: PointDistance[]): number {
    const positions: number[][] = Array.from(distances.reduce((acc, cur) => {
       acc.add(cur.positionA); 
       acc.add(cur.positionB); 
       return acc;
    }, new Set<number[]>()));

    const indexMap: Record<string, number> = positions.reduce((acc, cur, i) => {
        acc[nodePositionHash(cur)] = i;
        return acc;
    }, {} as Record<string, number>);

    const parents = positions.map((_, i) => i);
    const rank = Array(parents.length).fill(1);
    let maxRank = 1;

    const find = (coord: number[]): number => {
        let hashIndex = indexMap[nodePositionHash(coord)];
        let root = hashIndex;    

        while (root != parents[root]) {
            root = parents[root];
        }

        return root;
    }

    const union = (coord1: number[], coord2: number[]) => {
        const parent1 = find(coord1);
        const parent2 = find(coord2);

        if (parent1 == parent2) {
            return;
        } else if (rank[parent1] >= rank[parent2]) {
            parents[parent2] = parent1
            rank[parent1] += rank[parent2]
            rank[parent2] = 1
            maxRank = rank[parent1] > maxRank ? rank[parent1] : maxRank;
        } else {
            parents[parent1] = parent2
            rank[parent2] += rank[parent1]
            rank[parent1] = 1
            maxRank = rank[parent2] > maxRank ? rank[parent2] : maxRank;
        }
    }

    for (let i = 0; i < distances.length; i++) {
        union(distances[i].positionA, distances[i].positionB)
        if (maxRank >= parents.length) {
            return distances[i].positionA[0] * distances[i].positionB[0];
        }
    }
}




const input = parseRawInput("input.txt");

const distances = getDistances(input);

const result = unionize(distances);

console.log(result)

