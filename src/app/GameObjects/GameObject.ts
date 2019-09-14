export class GameObject {

  /**
   * Instantiates a new game object
   * @param xPos initial x-position of the game object
   * @param yPos initial y-position of the game object
   * @param width width of the game object
   * @param height height of the game object
   * */
  constructor(
    protected xPos: number,
    protected yPos: number,
    protected width: number,
    protected height: number
  ) {}

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
