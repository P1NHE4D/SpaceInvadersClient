import {GameObject} from "./GameObject";
import {Direction} from "../enums/direction";

export class Bullet extends GameObject {

  /**
   * Instantiates a new bullet
   * @param xPos initial x-position of the bullet
   * @param yPos initial y-position of the bullet
   * @param width width of the bullet
   * @param height height of the bullet
   * @param boundary travel boundary of the bullet
   */
  constructor(
    xPos: number,
    yPos: number,
    width: number,
    height: number,
    private boundary: number
  ) {
    super(xPos, yPos, width, height);
  }

  /**
   * Moves in the desired direction by a predefined value
   * @param direction Direction in which the bullet is supposed to travel
   * @param boundaryReached Function that should be called as soon as the bullet reaches the boundary
   */
  move(direction: Direction, boundaryReached: () => any): void {
    switch(direction) {
      case Direction.UP:
        if (this.yPos - 3 > this.boundary) {
          this.yPos -= 3;
        } else {
          boundaryReached();
        }
        break;
      case Direction.DOWN:
        if (this.yPos + 3 < this.boundary) {
          this.yPos += 3;
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
  public intersectsWithObject(xPos: number, width: number, yPos: number, height: number) {
    return (
        (this.xPos <= xPos + width && this.xPos >= xPos) ||
        (this.xPos + this.width >= xPos && this.xPos + this.width <= xPos + width)
      ) && (
        (this.yPos <= yPos + height && this.yPos >= yPos) ||
        (this.yPos + this.height >= yPos && this.yPos + this.height <= yPos + height)
      )
  }

}
