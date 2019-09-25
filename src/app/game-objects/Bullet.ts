import {Direction} from "./GameObject";
import {MovableGameObject} from "./MovableGameObject";

export class Bullet extends MovableGameObject {

  /**
   * Instantiates a new bullet
   * @param image image that depicts the bullet
   * @param xPos initial x-position of the bullet
   * @param yPos initial y-position of the bullet
   * @param ctx canvas rendering context
   */
  constructor(
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    xPos: number,
    yPos: number
  ) {
    super(image, ctx, xPos, yPos, 2);
  }

  /**
   * Moves in the desired direction by a predefined value
   * @param direction Direction in which the bullet is supposed to travel
   * @param boundaryReached Function that should be called as soon as the bullet reaches the boundary
   */
  move(direction: Direction, boundaryReached?: () => any): void {
    switch(direction) {
      case Direction.UP:
        if (this._yPos - this._movementSpeed > 0) {
          this._yPos -= this._movementSpeed;
        } else if (boundaryReached()){
          boundaryReached();
        }
        break;
      case Direction.DOWN:
        if (this._yPos + this._movementSpeed < this._ctx.canvas.height) {
          this._yPos += this._movementSpeed;
        } else if(boundaryReached()) {
          boundaryReached();
        }
        break;
    }
  }

  /**
   * Checks if the bullet intersects with a game world object
   * @param xPos x-position of game world object
   * @param width _width of game world object
   * @param yPos y-position of game world object
   * @param height _height of game world object
   */
  intersectsWithObject(xPos: number, width: number, yPos: number, height: number) {
    return (
        (this._xPos <= xPos + width && this._xPos >= xPos) ||
        (this._xPos + this._width >= xPos && this._xPos + this._width <= xPos + width)
      ) && (
        (this._yPos <= yPos + height && this._yPos >= yPos) ||
        (this._yPos + this._height >= yPos && this._yPos + this._height <= yPos + height)
      )
  }

}
