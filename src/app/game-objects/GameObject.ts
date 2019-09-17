export class GameObject {
  protected width: number;
  protected height: number;
  /**
   * Instantiates a new game object
   * @param image image that depicts the game object
   * @param xPos initial x-position of the game object
   * @param yPos initial y-position of the game object
   * @param boundaries boundaries of the canvas
   * */
  constructor(
    private image: HTMLImageElement,
    protected xPos: number,
    protected yPos: number,
    protected boundaries: GameBoundaries

  ) {
    this.width = image.width;
    this.height = image.height;
  }

  /**
   * Draws the game object on the canvas according to its current x- and y-values
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.xPos, this.yPos);
  }

  /**
   * @return Returns x-position of game object
   */
  getX(): number {
    return this.xPos;
  }

  /**
   * @return Returns y-position of game object
   */
  getY(): number {
    return this.yPos;
  }

  /**
   * @return Returns width of game object
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * @return Returns height of game object
   */
  getHeight(): number {
    return this.height;
  }

}

export interface GameBoundaries {
  leftBoundary: number;
  rightBoundary: number;
  upperBoundary: number;
  lowerBoundary: number;
}

/**
 * Enum used for indicating the movement direction of an object
 */
export enum Direction{
  DOWN,
  UP,
  LEFT,
  RIGHT
}
