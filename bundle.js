(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const boardService_1 = __importDefault(require("../services/boardService"));
const config_1 = __importDefault(require("../config/config"));
class Board {
    constructor(rows, cols, canvas) {
        this.rows = rows;
        this.cols = cols;
        this.canvas = canvas;
        this.previousTokens = [];
        this.onClickListeners = [];
        if (canvas.getContext("2d") == null) {
            throw new Error("Canvas not supported!");
        }
        this.ctx = canvas.getContext("2d");
        this.canvas.addEventListener('mousedown', ($event) => this.onClick($event));
        this.boardService = new boardService_1.default();
    }
    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,150,0,0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawFields(path) {
        const squareSize = config_1.default.SQUERE_SIZE;
        const margin = config_1.default.MARGIN;
        for (var y = squareSize; y <= 490; y += squareSize + margin)
            for (var x = squareSize; x <= 490; x += squareSize + margin) {
                this.ctx.beginPath();
                this.ctx.fillStyle = "rgba(256,256,256,1)";
                this.ctx.fillRect(x, y, squareSize, squareSize);
                this.ctx.fillStyle = "rgba(0,0,150,0.5)";
                this.ctx.fillRect(x, y, squareSize, squareSize);
                const row = this.boardService.getRowFromY(y);
                const col = this.boardService.getColumnFromX(x);
                this.drawPath(row, col, x, y, path);
            }
    }
    drawPath(row, col, x, y, path) {
        const squareSize = 50;
        const margin = 5;
        if (path === null || path === void 0 ? void 0 : path.has(`${col},${row}`)) {
            const moves = [[0, -1], [0, 1], [-1, 0], [1, 0]];
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
        }
    }
    drawCircles(tokens, selectedToken) {
        var _a, _b;
        for (let i = 0; i < tokens.length; i++) {
            for (let j = 0; j < tokens[i].length; j++) {
                this.highlightSelectedToken(selectedToken, i, j);
                if (this.isNewToken(tokens[i][j])) {
                    (_a = tokens[i][j]) === null || _a === void 0 ? void 0 : _a.animate();
                }
                else {
                    (_b = tokens[i][j]) === null || _b === void 0 ? void 0 : _b.draw();
                }
            }
        }
        this.previousTokens = JSON.parse(JSON.stringify(tokens));
    }
    isNewToken(token) {
        if (!token) {
            return false;
        }
        for (let row = 0; row < this.previousTokens.length; row++) {
            for (let col = 0; col < this.previousTokens[row].length; col++) {
                if (this.previousTokens[row][col] && this.previousTokens[row][col].x === token.x && this.previousTokens[row][col].y === token.y) {
                    return false;
                }
            }
        }
        return true;
    }
    highlightSelectedToken(selectedToken, i, j) {
        if (selectedToken && i == selectedToken.row && j == selectedToken.col) {
            const squareSize = config_1.default.SQUERE_SIZE;
            const x = this.boardService.getXFromColumn(j) - squareSize / 2;
            const y = this.boardService.getYFromRow(i) - squareSize / 2;
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgba(256,256,256,1)";
            this.ctx.fillRect(x, y, squareSize, squareSize);
            this.ctx.fillStyle = "rgba(0,0,150,0.75)";
            this.ctx.fillRect(x, y, squareSize, squareSize);
        }
    }
    drawNextTokens(nextTokens) {
        var y = 25;
        const squareSize = config_1.default.SQUERE_SIZE;
        for (let x = 380; x <= 450; x += 35) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgb(255,255,255)";
            this.ctx.arc(x, y, (squareSize / 3) - 3, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle = nextTokens[(x - 380) / 35].color;
            this.ctx.arc(x, y, (squareSize / 3) - 3, 0, 2 * Math.PI);
            this.ctx.fill();
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
        this.drawNextTokens(metadata.nextTokens);
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

},{"../config/config":5,"../services/boardService":7}],2:[function(require,module,exports){
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
    animate() {
        let start, previousTimeStamp;
        let done = false;
        function step(timeStamp) {
            if (start === undefined) {
                start = timeStamp;
            }
            const elapsed = timeStamp - start;
            if (previousTimeStamp !== timeStamp) {
                // Math.min() is used here to make sure the element stops at exactly 200px
                const count = Math.min(0.05 * elapsed, (50 / 2) - 3);
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.arc(this.x, this.y, count, 0, 2 * Math.PI);
                this.ctx.fill();
                if (count === (50 / 2) - 3)
                    done = true;
            }
            if (elapsed < 2000) {
                // Stop the animation after 2 seconds
                previousTimeStamp = timeStamp;
                if (!done) {
                    window.requestAnimationFrame(step.bind(this));
                }
            }
        }
        window.requestAnimationFrame(step.bind(this));
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
const pathFinder_1 = __importDefault(require("../services/pathFinder"));
const pointsCounter_1 = __importDefault(require("../services/pointsCounter"));
const boardService_1 = __importDefault(require("../services/boardService"));
class Game {
    constructor() {
        this.boardService = new boardService_1.default();
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
    renderScore() {
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
        this.metadata.nextTokens = [];
        this.generateTokens(9);
        this.fillInTokens();
        this.generateTokens(3);
    }
    generateTokens(n = 3) {
        let i = 0;
        while (i < n) {
            let col = Math.floor(Math.random() * 9);
            let row = Math.floor(Math.random() * 9);
            if (this.metadata.tokens[row][col] == null) {
                this.metadata.nextTokens.push(new circle_1.Circle(Object.values(colors_1.Colors)[Math.floor(Math.random() * this.getLevel())], this.board['ctx'], col * 55 + 75, row * 55 + 75));
                // this.metadata.nextTokens.push( new Circle(Colors.Blue,
                // this.board['ctx'], col * 55 + 75 , row * 55 + 75));
                i++;
            }
        }
    }
    fillInTokens() {
        for (const token of this.metadata.nextTokens) {
            const col = this.boardService.getColumnFromX(token.x);
            const row = this.boardService.getRowFromY(token.y);
            this.metadata.tokens[row][col] = token;
        }
        this.metadata.nextTokens = [];
    }
    onClick(col, row) {
        if (this.state != GameState.Running) {
            return;
        }
        if (this.metadata.selectedToken) {
            if (this.pathFinderService.isLegalMove(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row, this.metadata.tokens)) {
                this.handleLegalMove(col, row);
                this.fillInTokens();
                this.generateTokens(3);
            }
            else {
                this.metadata.selectedToken = null;
            }
        }
        else if (this.metadata.tokens[row][col] != null) {
            this.metadata.selectedToken = { token: this.metadata.tokens[row][col], row, col };
        }
        this.updateScore();
        this.board.draw(this.state, this.metadata);
    }
    handleLegalMove(col, row) {
        let path = this.pathFinderService.getPath(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row, this.metadata.tokens);
        this.metadata.path = this.normalizePath(path);
        this.swapTokens(col, row);
    }
    updateScore() {
        this.metadata.score += this.pointsCounterService.countPoints(this.metadata.tokens);
        this.renderScore();
    }
    swapTokens(col, row) {
        this.updateCoordsForSelectedToken(col, row);
        this.metadata.tokens[row][col] = this.metadata.selectedToken.token;
        this.metadata.tokens[this.metadata.selectedToken.row][this.metadata.selectedToken.col] = null;
        this.metadata.selectedToken = null;
    }
    updateCoordsForSelectedToken(col, row) {
        this.metadata.selectedToken.token.x = this.boardService.getXFromColumn(col);
        this.metadata.selectedToken.token.y = this.boardService.getYFromRow(row);
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

},{"../services/boardService":7,"../services/pathFinder":8,"../services/pointsCounter":9,"./board":1,"./circle":2,"./colors":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
}
Config.SQUERE_SIZE = 50;
Config.BOARD_SIZE = 9;
Config.MARGIN = 5;
Config.BOARD_OFFSET = 75;
exports.default = Config;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./components/game");
window.addEventListener('load', () => {
    const game = new game_1.Game();
});

},{"./components/game":4}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
class BoardService {
    getRowFromY(y) {
        return Math.floor((y - config_1.default.BOARD_OFFSET) / (config_1.default.SQUERE_SIZE + config_1.default.MARGIN));
    }
    getColumnFromX(x) {
        return Math.floor((x - config_1.default.BOARD_OFFSET) / (config_1.default.SQUERE_SIZE + config_1.default.MARGIN));
    }
    getXFromColumn(col) {
        return col * (config_1.default.SQUERE_SIZE + config_1.default.MARGIN) + config_1.default.BOARD_OFFSET;
    }
    getYFromRow(row) {
        return row * (config_1.default.SQUERE_SIZE + config_1.default.MARGIN) + config_1.default.BOARD_OFFSET;
    }
}
exports.default = BoardService;

},{"../config/config":5}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PointsCounter {
    countPoints(tokens) {
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

},{}]},{},[6]);
