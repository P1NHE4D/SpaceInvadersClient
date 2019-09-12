import {GameObject} from "./GameObject";
import {Direction} from "../enums/direction";

export class Enemy extends GameObject {
  private readonly movementSpeed: number = 6;

  /**
   * Instantiates a new enemy
   * @param xPos initial x-position of enemy
   * @param yPos initial y-position of enemy
   * @param width Width of the enemy
   * @param height Height of the enemy
   * @param leftBoundary Left boundary of game area
   * @param rightBoundary Right boundary of game area
   * @param lowerBoundary Lower boundary of game area
   */
  constructor(
    xPos: number,
    yPos: number,
    width: number,
    height: number,
    private leftBoundary: number,
    private rightBoundary: number,
    private lowerBoundary: number
  ) {
    super(xPos, yPos, width, height);
  }

  /**
   * Moves the enemy in the desired direction by a predefined value
   * @param direction Desired movement direction
   */
  public move(direction: Direction): void {
    switch(direction) {
      case Direction.RIGHT:
        if (this.xPos + this.movementSpeed < this.rightBoundary) {
          this.xPos += this.movementSpeed;
        }
        break;
      case Direction.LEFT:
        if (this.xPos - this.movementSpeed > this.leftBoundary) {
          this.xPos -= this.movementSpeed;
        }
        break;
      case Direction.DOWN:
        if (this.yPos + this.movementSpeed < this.lowerBoundary) {
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
        return this.xPos + this.movementSpeed >= this.rightBoundary;
      case Direction.LEFT:
        return this.xPos - this.movementSpeed <= this.leftBoundary;
      case Direction.DOWN:
        return this.yPos + this.movementSpeed >= this.lowerBoundary;
    }
  }

}
