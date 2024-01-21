"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.Game = void 0;
const board_1 = require("./board");
const circle_1 = require("./circle");
const colors_1 = require("./colors");
class Game {
    constructor() {
        this.board = new board_1.Board(9, 9, document.getElementById("plotno"));
        this.pointsContainer = document.getElementById("wynik");
        this.board.addOnClickListener((x, y) => this.onClick(x, y));
        this.init();
        this.run();
    }
    getState() {
        return this.state;
    }
    pause() {
        this.state = GameState.Paused;
    }
    run() {
        this.state = GameState.Running;
        this.board.draw(this.state, this.metadata);
    }
    renderResult() {
        this.pointsContainer.innerHTML = this.metadata.score.toString();
    }
    getLevel() {
        return this.metadata.level;
    }
    init() {
        const levelElements = document.forms['level'].elements;
        const checkedLevel = Array.from(levelElements).find((x) => x.checked == true);
        this.metadata = {};
        if (checkedLevel) {
            this.metadata.level = parseInt(checkedLevel.value);
        }
        this.metadata.score = 0;
        this.metadata.tokens = [];
        for (let i = 0; i < 9; ++i) {
            this.metadata.tokens[i] = [];
            for (let j = 0; j < 9; ++j) {
                this.metadata.tokens[i][j] = null;
            }
        }
        this.generateTokens(9);
    }
    generateTokens(n = 3) {
        let i = 0;
        while (i < n) {
            let col = Math.floor(Math.random() * 9);
            let row = Math.floor(Math.random() * 9);
            if (this.metadata.tokens[row][col] == null) {
                this.metadata.tokens[row][col] = new circle_1.Circle(Object.values(colors_1.Colors)[Math.floor(Math.random() * this.getLevel())], this.board['ctx'], col * 55 + 75, row * 55 + 75);
                i++;
            }
        }
    }
    onClick(col, row) {
        if (this.state != GameState.Running) {
            return;
        }
        if (this.metadata.selectedToken) {
            if (this.isLegalMove(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row)) {
                let path = this.getPath(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row);
                this.metadata.path = this.normalizePath(path);
                this.metadata.selectedToken.token.x = col * 55 + 75;
                this.metadata.selectedToken.token.y = row * 55 + 75;
                this.metadata.tokens[row][col] = this.metadata.selectedToken.token;
                this.metadata.tokens[this.metadata.selectedToken.row][this.metadata.selectedToken.col] = null;
                this.metadata.selectedToken = null;
                this.generateTokens();
            }
            else {
                this.metadata.selectedToken = null;
            }
        }
        else if (this.metadata.tokens[row][col] != null) {
            this.metadata.selectedToken = { token: this.metadata.tokens[row][col], row, col };
        }
        this.checkForPoints();
        this.board.draw(this.state, this.metadata);
    }
    checkForPoints() {
        const tokens = this.metadata.tokens;
        const countTokens = (i, j, token, currentToken, counter, removeFunc) => {
            if (token != null) {
                if (currentToken == null) {
                    currentToken = token;
                    counter = 1;
                }
                else if (currentToken.color == token.color) {
                    counter++;
                }
                else {
                    if (counter >= 5) {
                        this.metadata.score += counter;
                        removeFunc(i, j, counter);
                    }
                    currentToken = token;
                    counter = 1;
                }
            }
            else {
                if (counter >= 5) {
                    this.metadata.score += counter;
                    removeFunc(i, j, counter);
                }
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
    }
    isLegalMove(col, row, selectedCol, selectedRow) {
        if (col == selectedCol && row == selectedRow) {
            return false;
        }
        return this.getPath(col, row, selectedCol, selectedRow).length > 0;
    }
    normalizePath(path) {
        const moves = {
            'up': [0, -1],
            'down': [0, 1],
            'left': [-1, 0],
            'right': [1, 0]
        };
        const mapping = {
            'up': 'vertical',
            'down': 'vertical',
            'left': 'horizontal',
            'right': 'horizontal'
        };
        const pathMap = new Map();
        for (let i = 1; i < path.length; i++) {
            const x = path[i][0] + moves[path[i][2]][0];
            const y = path[i][1] + moves[path[i][2]][1];
            pathMap.set('' + x + ',' + y, mapping[path[i][2]]);
        }
        console.log(pathMap);
        return pathMap;
    }
    getPath(col, row, selectedCol, selectedRow) {
        const isInBound = (x, y) => x >= 0 && x < 9 && y >= 0 && y < 9;
        const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const moveToDirection = {
            0: 'down',
            1: 'up',
            2: 'right',
            3: 'left'
        };
        const queue = [[col, row]];
        const visited = new Set();
        const cameFrom = new Map();
        cameFrom.set('[' + col + ',' + row + ']', [-1, -1, 'start']);
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x == selectedCol && y == selectedRow) {
                const sequence = [];
                let current = cameFrom.get('[' + x + ',' + y + ']');
                while (current[2] != 'start') {
                    sequence.push(current);
                    current = cameFrom.get('[' + current[0] + ',' + current[1] + ']');
                }
                console.log(sequence);
                return sequence;
                ;
            }
            if (visited.has('[' + x + ',' + y + ']')) {
                continue;
            }
            for (const [dx, dy] of moves) {
                const nx = x + dx;
                const ny = y + dy;
                if (isInBound(nx, ny) && this.metadata.tokens[ny][nx] == null && !visited.has('[' + nx + ',' + ny + ']')) {
                    queue.push([nx, ny]);
                    cameFrom.set('[' + nx + ',' + ny + ']', [x, y, moveToDirection[moves.findIndex(item => item[0] == dx && item[1] == dy)]]);
                }
            }
            visited.add('[' + x + ',' + y + ']');
        }
        return [];
    }
}
exports.Game = Game;
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["Paused"] = 1] = "Paused";
    GameState[GameState["Ended"] = 2] = "Ended";
})(GameState || (exports.GameState = GameState = {}));
//# sourceMappingURL=game.js.map