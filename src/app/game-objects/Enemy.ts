import {Direction, GameObject} from "./GameObject";

export class Enemy extends GameObject {
  private readonly movementDistance: number = 6;

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
        if ((this.xPos + this.movementDistance + this.width) < this.ctx.canvas.width) {
          this.xPos += this.movementDistance;
        }
        break;
      case Direction.LEFT:
        if (this.xPos - this.movementDistance > 0) {
          this.xPos -= this.movementDistance;
        }
        break;
      case Direction.DOWN:
        if (this.yPos + 10 + this.height < this.ctx.canvas.height) {
          this.yPos += 10;
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
        return (this.xPos + this.width + this.movementDistance) >= this.ctx.canvas.width;
      case Direction.LEFT:
        return this.xPos - this.movementDistance <= 0;
      case Direction.DOWN:
        return this.yPos + this.movementDistance >= this.ctx.canvas.height;
    }
  }

  getMovementDirection(): Direction {
    return this.movementDirection;
  }

  setMovementDirection(direction: Direction): void {
    this.movementDirection = direction;
  }

  getHitScore(): number {
    return this.hitScore;
  }
}
