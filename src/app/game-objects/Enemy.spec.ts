import {Enemy} from "./Enemy";
import {Direction} from "./GameObject";

describe('Enemy', () => {
  let enemy: Enemy;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;
  let initialX: number;
  let initialY: number;
  let hitScore: number;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 150;
    ctx.canvas.height = 150;
    image = new Image();
    image.src = '/assets/gameObjects/AndroidAlien.png';
    initialX = 100;
    initialY = 100;
    hitScore = 40;
    enemy = new Enemy(image, ctx, initialX, initialY, hitScore);
  });

  it('should change the movement direction', () => {
    enemy.movementDirection = Direction.RIGHT;
    let direction: Direction = enemy.movementDirection;
    expect(direction).toBe(Direction.RIGHT);
    enemy.movementDirection = Direction.LEFT;
    direction = enemy.movementDirection;
    expect(direction).toBe(Direction.LEFT);
    enemy.movementDirection = Direction.DOWN;
    direction = enemy.movementDirection
    expect(direction).toBe(Direction.DOWN);
  });

  it('should move the enemy to the right', () => {
    enemy.movementDirection = Direction.RIGHT;
    enemy.move();
    let x: number = enemy.x;
    let y: number = enemy.y;
    expect(x).toBe(initialX + enemy.movementSpeed);
    expect(y).toBe(initialY);
  });

  it('should not move the enemy beyond the right canvas border', () => {
    enemy.movementDirection = Direction.RIGHT;
    for (let i = initialX; i < ctx.canvas.width; i += enemy.movementSpeed) {
      enemy.move();
    }
    let x: number = enemy.x;
    let y: number = enemy.y;
    let boundaryReached: boolean = enemy.boundaryReached();
    expect(x).toBeLessThan(ctx.canvas.width);
    expect(y).toBe(initialY);
    expect(boundaryReached).toBeTruthy();
  });

  it('should move the enemy to the left', () => {
    enemy.movementDirection = Direction.LEFT;
    enemy.move();
    let x: number = enemy.x;
    let y: number = enemy.y;
    expect(x).toBe(initialX - enemy.movementSpeed);
    expect(y).toBe(initialY);
  });

  it('should not move the enemy beyond the left canvas border', () => {
    enemy.movementDirection = Direction.LEFT;
    for (let i = initialX; i > 0; i -= enemy.movementSpeed) {
      enemy.move();
    }
    let x: number = enemy.x;
    let y: number = enemy.y;
    let boundaryReached: boolean = enemy.boundaryReached();
    expect(x).toBeGreaterThan(0);
    expect(y).toBe(initialY);
    expect(boundaryReached).toBeTruthy();
  });

  it('should move the enemy down', () => {
    enemy.movementDirection = Direction.DOWN;
    enemy.move();
    let x: number = enemy.x;
    let y: number = enemy.y;
    expect(x).toBe(initialX);
    expect(y).toBe(initialY + enemy.verticalMovementSpeed);
  });

  it('should not move the enemy beyond the lower canvas border', () => {
    enemy.movementDirection = Direction.DOWN;
    for (let i = initialY; i < ctx.canvas.height; i += enemy.verticalMovementSpeed) {
      enemy.move();
    }
    let x: number = enemy.x;
    let y: number = enemy.y;
    let boundaryReached: boolean = enemy.boundaryReached();
    expect(x).toBe(initialX);
    expect(y).toBeLessThan(ctx.canvas.height);
    expect(boundaryReached).toBeTruthy();
  });

  it('should return the hit score', () => {
    let score: number = enemy.hitScore;
    expect(score).toBe(hitScore);
  });

  it('should set the movement direction', () => {
    enemy.movementDirection = Direction.LEFT;
    expect(enemy.movementDirection).toBe(Direction.LEFT);
    enemy.movementDirection = Direction.RIGHT;
    expect(enemy.movementDirection).toBe(Direction.RIGHT);
  })

});
