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
}