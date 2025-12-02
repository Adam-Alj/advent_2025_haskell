import Debug.Trace (trace)
-- Given instructions to move an index on a doubly linked, circular
-- list, return the number of times the index it 0 for those instructions

{-
match rotation amount
    for positive, take length + n then drop n
    for negativs, take length*2 + n then drop length + n
-}
-- Given a theoretically cyclic list, rotates it and return the new list.
-- The head of the returned list is the dial position
rotateDial :: [Int] -> Int -> [Int]
rotateDial dial rotationAmount
    | rotationAmount > 0 = drop rotationAmount (take (length dial + rotationAmount) (cycle dial)) 
    | otherwise = rotateDial dial (length dial - abs rotationAmount `mod` length dial)

getDialPositions :: [Int] -> [Int] -> [(Int, Bool)] -> [(Int, Bool)]
getDialPositions _ [] acc = acc
getDialPositions dial instructions acc =
    getDialPositions rotatedDial (tail instructions) (acc ++ [(head rotatedDial, zeroCrossed )])
    where 
        rotatedDial = rotateDial dial (head instructions)
        zeroCrossed = zeroCrossing (length dial) (head dial) (head instructions)


zeroCrossing :: Int -> Int -> Int -> Bool
zeroCrossing _ 0 _ = False
zeroCrossing dialLength dialPosition instruction
    | nextPosition < 0 = True
    | nextPosition > dialLength = True
    | otherwise = False
    where nextPosition = dialPosition + instruction


-- Returns the positive or negative int representation of the instruction
-- e.g. L18 = -18
parseInstruction :: String -> Int
parseInstruction s
    | direction == 'R' = read (tail s)
    | direction == 'L' = (-1) * read (tail s)
    where direction = head s

precomputeZeroCrossings :: [Int] -> Int -> Int
precomputeZeroCrossings rawInstructions dialLength = sum (map (\a -> abs a `div` dialLength) rawInstructions)

-- accounts for overflow. e.g. 100 125 = 25 and 100 (-125) = -25 and 100 100 = 0
normalizeRotationAmount :: Int -> Int -> Int
normalizeRotationAmount dialLength rotationAmount
    | rotationAmount > 0 = rotationAmount `mod` dialLength
    | otherwise = rotationAmount `rem` dialLength




main :: IO Int
main = do
    instructions <- readFile "input.txt"
    let dial = rotateDial [0..99] 50
    let rotationAmounts = map parseInstruction (lines instructions)
    let precomputedCrossings = precomputeZeroCrossings rotationAmounts (length dial)
    let normalizationFn = normalizeRotationAmount (length dial)
    let normalizedRotationAmounts = filter (/=0) (map normalizationFn rotationAmounts)
    let dialRotationResults = getDialPositions dial normalizedRotationAmounts []
    let res = precomputedCrossings + sum (map (\(position, crossed) -> if position == 0 || crossed then 1 else 0) dialRotationResults)
    print rotationAmounts
    print precomputedCrossings
    print normalizedRotationAmounts
    print dialRotationResults
    print res
    return 1