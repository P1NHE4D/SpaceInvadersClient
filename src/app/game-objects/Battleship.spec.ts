import {Battleship} from "./Battleship";
import {Direction} from "./GameObject";

describe('Battleship', () => {
  let battleship: Battleship;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let image: HTMLImageElement;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 800;
    image = new Image();
    image.src = '/assets/gameObjects/RedFighter.png';
    battleship = new Battleship(image, ctx, 100, 100);
  });

  it('should adjust the x and y position according to the image dimensions', () => {
    let x = battleship.getX();
    let y = battleship.getY();
    expect(x).toBe(100 - (image.width / 2));
    expect(y).toBe(100 - image.height);
  });

  it('should move the battleship to the left', () => {
    battleship.move(Direction.LEFT);
    let x = battleship.getX();
    expect(x).toBe(100 - 10);
  });

  it('should move the battleship to the right', () => {
    battleship.move(Direction.RIGHT);
    let x = battleship.getX();
    expect(x).toBe(100 + 10);
  });

  it('should increase the score', () => {
    let initialScore = battleship.getScore();
    battleship.addToScore(40);
    let score = battleship.getScore();
    expect(score).toBe(initialScore + 40);
  });

  it('should decrease the score', () => {
    let initialScore = battleship.getScore();
    battleship.addToScore(40);
    battleship.subtractFromScore(20);
    let score = battleship.getScore();
    expect(score).toBe(initialScore + 20);
  });

  it('should not have a negative score', () => {
    let initialScore = battleship.getScore();
    battleship.subtractFromScore(initialScore + 20);
    let score = battleship.getScore();
    expect(score).toBe(0);
  });

  it('should add a life', () => {
    let initialNrOfLives = battleship.getLives();
    battleship.addLife();
    let noOfLives = battleship.getLives();
    expect(noOfLives).toBe(initialNrOfLives + 1);
  });

  it('should remove a life', () => {
    let initialNrOfLives = battleship.getLives();
    battleship.removeLife();
    let noOfLives = battleship.getLives();
    expect(noOfLives).toBe(initialNrOfLives - 1);
  });

  it('should not have negative lives', () => {
    let initialNrOfLives = battleship.getLives();
    for (let x = 0; x < initialNrOfLives; ++x) {
      battleship.removeLife();
    }
    battleship.removeLife();
    let noOfLives = battleship.getLives();
    expect(noOfLives).toBe(0);
  });

});
