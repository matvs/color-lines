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
//# sourceMappingURL=boardService.js.map