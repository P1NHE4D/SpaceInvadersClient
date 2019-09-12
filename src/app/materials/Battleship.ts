import {GameObject} from "./GameObject";
import {Direction} from "../enums/direction";

export class Battleship extends GameObject {

  /**
   * Instantiates a new battleship
   * @param xPos initial y-position of the battleship
   * @param yPos initial x-position of the battleship
   * @param width width of the battleship
   * @param height height of the battleship
   * @param leftBoundary left game boundary
   * @param rightBoundary right game boundary
   */
  constructor(
    xPos: number,
    yPos: number,
    width: number,
    height: number,
    private readonly leftBoundary: number,
    private readonly rightBoundary: number,
  ) {
    super(xPos, yPos, width, height);
    this.rightBoundary -= this.width;
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
        if (this.xPos - 12 > this.leftBoundary) {
          this.xPos -= 12;
        }
        break;
      case Direction.RIGHT:
        if (this.xPos + 12 < this.rightBoundary) {
          this.xPos += 12;
        }
        break;
    }
  }

}
