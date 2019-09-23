import {Bullet} from "./Bullet";
import {Direction} from "./GameObject";
import {Battleship} from "./Battleship";

describe('Bullet', () => {
  let bullet: Bullet;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 800;
    image = new Image();
    image.src = '/assets/gameObjects/Bullet.png';
    bullet = new Bullet(image, ctx, 100, 600);
  });

  it('should move up', () => {
    let initialY = bullet.getY();
    let initialX = bullet.getX();
    for (let x = 0; x < 4; ++x) {
      bullet.move(Direction.UP);
    }
    let newY = bullet.getY();
    let newX = bullet.getX();
    expect(newY).toBe(initialY - 4 * 2);
    expect(newX).toBe(initialX);
  });

  it('should move down', () => {
    let initialY = bullet.getY();
    let initialX = bullet.getX();
    for (let x = 0; x < 4; ++x) {
      bullet.move(Direction.DOWN);
    }
    let newY = bullet.getY();
    let newX = bullet.getX();
    expect(newY).toBe(initialY + 4 * 2);
    expect(newX).toBe(initialX);
  });

  it('should intersect with object', () => {
    let bsImage = new Image();
    bsImage.src = '/assets/gameObjects/RedFighter.png';
    let battleship = new Battleship(bsImage, ctx, 100, 600);
    let intersection = bullet.intersectsWithObject(battleship.getX(), battleship.getWidth(), battleship.getY(), battleship.getHeight());
    expect(intersection).toBeTruthy();
  });

  it('should not intersect with object', () => {
    let intersection = bullet.intersectsWithObject(100, 40, 620, 19);
    expect(intersection).toBeFalsy();
  });

});
