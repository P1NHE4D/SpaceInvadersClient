export abstract class GameObject {
  protected width: number;
  protected height: number;
  protected frameIndex: number = 0;
  protected tickCount: number = 0;
  /**
   * Instantiates a new game object
   * @param image image that depicts the game object
   * @param xPos initial x-position of the game object
   * @param yPos initial y-position of the game object
   * @param ctx canvas rendering context
   * @param frames frames of the image
   * @param ticksPerFrame refresh rate of the object
   * */
  protected constructor(
    private image: HTMLImageElement,
    protected xPos: number,
    protected yPos: number,
    protected ctx: CanvasRenderingContext2D,
    protected frames: number = 1,
    protected ticksPerFrame: number = 0

  ) {
    this.width = image.width / frames;
    this.height = image.height;
  }

  /**
   * Draws the game object on the canvas
   */
  render(): void {
    this.ctx.drawImage(
      this.image,
      this.frameIndex * this.width,
      0,
      this.width,
      this.height,
      this.xPos,
      this.yPos,
      this.width,
      this.height
    )
  }

  /**
   * Updates the frame of the game object
   */
  update(): void {
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames;
    }
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

/**
 * Enum used for indicating the movement direction of an object
 */
export enum Direction{
  DOWN,
  UP,
  LEFT,
  RIGHT
}
