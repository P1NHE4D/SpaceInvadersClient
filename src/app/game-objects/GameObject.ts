export abstract class GameObject {
  protected _width: number;
  protected _height: number;
  protected _frameIndex: number = 0;
  protected _tickCount: number = 0;
  /**
   * Instantiates a new game object
   * @param _image image that depicts the game object
   * @param _ctx canvas rendering context
   * @param _xPos initial x-position of the game object
   * @param _yPos initial y-position of the game object
   * @param _frames _frames of the image
   * @param _ticksPerFrame refresh rate of the object
   * */
  protected constructor(
    private _image: HTMLImageElement,
    protected _ctx: CanvasRenderingContext2D,
    protected _xPos: number,
    protected _yPos: number,
    protected _frames: number = 1,
    protected _ticksPerFrame: number = 0

  ) {
    this._width = _image.width / _frames;
    this._height = _image.height;
  }

  /**
   * Draws the game object on the canvas
   */
  render(): void {
    this._ctx.drawImage(
      this._image,
      this._frameIndex * this._width,
      0,
      this._width,
      this._height,
      this._xPos,
      this._yPos,
      this._width,
      this._height
    )
  }

  /**
   * Updates the frame of the game object
   */
  update(): void {
    this._tickCount += 1;
    if (this._tickCount > this._ticksPerFrame) {
      this._tickCount = 0;
      this._frameIndex = (this._frameIndex + 1) % this._frames;
    }
  }

  /**
   * @return Returns x-position of game object
   */
  get x(): number {
    return this._xPos;
  }

  /**
   * @return Returns y-position of game object
   */
  get y(): number {
    return this._yPos;
  }

  /**
   * @return Returns _width of game object
   */
  get width(): number {
    return this._width;
  }

  /**
   * @return Returns _height of game object
   */
  get height(): number {
    return this._height;
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
