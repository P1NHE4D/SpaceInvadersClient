import {Explosion} from "./Explosion";
import {GameObject} from "./GameObject";

describe('GameObject', () => {
  let gameObj: GameObject;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;
  let initialX: number;
  let initialY: number;
  let initialFrames: number;
  let initialTicks: number;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 800;
    initialX = 100;
    initialY = 100;
    initialFrames = 32;
    initialTicks = 0;
    image = new Image();
    image.src = '/assets/gameObjects/Explosion.png';
    gameObj = new Explosion(image, ctx, initialX, initialY, initialFrames, initialTicks);
  });

  it('should return the x value', () => {
    expect(gameObj.x).toBe(initialX);
  });

  it('should return the y value', () => {
    expect(gameObj.y).toBe(initialY);
  });

  it('should return the width', () => {
    expect(gameObj.width).toBe(image.width / initialFrames);
  });

  it('should return the height', () => {
    expect(gameObj.height).toBe(image.height);
  });
});
