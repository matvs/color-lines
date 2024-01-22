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
                this.metadata.tokens[row][col] = new circle_1.Circle(colors_1.Colors.Blue, this.board['ctx'], col * 55 + 75, row * 55 + 75);
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
//# sourceMappingURL=game.js.map