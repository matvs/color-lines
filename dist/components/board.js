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
//# sourceMappingURL=board.js.map