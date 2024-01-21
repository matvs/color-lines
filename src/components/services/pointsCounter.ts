export default class PointsCounter {

    public checkForPoints(tokens): number {
        let score = 0;
    

        const countTokens = (i, j, token, currentToken, counter, removeFunc ): any => {
            const scorePoints = () => {
                if (counter >= 5) {
                    score += counter;
                    removeFunc(i,j,counter);
                }
            }

            const reset = (_token, _counter = 1) => {
                currentToken = _token;
                counter = _counter;
            }
            
            /**
             * I hope this code is self-explanatory
             */
            if (token != null) {
                if (currentToken == null) {
                    reset(token);
                } else if (currentToken.color == token.color) {
                    counter++;
                    // if last token in a row
                    if (j == 8) {
                        // j++ to properly remove tokens
                        j++;
                        scorePoints();
                    }
                } else {
                    scorePoints();
                    reset(token);
                }
            } else {
                scorePoints();
                reset(null, 0);
            }

            return [currentToken, counter];
        }
        

        const checkHorizontalFn = () => { 
            let counter = 0;
            let currentToken = null
            return (i: number, j: number): void => {
                const removeFunc = (i: number, j: number, counter: number): void => {
                    for (let k = j - counter; k < j; ++k) {
                        tokens[i][k] = null;
                    }
                }
                [currentToken, counter] = countTokens(i,j,tokens[i][j],currentToken,counter,removeFunc);
        
        } }

        const checkVerticalFn = () => { 
            let counter = 0;
            let currentToken = null
            return (i: number, j: number): void => {
                const removeFunc = (i: number, j: number, counter: number): void => {
                    for (let k = j - counter; k < j; ++k) {
                        tokens[k][i] = null;
                    }
                }
                [currentToken, counter] = countTokens(i,j,tokens[j][i],currentToken,counter,removeFunc);
        } }

        const checkDiagonalFn = () => {
            let counter = 0;
            let currentToken = null;
            const isInBound = (x: number, y: number): boolean => x >= 0 && x < 9 && y >= 0 && y < 9;
            return (i: number, j: number): void => {
                currentToken = tokens[i][j];
                if (currentToken) { 
                    counter = 1;
                }
                i += 1;
                j -= 1;
                const removeFunc = (i: number, j: number, counter: number): void => {
                    while(counter >= 0) {
                        tokens[i][j] = null;
                        i -= 1;
                        j += 1;
                        counter--;
                    }
                }
                while (isInBound(i,j)) {
                    [currentToken, counter] = countTokens(i,j,tokens[i][j],currentToken,counter,removeFunc);
                    i += 1;
                    j -= 1;
                    
                }
            }

        }

        for (let i = 0; i < 9; ++i) {
            const checkHorizontal = checkHorizontalFn();
            const checkVertical = checkVerticalFn();
            const checkDiagonal = checkDiagonalFn();
            for (let j = 0; j < 9; ++j) {
                if (i == 0) {
                    checkDiagonal(i, j);
                }
                checkHorizontal(i, j);
                checkVertical(i, j);

            }
        }

        return score;
    }


}