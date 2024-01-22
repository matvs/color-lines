import { Board } from "./board";
import { Circle } from "./circle";
import { Colors } from "./colors";
import PathFinder from "./services/pathFinder";
import PointsCounter from "./services/pointsCounter";

export class Game {
    private state: GameState;
    private metadata: GameMetadata;
    private board: Board;
    private pointsContainer: HTMLElement;
    private pathFinderService: PathFinder;
    private pointsCounterService: PointsCounter;

    constructor() {
        this.pathFinderService = new PathFinder();
        this.pointsCounterService = new PointsCounter();

        this.board = new Board(9, 9, document.getElementById("plotno") as HTMLCanvasElement);
        this.pointsContainer = document.getElementById("wynik") as HTMLElement;
        this.board.addOnClickListener((x, y) => this.onClick(x, y));
        this.init();

        this.run();
    }

    public getState(): GameState {
        return this.state;
    }

    public pause(): void {
        this.state = GameState.Paused;
    }

    public run(): void {
        this.state = GameState.Running;
        this.board.draw(this.state, this.metadata);

    }

    private renderResult(): void {
        this.pointsContainer.innerHTML = this.metadata.score.toString();
    }

    private getLevel(): number {
        return this.metadata.level;
    }

    private init(): void {
        const levelElements = (document.forms['level' as any] as any).elements;
        const checkedLevel = Array.from(levelElements).find((x: unknown): x is HTMLInputElement => (x as HTMLInputElement).checked == true);
        this.metadata = {} as GameMetadata;
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

    private generateTokens(n = 3): void {
        let i = 0;
        while (i < n) {
            let col = Math.floor(Math.random() * 9);
            let row = Math.floor(Math.random() * 9);
            if (this.metadata.tokens[row][col] == null) {
                this.metadata.tokens[row][col] = new Circle(Object.values(Colors)[Math.floor(Math.random() * this.getLevel())], 
                this.board['ctx'], col * 55 + 75 , row * 55 + 75);

                this.metadata.tokens[row][col] = new Circle(Colors.Blue,
                this.board['ctx'], col * 55 + 75 , row * 55 + 75);
                i++;
            }
        }
    }


    private onClick(col: number, row: number): void {
        if (this.state != GameState.Running) {
            return;
        }
        if (this.metadata.selectedToken) {
            if (this.pathFinderService.isLegalMove(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row, this.metadata.tokens)) {
                let path = this.pathFinderService.getPath(this.metadata.selectedToken.col, this.metadata.selectedToken.row, col, row, this.metadata.tokens);
                this.metadata.path = this.normalizePath(path)
                this.metadata.selectedToken.token.x = col * 55 + 75;
                this.metadata.selectedToken.token.y = row * 55 + 75;
                this.metadata.tokens[row][col] = this.metadata.selectedToken.token;
                this.metadata.tokens[this.metadata.selectedToken.row][this.metadata.selectedToken.col] = null;
                this.metadata.selectedToken = null;

                this.generateTokens();
             } else {
                this.metadata.selectedToken = null;
            }
        } else if (this.metadata.tokens[row][col] != null) { 
            this.metadata.selectedToken =  {token: this.metadata.tokens[row][col], row, col };
        }
        this.metadata.score += this.pointsCounterService.checkForPoints(this.metadata.tokens);
        this.board.draw(this.state, this.metadata);
    }


    private normalizePath(path: Array<Array<number>>): any {
        const moves = {
            'up': [0, -1],
            'down': [0, 1],
            'left': [-1, 0],
            'right': [1, 0]
        }
        const mapping = {
            'up': 'vertical',
            'down': 'vertical',
            'left': 'horizontal',
            'right': 'horizontal'
        }
        const pathMap = new Map();
        for (let i = 1; i < path.length ; i++) {
            const x = path[i][0] + moves[path[i][2]][0];
            const y = path[i][1] + moves[path[i][2]][1];
            pathMap.set('' + x + ',' + y, mapping[path[i][2]]);
        }

        console.log(pathMap)
        return pathMap;
    }

   
}

export enum GameState {
    Running,
    Paused,
    Ended
}

export interface GameMetadata {
    score: number;
    level: number;
    selectedToken: SelectedTokenInterface | null;
    tokens: Array<Array<Circle | null>>;
    path?: any;
}

export interface SelectedTokenInterface {
    token: Circle;
    row: number;
    col: number;
}