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
    animate() {
        let start, previousTimeStamp;
        let done = false;
        function step(timeStamp) {
            if (start === undefined) {
                start = timeStamp;
            }
            const elapsed = timeStamp - start;
            if (previousTimeStamp !== timeStamp) {
                // Math.min() is used here to make sure the element stops at exactly 200px
                const count = Math.min(0.05 * elapsed, (50 / 2) - 3);
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.arc(this.x, this.y, count, 0, 2 * Math.PI);
                this.ctx.fill();
                if (count === (50 / 2) - 3)
                    done = true;
            }
            if (elapsed < 2000) {
                // Stop the animation after 2 seconds
                previousTimeStamp = timeStamp;
                if (!done) {
                    window.requestAnimationFrame(step.bind(this));
                }
            }
        }
        window.requestAnimationFrame(step.bind(this));
    }
    ;
}
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map