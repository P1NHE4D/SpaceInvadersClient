import {Direction, GameObject} from "./GameObject";

export abstract class MovableGameObject extends GameObject {

  protected constructor(
    img: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number,
    protected _movementSpeed: number,
    frames?: number,
    ticksPerFrames?: number
  ) {
    super(img, ctx, xPos, yPos, frames, ticksPerFrames);
  }

  abstract move(direction: Direction);

  get movementSpeed(): number {
    return this._movementSpeed;
  }
}
