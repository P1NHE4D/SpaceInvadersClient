import {Direction, GameObject} from "./GameObject";

export class Enemy extends GameObject {
  private readonly _horizontalMovementSpeed: number = 6;
  private readonly _verticalMovementSpeed: number = 10;

  /**
   * Instantiates a new enemy
   * @param image image that depicts the enemy
   * @param xPos initial x-position of enemy
   * @param yPos initial y-position of enemy
   * @param ctx canvas rendering context
   * @param _hitScore score rewarded for hitting the enemy
   * @param _movementDirection movement direction of the enemy
   * @param frames number of _frames per image
   * @param ticksPerFrame ticks between switching from one frame to the next
   */
  constructor(
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number,
    private _hitScore: number = 10,
    private _movementDirection: Direction = Direction.RIGHT,
    frames?: number,
    ticksPerFrame?: number
  ) {
    super(image, xPos, yPos, ctx, frames, ticksPerFrame);
  }

  /**
   * Moves the enemy in the desired direction by a predefined value
   */
   move(): void {
    switch(this._movementDirection) {
      case Direction.RIGHT:
        if ((this._xPos + this._horizontalMovementSpeed + this._width) < this._ctx.canvas.width) {
          this._xPos += this._horizontalMovementSpeed;
        }
        break;
      case Direction.LEFT:
        if (this._xPos - this._horizontalMovementSpeed > 0) {
          this._xPos -= this._horizontalMovementSpeed;
        }
        break;
      case Direction.DOWN:
        if (this._yPos + this._verticalMovementSpeed + this._height < this._ctx.canvas.height) {
          this._yPos += this._verticalMovementSpeed;
        }
        break;
    }
  }

  /**
   * Checks if the enemy reached a boundary with respect to its current movement direction
   */
   boundaryReached(): boolean {
    switch(this._movementDirection) {
      case Direction.RIGHT:
        return (this._xPos + this._width + this._horizontalMovementSpeed) >= this._ctx.canvas.width;
      case Direction.LEFT:
        return this._xPos - this._horizontalMovementSpeed <= 0;
      case Direction.DOWN:
        return this._yPos + this._verticalMovementSpeed >= this._ctx.canvas.height;
    }
  }

  /**
   * @return returns the current movement direction
   */
  get movementDirection(): Direction {
    return this._movementDirection;
  }

  /**
   * Sets the movement direction
   * @param direction desired direction
   */
  set movementDirection(direction: Direction) {
    this._movementDirection = direction;
  }

  /**
   * Returns the hit score of the enemy
   */
  get hitScore(): number {
    return this._hitScore;
  }
}
