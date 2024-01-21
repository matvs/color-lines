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
}
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map