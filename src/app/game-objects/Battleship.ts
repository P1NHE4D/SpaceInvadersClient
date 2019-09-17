import {Direction, GameBoundaries, GameObject} from "./GameObject";

export class Battleship extends GameObject {
  private movementSpeed: number = 10;
  private score: number = 0;
  private lives: number = 3;

  /**
   * Instantiates a new battleship
   * @param image image that depicts the battleship
   * @param xPos initial y-position of the battleship
   * @param yPos initial x-position of the battleship
   * @param boundaries boundaries of the canvas
   */
  constructor(
    image: HTMLImageElement,
    xPos: number,
    yPos: number,
    boundaries: GameBoundaries,
  ) {
    super(image, xPos, yPos, boundaries);
    this.xPos -= (this.width / 2);  // centers the ship with respect to its width
    this.yPos -= this.height;
  }

  /**
   * Moves the battleship in the desired direction by a predefined value
   * @param direction Desired direction
   */
  move(direction: Direction): void {
    switch(direction) {
      case Direction.LEFT:
        if (this.xPos - this.movementSpeed > this.boundaries.leftBoundary) {
          this.xPos -= this.movementSpeed;
        }
        break;
      case Direction.RIGHT:
        if (this.xPos + this.movementSpeed + this.width < this.boundaries.rightBoundary) {
          this.xPos += this.movementSpeed;
        }
        break;
    }
  }

  getScore(): number {
    return this.score;
  }

  addToScore(points: number) {
    this.score += points;
  }

  subtractFromScore(points: number) {
    if (this.score  - points >= 0) {
      this.score -= points;
    } else {
      this.score = 0;
    }

  }

  getLives(): number {
    return this.lives;
  }

  removeLife(): void {
    if (this.lives > 0) {
      --this.lives;
    }
  }

  addLife(): void {
    ++this.lives;
  }

}
