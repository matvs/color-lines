(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
class Board {
    constructor(rows, cols, canvas) {
        this.rows = rows;
        this.cols = cols;
        this.canvas = canvas;
        this.onClickListeners = [];
        if (canvas.getContext("2d") == null) {
            throw new Error("Canvas not supported!");
        }
        this.ctx = canvas.getContext("2d");
        this.canvas.addEventListener('mousedown', ($event) => this.onClick($event));
    }
    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,150,0,0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawFields(path) {
        const squareSize = 50;
        const margin = 5;
        for (var y = squareSize; y <= 490; y += squareSize + margin)
            for (var x = squareSize; x <= 490; x += squareSize + margin) {
                this.ctx.beginPath();
                this.ctx.fillStyle = "rgba(256,256,256,1)";
                this.ctx.fillRect(x, y, squareSize, squareSize);
                this.ctx.fillStyle = "rgba(0,0,150,0.5)";
                this.ctx.fillRect(x, y, squareSize, squareSize);
                const row = Math.floor((y - 50) / 55);
                const col = Math.floor((x - 50) / 55);
                if (path === null || path === void 0 ? void 0 : path.has(`${col},${row}`)) {
                    const direction = path.get(`${col},${row}`);
                    const moves = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                    const mapping = ['up', 'down', 'left', 'right'];
                    const prevNextMoves = [];
                    for (const [dx, dy] of moves) {
                        if (path.has(`${col + dx},${row + dy}`)) {
                            prevNextMoves.push([col + dx, row + dy]);
                        }
                    }
                    for (const [dx, dy] of prevNextMoves) {
                        const diffX = col - dx;
                        const diffY = row - dy;
                        this.ctx.beginPath();
                        if (diffX > 0) {
                            this.ctx.fillStyle = "rgba(256,256,256,1)";
                            this.ctx.strokeStyle = "rgba(256,256,256,1)";
                            this.ctx.lineWidth = 4;
                            this.ctx.moveTo(x, y + squareSize / 2);
                            this.ctx.lineTo(x + squareSize / 2, y + squareSize / 2);
                            this.ctx.stroke();
                            ;
                        }
                        else if (diffX < 0) {
                            this.ctx.fillStyle = "rgba(256,256,256,1)";
                            this.ctx.strokeStyle = "rgba(256,256,256,1)";
                            this.ctx.lineWidth = 4;
                            this.ctx.moveTo(x + squareSize / 2, y + squareSize / 2);
                            this.ctx.lineTo(x + squareSize, y + squareSize / 2);
                            this.ctx.stroke();
                            ;
                        }
                        else if (diffY > 0) {
                            this.ctx.fillStyle = "rgba(256,256,256,1)";
                            this.ctx.strokeStyle = "rgba(256,256,256,1)";
                            this.ctx.lineWidth = 4;
                            this.ctx.moveTo(x + squareSize / 2, y);
                            this.ctx.lineTo(x + squareSize / 2, y + squareSize / 2);
                            this.ctx.stroke();
                            ;
                        }
                        else if (diffY < 0) {
                            this.ctx.fillStyle = "rgba(256,256,256,1)";
                            this.ctx.strokeStyle = "rgba(256,256,256,1)";
                            this.ctx.lineWidth = 4;
                            this.ctx.moveTo(x + squareSize / 2, y + squareSize / 2);
                            this.ctx.lineTo(x + squareSize / 2, y + squareSize);
                            this.ctx.stroke();
                            ;
                        }
                    }
                    // this.ctx.beginPath();
                    // if (direction == 'vertical') {
                    //     this.ctx.fillStyle = "rgba(256,256,256,1)";
                    //     this.ctx.strokeStyle = "rgba(256,256,256,1)";
                    //     this.ctx.lineWidth = 4;
                    //     this.ctx.moveTo(x + squareSize / 2, y);
                    //     this.ctx.lineTo(x + squareSize / 2, y + squareSize);
                    //     this.ctx.stroke();
                    // } else if (direction == 'horizontal') {
                    //     this.ctx.fillStyle = "rgba(256,256,256,1)";
                    //     this.ctx.strokeStyle = "rgba(256,256,256,1)";
                    //     this.ctx.lineWidth = 4;
                    //     this.ctx.moveTo(x, y + squareSize / 2);
                    //     this.ctx.lineTo(x + squareSize, y + squareSize / 2);
                    //     this.ctx.stroke();
                    // }
                }
            }
    }
    drawCircles(tokens, selectedToken) {
        var _a;
        for (let i = 0; i < tokens.length; i++) {
            for (let j = 0; j < tokens[i].length; j++) {
                if (selectedToken && i == selectedToken.row && j == selectedToken.col) {
                    const squareSize = 50;
                    const x = j * 55 + 50;
                    const y = i * 55 + 50;
                    this.ctx.beginPath();
                    this.ctx.fillStyle = "rgba(256,256,256,1)";
                    this.ctx.fillRect(x, y, squareSize, squareSize);
                    this.ctx.fillStyle = "rgba(0,0,150,0.75)";
                    this.ctx.fillRect(x, y, squareSize, squareSize);
                }
                (_a = tokens[i][j]) === null || _a === void 0 ? void 0 : _a.draw();
            }
        }
    }
    addOnClickListener(callback) {
        this.onClickListeners.push(callback);
    }
    draw(state, metadata) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawFields(metadata.path);
        this.drawCircles(metadata.tokens, metadata.selectedToken);
        //   if (level > 1) los_kolory("piec");
        //  los(5);
        //  
        this.ctx.beginPath();
        let clicknr = 1;
    }
    onClick($event) {
        var x = $event.pageX - this.canvas.offsetLeft;
        var y = $event.pageY - this.canvas.offsetTop;
        for (const listener of this.onClickListeners) {
            listener(Math.floor((x - 50) / 55), Math.floor((y - 50) / 55));
        }
    }
}
exports.Board = Board;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
class Circle {
    constructor(color, ctx, x, y) {
        this.color = color;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, (50 / 2) - 3, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    ;
}
exports.Circle = Circle;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = void 0;
var Colors;
(function (Colors) {
    Colors["Blue"] = "rgba(0,0,255,0.8)";
    Colors["Red"] = "rgba(255,0,0,0.8)";
    Colors["Green"] = "rgba(0,255,0,0.8)";
    Colors["Pink"] = "rgba(255,100,255,0.8)";
    Colors["Gray"] = "rgba(100,100,100,0.8)";
    Colors["Yellow"] = "rgba(255,255,0,0.8)";
    Colors["PaleYellow"] = "rgba(100,255,255,0.8)";
})(Colors || (exports.Colors = Colors = {}));

},{}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.Game = void 0;
const board_1 = require("./board");
const circle_1 = require("./circle");
const colors_1 = require("./colors");
const pathFinder_1 = __importDefault(require("./services/pathFinder"));
const pointsCounter_1 = __importDefault(require("./services/pointsCounter"));
class Game {
    constructor() {
        this.pathFinderService = new pathFinder_1.default();
        this.pointsCounterService = new pointsCounter_1.default();
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
            if (this.pathFinderService.isLegalMove(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row, this.metadata.tokens)) {
                let path = this.pathFinderService.getPath(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row, this.metadata.tokens);
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
        this.metadata.score += this.pointsCounterService.checkForPoints(this.metadata.tokens);
        this.board.draw(this.state, this.metadata);
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
}
exports.Game = Game;
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["Paused"] = 1] = "Paused";
    GameState[GameState["Ended"] = 2] = "Ended";
})(GameState || (exports.GameState = GameState = {}));

},{"./board":1,"./circle":2,"./colors":3,"./services/pathFinder":5,"./services/pointsCounter":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathFinder {
    isLegalMove(col, row, selectedCol, selectedRow, tokens) {
        if (col == selectedCol && row == selectedRow) {
            return false;
        }
        return this.getPath(col, row, selectedCol, selectedRow, tokens).length > 0;
    }
    getPath(col, row, selectedCol, selectedRow, tokens) {
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
                if (isInBound(nx, ny) && tokens[ny][nx] == null && !visited.has('[' + nx + ',' + ny + ']')) {
                    queue.push([nx, ny]);
                    cameFrom.set('[' + nx + ',' + ny + ']', [x, y, moveToDirection[moves.findIndex(item => item[0] == dx && item[1] == dy)]]);
                }
            }
            visited.add('[' + x + ',' + y + ']');
        }
        return [];
    }
}
exports.default = PathFinder;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./components/game");
window.addEventListener('load', () => {
    const game = new game_1.Game();
});

},{"./components/game":4}]},{},[7]);
