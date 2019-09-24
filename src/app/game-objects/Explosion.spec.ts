import {Explosion} from "./Explosion";

describe('Explosion', () => {
  let explosion: Explosion;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 800;
    image = new Image();
    image.src = '/assets/gameObjects/Explosion.png';
    explosion = new Explosion(image, ctx, 100, 100, 32, 0);
  });

  it('should execute the callback function once the animation is finished', () => {
    let callbackExecuted: boolean = false;
    for (let i = 0; i < 32; ++i) {
      expect(callbackExecuted).toBeFalsy();
      explosion.update(() => {
        callbackExecuted = true;
      });
    }
    expect(callbackExecuted).toBeTruthy();
  });

});
