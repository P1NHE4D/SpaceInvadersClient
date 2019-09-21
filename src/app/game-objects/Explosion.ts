import {GameObject} from "./GameObject";

export class Explosion extends GameObject {

  constructor(
    image: HTMLImageElement,
    xPos: number,
    yPos: number,
    ctx: CanvasRenderingContext2D,
    frames: number,
    ticksPerFrame: number
  ) {
    super(image, xPos, yPos, ctx, frames, ticksPerFrame)
  }

  update(animationFinished?: () => any): void {
    if(animationFinished !== null && this.frameIndex === this.frames - 1) {
      animationFinished();
    } else {
      super.update();
    }
  }

}
