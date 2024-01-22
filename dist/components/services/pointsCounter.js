"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointsCounter {
    checkForPoints(tokens) {
        let score = 0;
        const countTokens = (i, j, token, currentToken, counter, removeFunc) => {
            const scorePoints = () => {
                if (counter >= 5) {
                    score += counter;
                    removeFunc(i, j, counter);
                }
            };
            const reset = (_token, _counter = 1) => {
                currentToken = _token;
                counter = _counter;
            };
            /**
             * I hope this code is self-explanatory
             */
            if (token != null) {
                if (currentToken == null) {
                    reset(token);
                }
                else if (currentToken.color == token.color) {
                    counter++;
                    // if last token in a row
                    if (j == 8) {
                        // j++ to properly remove tokens
                        j++;
                        scorePoints();
                    }
                }
                else {
                    scorePoints();
                    reset(token);
                }
            }
            else {
                scorePoints();
                reset(null, 0);
            }
            return [currentToken, counter, score];
        };
        const checkHorizontalFn = () => {
            let counter = 0;
            let currentToken = null;
            return (i, j) => {
                const removeFunc = (i, j, counter) => {
                    for (let k = j - counter; k < j; ++k) {
                        tokens[i][k] = null;
                    }
                };
                [currentToken, counter, score] = countTokens(i, j, tokens[i][j], currentToken, counter, removeFunc);
            };
        };
        const checkVerticalFn = () => {
            let counter = 0;
            let currentToken = null;
            return (i, j) => {
                const removeFunc = (i, j, counter) => {
                    for (let k = j - counter; k < j; ++k) {
                        tokens[k][i] = null;
                    }
                };
                [currentToken, counter, score] = countTokens(i, j, tokens[j][i], currentToken, counter, removeFunc);
            };
        };
        const checkDiagonalFn = (updateI, updateJ) => {
            let counter = 0;
            let currentToken = null;
            const isInBound = (x, y) => x >= 0 && x < 9 && y >= 0 && y < 9;
            return (i, j) => {
                // currentToken = tokens[i][j];
                // if (currentToken) { 
                //     counter = 1;
                // }
                // i += 1;
                // j -= 1;
                console.log(i, j);
                const removeFunc = (i, j, counter) => {
                    while (counter >= 0) {
                        tokens[i][j] = null;
                        // going back
                        i = updateJ(i);
                        j = updateI(j);
                        counter--;
                    }
                };
                while (isInBound(i, j)) {
                    const ctx = document.getElementById("plotno").getContext("2d");
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(256,256,256,1)";
                    ctx.fillRect(j * 55 + 50, i * 55 + 50, 25, 25);
                    [currentToken, counter, score] = countTokens(i, j, tokens[i][j], currentToken, counter, removeFunc);
                    i = updateI(i);
                    j = updateJ(j);
                }
                if (counter >= 5 && currentToken != null) {
                    score += counter;
                    removeFunc(i, j, counter);
                }
            };
        };
        for (let i = 0; i < 9; ++i) {
            const checkHorizontal = checkHorizontalFn();
            const checkVertical = checkVerticalFn();
            for (let j = 0; j < 9; ++j) {
                if (i == 0) {
                    const checkDiagonal = checkDiagonalFn((x) => x + 1, (x) => x - 1);
                    checkDiagonal(i, j);
                }
                if (i == 8) {
                    const checkDiagonal = checkDiagonalFn((x) => x - 1, (x) => x + 1);
                    checkDiagonal(i, j);
                }
                checkHorizontal(i, j);
                checkVertical(i, j);
            }
        }
        return score;
    }
}
exports.default = PointsCounter;
//# sourceMappingURL=pointsCounter.js.map