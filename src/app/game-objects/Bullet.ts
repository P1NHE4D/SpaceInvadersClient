import {Direction, GameBoundaries, GameObject} from "./GameObject";

export class Bullet extends GameObject {
  private readonly movementSpeed: number = 2;

  /**
   * Instantiates a new bullet
   * @param image image that depicts the bullet
   * @param xPos initial x-position of the bullet
   * @param yPos initial y-position of the bullet
   * @param ctx canvas rendering context
   * @param frames number of frames per image
   * @param ticksPerFrame ticks between switching from one frame to the next
   */
  constructor(
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number,
    frames?: number,
    ticksPerFrame?: number
  ) {
    super(image, xPos, yPos, ctx, frames, ticksPerFrame);
  }

  /**
   * Moves in the desired direction by a predefined value
   * @param direction Direction in which the bullet is supposed to travel
   * @param boundaryReached Function that should be called as soon as the bullet reaches the boundary
   */
  move(direction: Direction, boundaryReached: () => any): void {
    switch(direction) {
      case Direction.UP:
        if (this.yPos - this.movementSpeed > 0) {
          this.yPos -= this.movementSpeed;
        } else {
          boundaryReached();
        }
        break;
      case Direction.DOWN:
        if (this.yPos + this.movementSpeed < this.ctx.canvas.height) {
          this.yPos += this.movementSpeed;
        } else {
          boundaryReached();
        }
        break;
    }
  }

  /**
   * Checks if the bullet intersects with a game world object
   * @param xPos x-position of game world object
   * @param width width of game world object
   * @param yPos y-position of game world object
   * @param height height of game world object
   */
  intersectsWithObject(xPos: number, width: number, yPos: number, height: number) {
    return (
        (this.xPos <= xPos + width && this.xPos >= xPos) ||
        (this.xPos + this.width >= xPos && this.xPos + this.width <= xPos + width)
      ) && (
        (this.yPos <= yPos + height && this.yPos >= yPos) ||
        (this.yPos + this.height >= yPos && this.yPos + this.height <= yPos + height)
      )
  }

}
