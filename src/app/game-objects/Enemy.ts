import {GameBoundaries, GameObject} from "./GameObject";
import {Direction} from "../enums/direction";

export class Enemy extends GameObject {
  private readonly movementSpeed: number = 6;

  /**
   * Instantiates a new enemy
   * @param image image that depicts the enemy
   * @param xPos initial x-position of enemy
   * @param yPos initial y-position of enemy
   * @param boundaries boundaries of the canvas
   */
  constructor(
    image: HTMLImageElement,
    xPos: number,
    yPos: number,
    boundaries: GameBoundaries,
  ) {
    super(image, xPos, yPos, boundaries);
  }

  /**
   * Moves the enemy in the desired direction by a predefined value
   * @param direction Desired movement direction
   */
  public move(direction: Direction): void {
    switch(direction) {
      case Direction.RIGHT:
        if (this.xPos + this.movementSpeed < this.boundaries.rightBoundary) {
          this.xPos += this.movementSpeed;
        }
        break;
      case Direction.LEFT:
        if (this.xPos - this.movementSpeed > this.boundaries.leftBoundary) {
          this.xPos -= this.movementSpeed;
        }
        break;
      case Direction.DOWN:
        if (this.yPos + this.movementSpeed < this.boundaries.lowerBoundary) {
          this.yPos += this.movementSpeed;
        }
        break;
    }
  }

  /**
   * Checks if the enemy reached a boundary with respect to its current movement direction
   * @param direction movement direction of the enemy
   */
  public boundaryReached(direction: Direction): boolean {
    switch(direction) {
      case Direction.RIGHT:
        return this.xPos + this.movementSpeed >= this.boundaries.rightBoundary;
      case Direction.LEFT:
        return this.xPos - this.movementSpeed <= this.boundaries.leftBoundary;
      case Direction.DOWN:
        return this.yPos + this.movementSpeed >= this.boundaries.lowerBoundary;
    }
  }

}
