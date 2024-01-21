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
//# sourceMappingURL=board.js.map