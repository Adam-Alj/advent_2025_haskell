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

main :: IO Int
main = do
    rawInput <- readFile "input.txt"
    let ranges = map getRangeTuple (splitStringOnChar rawInput ',' [])
    let isInvalidID id = firstHalf == lastHalf
            where (firstHalf, lastHalf) = splitAt (length (show id) `div` 2) (show id)
        invalidIdSum = 
            sum
            . filter isInvalidID
            . concat $ filter (/=[]) (map (\(a,b) -> [ x | x <- [a..b], even (length (show x))]) ranges)

    print invalidIdSum 
    return 1