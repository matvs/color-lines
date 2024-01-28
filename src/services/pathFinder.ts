export default class PathFinder {
    public isLegalMove(col: number, row: number, selectedCol: number, selectedRow: number, tokens): boolean {
        if (col == selectedCol && row == selectedRow) {
            return false;
        }
        return this.getPath(col, row, selectedCol, selectedRow, tokens).length > 0;
    }


    public getPath(col: number, row: number, selectedCol: number, selectedRow: number, tokens): any {
        const isInBound = (x: number, y: number): boolean => x >= 0 && x < 9 && y >= 0 && y < 9;
        const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const moveToDirection = {
            0: 'down',
            1: 'up',
            2: 'right',
            3: 'left'
        }

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
                console.log(sequence)
                return sequence;;
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