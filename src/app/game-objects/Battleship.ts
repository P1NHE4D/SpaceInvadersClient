import {Direction, GameObject} from "./GameObject";

export class Battleship extends GameObject {
  private _movementSpeed: number = 4;
  private _score: number = 0;
  private _lives: number = 3;

  /**
   * Instantiates a new battleship
   * @param image image that depicts the battleship
   * @param xPos initial y-position of the battleship
   * @param yPos initial x-position of the battleship
   * @param ctx canvas rendering context
   * @param frames number of _frames per image
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
    this._xPos -= (this._width / 2);  // centers the ship with respect to its _width
    this._yPos -= this._height;
  }

  /**
   * Moves the battleship in the desired direction by a predefined value
   * @param direction Desired direction
   */
  move(direction: Direction): void {
    switch(direction) {
      case Direction.LEFT:
        if (this._xPos - this._movementSpeed > 0) {
          this._xPos -= this._movementSpeed;
        }
        break;
      case Direction.RIGHT:
        if (this._xPos + this._movementSpeed + this._width < this._ctx.canvas.width) {
          this._xPos += this._movementSpeed;
        }
        break;
    }
  }

  get score(): number {
    return this._score;
  }

  addToScore(points: number) {
    this._score += points;
  }

  subtractFromScore(points: number) {
    if (this._score  - points >= 0) {
      this._score -= points;
    } else {
      this._score = 0;
    }

  }

  get lives(): number {
    return this._lives;
  }

  removeLife(): void {
    if (this._lives > 0) {
      --this._lives;
    }
  }

  addLife(): void {
    ++this._lives;
  }

  get movementSpeed(): number {
    return this._movementSpeed;
  }

}
