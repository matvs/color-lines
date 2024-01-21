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
            if (token != null) {
                if (currentToken == null) {
                    currentToken = token;
                    counter = 1;
                }
                else if (currentToken.color == token.color) {
                    counter++;
                    if (j == 8) {
                        j++;
                        scorePoints();
                    }
                }
                else {
                    scorePoints();
                    currentToken = token;
                    counter = 1;
                }
            }
            else {
                scorePoints();
                currentToken = null;
                counter = 0;
            }
            return [currentToken, counter];
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
                [currentToken, counter] = countTokens(i, j, tokens[i][j], currentToken, counter, removeFunc);
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
                [currentToken, counter] = countTokens(i, j, tokens[j][i], currentToken, counter, removeFunc);
            };
        };
        const checkDiagonalFn = () => {
            let counter = 0;
            let currentToken = null;
            const isInBound = (x, y) => x >= 0 && x < 9 && y >= 0 && y < 9;
            return (i, j) => {
                currentToken = tokens[i][j];
                if (currentToken) {
                    counter = 1;
                }
                i += 1;
                j -= 1;
                const removeFunc = (i, j, counter) => {
                    while (counter >= 0) {
                        tokens[i][j] = null;
                        i -= 1;
                        j += 1;
                        counter--;
                    }
                };
                while (isInBound(i, j)) {
                    [currentToken, counter] = countTokens(i, j, tokens[i][j], currentToken, counter, removeFunc);
                    i += 1;
                    j -= 1;
                }
            };
        };
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
exports.default = PointsCounter;
//# sourceMappingURL=pointsCounter.js.map