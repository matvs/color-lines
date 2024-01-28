import Config from '../config/config';

export default class BoardService {
    public getRowFromY(y: number): number {
        return Math.floor((y - Config.BOARD_OFFSET) / (Config.SQUERE_SIZE + Config.MARGIN));
    }

    public getColumnFromX(x: number): number {
        return Math.floor((x - Config.BOARD_OFFSET) / (Config.SQUERE_SIZE + Config.MARGIN));
    }

    getXFromColumn(col: number): number {
        return col * (Config.SQUERE_SIZE + Config.MARGIN) + Config.BOARD_OFFSET;
    }

    getYFromRow(row: number): number {      
        return row * (Config.SQUERE_SIZE + Config.MARGIN) + Config.BOARD_OFFSET;
    }
}