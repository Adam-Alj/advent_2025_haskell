
splitStringOnChar :: [Char] -> Char -> [[Char]] -> [[Char]]
splitStringOnChar "" _ acc = acc
splitStringOnChar string delimiter acc = 
    if rest == "" then
        splitStringOnChar rest delimiter (acc ++ [word])
    else
        splitStringOnChar (tail rest) delimiter (acc ++ [word])
    where
        (word, rest) = break (==delimiter) string

getRangeTuple :: [Char] -> (Int, Int)
getRangeTuple range =
    (read start :: Int, read (tail end) :: Int)
    where
        (start, end) = break (=='-') range

findDenominators :: Int -> [Int]
findDenominators i = [x | x <- [1..i `div` 2], i `rem` x == 0]

equallyPartition :: [Char] -> [[Char]] -> Int -> [[Char]]
equallyPartition "" acc _ = acc
equallyPartition string acc size = equallyPartition (drop size string) (acc ++ [take size string]) size

allDuplicates :: [[Char]] -> Bool
allDuplicates [] = True
allDuplicates s = all (== head s) s

isInvalidId :: Int -> Bool
isInvalidId id = 
        any (==True)
        . map allDuplicates
        . map partition
        . findDenominators
        . length 
        $ strId
    where 
        strId = show id
        partition = equallyPartition strId []


main :: IO Int
main = do
    rawInput <- readFile "input.txt"
    let ranges = concat . map (\(f,l) -> [f..l]) $ map getRangeTuple (splitStringOnChar rawInput ',' [])
        invalidIds = filter isInvalidId ranges
        invalidSum = sum invalidIds

    print invalidSum
    return 1