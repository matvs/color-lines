import { drawable } from "./drawable";
import { Colors } from "./colors";

export class Circle implements drawable {

    constructor(public color: Colors, private ctx: CanvasRenderingContext2D, public x: number, public y: number) {

    }

    public draw(): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, (50 / 2) - 3, 0, 2 * Math.PI);
        this.ctx.fill();
    };


    public animate(): void {
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
                if (count === (50 / 2) - 3) done = true;
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

      
    };
}