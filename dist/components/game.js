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
//# sourceMappingURL=game.js.map