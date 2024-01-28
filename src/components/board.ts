import { GameState, GameMetadata, SelectedTokenInterface } from "./game";
import { drawable } from "./drawable";
import { Circle } from "./circle";
import BoardService  from "../services/boardService";
import Config from "../config/config";

export class Board implements drawable {
    private ctx: CanvasRenderingContext2D;
    private board: Array<Array<Circle>>;
    private boardService: BoardService;
    private previousTokens: Array<Array<Circle | null>> = [];

    constructor(private rows: number, private cols: number, private canvas: HTMLCanvasElement) {
        if (canvas.getContext("2d") == null) {
            throw new Error("Canvas not supported!");
        }
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.canvas.addEventListener('mousedown', ($event) => this.onClick($event));

        this.boardService = new BoardService();
    }


    private drawBackground(): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,150,0,0.2)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawFields(path: Map<any, any>): void {
        const squareSize = Config.SQUERE_SIZE;
        const margin = Config.MARGIN;
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

    private drawPath(row, col, x, y, path: Map<any, any>): void {
        const squareSize = 50;
        const margin = 5;
        if(path?.has(`${col},${row}`)) {
            const moves = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            const prevNextMoves = [];
            for (const [dx, dy] of moves) {
                if(path.has(`${col + dx},${row + dy}`)) {
                    prevNextMoves.push([col + dx, row + dy]);
                }
            }

            for (const [dx, dy] of prevNextMoves) {
                const diffX = col - dx
                const diffY = row - dy
                this.ctx.beginPath();
                if(diffX > 0) {
                    this.ctx.fillStyle = "rgba(256,256,256,1)";
                    this.ctx.strokeStyle = "rgba(256,256,256,1)";
                    this.ctx.lineWidth = 4;
                    this.ctx.moveTo(x, y + squareSize / 2);
                    this.ctx.lineTo(x + squareSize/2, y + squareSize / 2);
                    this.ctx.stroke();;
                } else if(diffX < 0) {
                    this.ctx.fillStyle = "rgba(256,256,256,1)";
                    this.ctx.strokeStyle = "rgba(256,256,256,1)";
                    this.ctx.lineWidth = 4;
                    this.ctx.moveTo(x + squareSize/2, y + squareSize / 2);
                    this.ctx.lineTo(x + squareSize, y + squareSize / 2);
                    this.ctx.stroke();;
                } else if (diffY > 0) {
                    this.ctx.fillStyle = "rgba(256,256,256,1)";
                    this.ctx.strokeStyle = "rgba(256,256,256,1)";
                    this.ctx.lineWidth = 4;
                    this.ctx.moveTo(x + squareSize / 2, y);
                    this.ctx.lineTo(x + squareSize / 2, y + squareSize/2);
                    this.ctx.stroke();;
                } else if (diffY < 0) {
                    this.ctx.fillStyle = "rgba(256,256,256,1)";
                    this.ctx.strokeStyle = "rgba(256,256,256,1)";
                    this.ctx.lineWidth = 4;
                    this.ctx.moveTo(x + squareSize / 2, y + squareSize/2);
                    this.ctx.lineTo(x + squareSize / 2, y + squareSize);
                    this.ctx.stroke();;
                }
                
            }
        }
    }


    private drawCircles(tokens: Array<Array<Circle | null>>, selectedToken: SelectedTokenInterface): void {
        for (let i = 0; i < tokens.length; i++) {
            for (let j = 0; j < tokens[i].length; j++) {
                this.highlightSelectedToken(selectedToken, i, j);
                
                if(this.isNewToken(tokens[i][j])) {
                    tokens[i][j]?.animate();
                } else {
                    tokens[i][j]?.draw();
                }
            }
        }
        this.previousTokens = JSON.parse(JSON.stringify(tokens))
    }

    private isNewToken(token: Circle | null): boolean {
        if(!token) {
            return false;
        }
        for (let row = 0; row < this.previousTokens.length; row++) {
            for (let col = 0; col < this.previousTokens[row].length; col++) {
                if(this.previousTokens[row][col] && this.previousTokens[row][col].x === token.x && this.previousTokens[row][col].y === token.y) {
                    return false;
                }
            }
        }

        return true;
    }

    private highlightSelectedToken(selectedToken: SelectedTokenInterface, i: number, j: number): void {
        if(selectedToken && i == selectedToken.row && j == selectedToken.col) {
            const squareSize = Config.SQUERE_SIZE;
            const x = this.boardService.getXFromColumn(j) - squareSize/2;
            const y = this.boardService.getYFromRow(i) - squareSize/2;
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgba(256,256,256,1)";
            this.ctx.fillRect(x, y, squareSize, squareSize);
            this.ctx.fillStyle = "rgba(0,0,150,0.75)";
            this.ctx.fillRect(x, y, squareSize, squareSize);
        }
    }

    private drawNextTokens(nextTokens: Array<Circle>): void {
        var y = 25;
        const squareSize = Config.SQUERE_SIZE;
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

    private onClickListeners: Array<(x: number, y: number) => void> = [];

    public addOnClickListener(callback: (x: number, y: number) => void): void {
        this.onClickListeners.push(callback);
    }


    public draw(state: GameState, metadata: GameMetadata): void {

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
    private onClick($event: any): void {
        var x = $event.pageX - this.canvas.offsetLeft;
        var y = $event.pageY - this.canvas.offsetTop;
        for (const listener of this.onClickListeners) {
            listener(Math.floor((x - 50) / 55), Math.floor((y - 50) / 55));
        }
    }
}