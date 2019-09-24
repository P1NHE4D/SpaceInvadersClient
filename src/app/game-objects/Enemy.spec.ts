import {Enemy} from "./Enemy";
import {Direction} from "./GameObject";

describe('Enemy', () => {
  let enemy: Enemy;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;
  let initialX: number;
  let initialY: number;
  let movementDistance: number;
  let movementDistanceDown: number;
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
    movementDistance = 6;
    movementDistanceDown = 10;
    hitScore = 40;
    enemy = new Enemy(image, ctx, initialX, initialY, hitScore);
  });

  it('should change the movement direction', () => {
    enemy.setMovementDirection(Direction.RIGHT);
    let direction: Direction = enemy.getMovementDirection();
    expect(direction).toBe(Direction.RIGHT);
    enemy.setMovementDirection(Direction.LEFT);
    direction = enemy.getMovementDirection();
    expect(direction).toBe(Direction.LEFT);
    enemy.setMovementDirection(Direction.DOWN);
    direction = enemy.getMovementDirection();
    expect(direction).toBe(Direction.DOWN);
  });

  it('should move the enemy to the right', () => {
    enemy.setMovementDirection(Direction.RIGHT);
    enemy.move();
    let x: number = enemy.getX();
    let y: number = enemy.getY();
    expect(x).toBe(initialX + movementDistance);
    expect(y).toBe(initialY);
  });

  it('should not move the enemy beyond the right canvas border', () => {
    enemy.setMovementDirection(Direction.RIGHT);
    for (let i = initialX; i < ctx.canvas.width; i += movementDistance) {
      enemy.move();
    }
    let x: number = enemy.getX();
    let y: number = enemy.getY();
    let boundaryReached: boolean = enemy.boundaryReached();
    expect(x).toBeLessThan(ctx.canvas.width);
    expect(y).toBe(initialY);
    expect(boundaryReached).toBeTruthy();
  });

  it('should move the enemy to the left', () => {
    enemy.setMovementDirection(Direction.LEFT);
    enemy.move();
    let x: number = enemy.getX();
    let y: number = enemy.getY();
    expect(x).toBe(initialX - movementDistance);
    expect(y).toBe(initialY);
  });

  it('should not move the enemy beyond the left canvas border', () => {
    enemy.setMovementDirection(Direction.LEFT);
    for (let i = initialX; i > 0; i -= movementDistance) {
      enemy.move();
    }
    let x: number = enemy.getX();
    let y: number = enemy.getY();
    let boundaryReached: boolean = enemy.boundaryReached();
    expect(x).toBeGreaterThan(0);
    expect(y).toBe(initialY);
    expect(boundaryReached).toBeTruthy();
  });

  it('should move the enemy down', () => {
    enemy.setMovementDirection(Direction.DOWN);
    enemy.move();
    let x: number = enemy.getX();
    let y: number = enemy.getY();
    expect(x).toBe(initialX);
    expect(y).toBe(initialY + movementDistanceDown);
  });

  it('should not move the enemy beyond the lower canvas border', () => {
    enemy.setMovementDirection(Direction.DOWN);
    for (let i = initialY; i < ctx.canvas.height; i += movementDistanceDown) {
      enemy.move();
    }
    let x: number = enemy.getX();
    let y: number = enemy.getY();
    let boundaryReached: boolean = enemy.boundaryReached();
    expect(x).toBe(initialX);
    expect(y).toBeLessThan(ctx.canvas.height);
    expect(boundaryReached).toBeTruthy();
  });

  it('should return the hit score', () => {
    let score: number = enemy.getHitScore();
    expect(score).toBe(hitScore);
  });

});
