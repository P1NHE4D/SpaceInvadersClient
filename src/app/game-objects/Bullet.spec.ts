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
    let initialY: number = bullet.y
    let initialX: number = bullet.x
    for (let x = 0; x < 4; ++x) {
      bullet.move(Direction.UP);
    }
    let newY: number = bullet.y;
    let newX: number = bullet.x;
    let speed: number = bullet.movementSpeed;
    expect(newY).toBe(initialY - 4 * speed);
    expect(newX).toBe(initialX);
  });

  it('should move down', () => {
    let initialY: number = bullet.y
    let initialX: number = bullet.x
    for (let x = 0; x < 4; ++x) {
      bullet.move(Direction.DOWN);
    }
    let newY: number = bullet.y;
    let newX: number = bullet.x;
    let speed: number = bullet.movementSpeed;
    expect(newY).toBe(initialY + 4 * speed);
    expect(newX).toBe(initialX);
  });

  it('should intersect with object', () => {
    let bsImage: HTMLImageElement = new Image();
    bsImage.src = '/assets/gameObjects/RedFighter.png';
    let battleship: Battleship = new Battleship(bsImage, ctx, 100, 600);
    let intersection: boolean = bullet.intersectsWithObject(battleship.x, battleship.width, battleship.y, battleship.height);
    expect(intersection).toBeTruthy();
  });

  it('should not intersect with object', () => {
    let intersection: boolean = bullet.intersectsWithObject(100, 40, 620, 19);
    expect(intersection).toBeFalsy();
  });

});
