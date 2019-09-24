import {Direction, GameObject} from "./GameObject";

export class Enemy extends GameObject {
  private readonly movementDistanceLeftRight: number = 6;
  private readonly movementDistanceDown: number = 10;

  /**
   * Instantiates a new enemy
   * @param image image that depicts the enemy
   * @param xPos initial x-position of enemy
   * @param yPos initial y-position of enemy
   * @param ctx canvas rendering context
   * @param hitScore score rewarded for hitting the enemy
   * @param movementDirection movement direction of the enemy
   * @param frames number of frames per image
   * @param ticksPerFrame ticks between switching from one frame to the next
   */
  constructor(
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number,
    private hitScore: number = 10,
    private movementDirection: Direction = Direction.RIGHT,
    frames?: number,
    ticksPerFrame?: number
  ) {
    super(image, xPos, yPos, ctx, frames, ticksPerFrame);
  }

  /**
   * Moves the enemy in the desired direction by a predefined value
   */
   move(): void {
    switch(this.movementDirection) {
      case Direction.RIGHT:
        if ((this.xPos + this.movementDistanceLeftRight + this.width) < this.ctx.canvas.width) {
          this.xPos += this.movementDistanceLeftRight;
        }
        break;
      case Direction.LEFT:
        if (this.xPos - this.movementDistanceLeftRight > 0) {
          this.xPos -= this.movementDistanceLeftRight;
        }
        break;
      case Direction.DOWN:
        if (this.yPos + this.movementDistanceDown + this.height < this.ctx.canvas.height) {
          this.yPos += this.movementDistanceDown;
        }
        break;
    }
  }

  /**
   * Checks if the enemy reached a boundary with respect to its current movement direction
   */
   boundaryReached(): boolean {
    switch(this.movementDirection) {
      case Direction.RIGHT:
        return (this.xPos + this.width + this.movementDistanceLeftRight) >= this.ctx.canvas.width;
      case Direction.LEFT:
        return this.xPos - this.movementDistanceLeftRight <= 0;
      case Direction.DOWN:
        return this.yPos + this.movementDistanceDown >= this.ctx.canvas.height;
    }
  }

  /**
   * @return returns the current movement direction
   */
  getMovementDirection(): Direction {
    return this.movementDirection;
  }

  /**
   * Sets the movement direction
   * @param direction desired direction
   */
  setMovementDirection(direction: Direction): void {
    this.movementDirection = direction;
  }

  /**
   * Returns the hit score of the enemy
   */
  getHitScore(): number {
    return this.hitScore;
  }
}
