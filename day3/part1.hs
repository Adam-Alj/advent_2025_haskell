maxJoltage :: [Char] -> [Char]
maxJoltage arr = maxJoltage' arr '0' '0'
    where 
        maxJoltage' :: [Char] -> Char -> Char -> [Char]
        maxJoltage' [] l r = [l,r]
        maxJoltage' [x] l r = if x > r then [l,x] else [l,r]
        maxJoltage' m@[x,y] l r
            | x > l = [x,y]
            | x > r = maxJoltage' (tail m) l x
            | otherwise = maxJoltage' (tail m) l r
        maxJoltage' m@(x:y:_) l r
            | x > l = maxJoltage' (tail m) x y
            | x > r = maxJoltage' (tail m) l x
            | otherwise = maxJoltage' (tail m) l r

main :: IO ()
main = do
    rawInput <- readFile "input.txt"
    let maxJoltageAcrossBanks = sum . map (read . maxJoltage) $ lines rawInput
    print maxJoltageAcrossBanks
    return ()