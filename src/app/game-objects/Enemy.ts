import {Direction, GameBoundaries, GameObject} from "./GameObject";

export class Enemy extends GameObject {
  private readonly movementSpeed: number = 6;

  /**
   * Instantiates a new enemy
   * @param image image that depicts the enemy
   * @param xPos initial x-position of enemy
   * @param yPos initial y-position of enemy
   * @param boundaries boundaries of the canvas
   * @param hitScore score rewareded for hitting the enemy
   * @param movementDirection movement direction of the enemy
   */
  constructor(
    image: HTMLImageElement,
    xPos: number,
    yPos: number,
    boundaries: GameBoundaries,
    private hitScore: number,
    private movementDirection: Direction
  ) {
    super(image, xPos, yPos, boundaries);
  }

  /**
   * Moves the enemy in the desired direction by a predefined value
   */
  public move(): void {
    switch(this.movementDirection) {
      case Direction.RIGHT:
        if ((this.xPos + this.movementSpeed + this.width) < this.boundaries.rightBoundary) {
          this.xPos += this.movementSpeed;
        }
        break;
      case Direction.LEFT:
        if (this.xPos - this.movementSpeed > this.boundaries.leftBoundary) {
          this.xPos -= this.movementSpeed;
        }
        break;
      case Direction.DOWN:
        if (this.yPos + this.movementSpeed + this.height < this.boundaries.lowerBoundary) {
          this.yPos += this.movementSpeed;
        }
        break;
    }
  }

  /**
   * Checks if the enemy reached a boundary with respect to its current movement direction
   */
  public boundaryReached(): boolean {
    switch(this.movementDirection) {
      case Direction.RIGHT:
        return (this.xPos + this.width + this.movementSpeed) >= this.boundaries.rightBoundary;
      case Direction.LEFT:
        return this.xPos - this.movementSpeed <= this.boundaries.leftBoundary;
      case Direction.DOWN:
        return this.yPos + this.movementSpeed >= this.boundaries.lowerBoundary;
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
