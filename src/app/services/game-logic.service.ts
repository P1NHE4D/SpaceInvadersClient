import {Injectable} from '@angular/core';
import {Direction, GameObject} from "../game-objects/GameObject";
import {Battleship} from "../game-objects/Battleship";
import {Bullet} from "../game-objects/Bullet";
import {Enemy} from "../game-objects/Enemy";

@Injectable()
export class GameLogicService {

  constructor() { }

  /**
   * Spawns a battleship instance
   * @param img image that depicts the battleship
   * @param x initial x-position of the battleship
   * @param y initial y-position of the battleship
   * @param ctx
   * @return returns a battleship instance
   */
  spawnPlayer(img: HTMLImageElement, ctx: CanvasRenderingContext2D, x: number, y:number, frames?: number, ticksPerFrame?: number): Battleship {
    return new Battleship(
      img,
      ctx,
      x,
      y,
      frames,
      ticksPerFrame
    );
  }

  /**
   * Moves the player to the left
   * @param battleship battleship object of the player
   */
  movePlayerLeft(battleship: Battleship): void {
    battleship.move(Direction.LEFT);
  }

  /**
   * Moves the player to the right
   * @param battleship battleship object of the player
   */
  movePlayerRight(battleship: Battleship): void {
    battleship.move(Direction.RIGHT);
  }

  /**
   * Fires a bullet from a game object
   * @param object game object that fires the bullet
   * @param img image used to depict the bullet
   * @param boundaries game world boundaries
   */
  fireBullet(object: GameObject, img: HTMLImageElement, ctx: CanvasRenderingContext2D): Bullet {
    return new Bullet(img, ctx, object.getX() + object.getWidth() / 2, object.getY());
  }

  /**
   * Spawns a single row of enemies filling the entire screen
   * @param img image used to depict the enemy
   * @param yPos initial y-position of the row
   * @param ctx canvas rendering context
   * @param hitScore rewarded score for hitting the enemy
   * @param frames number of image frames
   * @param ticksPerFrame ticks in between two frames
   *
   */
  spawnEnemyRow(img: HTMLImageElement, ctx: CanvasRenderingContext2D, yPos: number, hitScore: number, frames?: number, ticksPerFrame?: number): Enemy[] {
    let enemies: Enemy[] = [];
    let enemiesPerRow = (ctx.canvas.width - 2 * img.width) / (img.width + 10);
    for (let i = 0; i < enemiesPerRow; ++i) {
      let xPos: number = (i * (img.width + 10));
      let enemy: Enemy = new Enemy(img, ctx, xPos, yPos, hitScore, Direction.RIGHT, frames, ticksPerFrame);
      enemies.push(enemy);
    }
    return enemies;
  }

  /**
   * Moves each bullet of a bullet array up
   * @param bullets array of bullets
   * @param boundaryReached game world boundaries
   */
  moveBulletsUp(bullets: Bullet[], boundaryReached: (bullet: Bullet) => any): void {
    for(let bullet of bullets) {
      bullet.move(Direction.UP, () => {
        boundaryReached(bullet);
      });
    }
  }

  /**
   * moves each bullet of a bullet array down
   * @param bullets array of bullets
   * @param boundaryReached game world boundaries
   */
  moveBulletsDown(bullets: Bullet[], boundaryReached: (bullet: Bullet) => any): void {
    for(let bullet of bullets) {
      bullet.move(Direction.DOWN, () => {
        boundaryReached(bullet);
      });
    }
  }

  /**
   * Checks if a bullet intersects with one object
   * @param bullets array of bullets
   * @param object object to be checked
   * @param bulletIntersectsWithObject callback function that is called if a bullet intersects with the object
   */
  checkForBulletIntersection(bullets: Bullet[], object: GameObject, bulletIntersectsWithObject: (bullet: Bullet) => any) {
    for (let bullet of bullets) {
      if(bullet.intersectsWithObject(object.getX(), object.getWidth(), object.getY(), object.getHeight())) {
        bulletIntersectsWithObject(bullet);
      }
    }
  }

  /**
   * Checks if a bullet intersects with any object of the object array provided
   * @param bullets array of bullets
   * @param objects array of objects
   * @param bulletIntersectsWithObject callback function that is called if a bullet intersects with an object
   */
  checkForBulletIntersections(bullets: Bullet[], objects: GameObject[], bulletIntersectsWithObject: (object: GameObject, bullet: Bullet) => any) {
    for (let bullet of bullets) {
      for (let object of objects) {
        if(bullet.intersectsWithObject(object.getX(), object.getWidth(), object.getY(), object.getHeight())) {
          bulletIntersectsWithObject(object, bullet);
        }
      }
    }
  }

  /**
   * Moves the enemies in the game world
   * @param enemies array of enemies
   */
  moveEnemies(enemies: Enemy[]): void {
    let movementDirection: Direction;
    let boundaryReached: boolean = false;
    for (let enemy of enemies) {
      if (enemy.boundaryReached()) {
        boundaryReached = true;
      }
    }

    for (let enemy of enemies) {
      movementDirection = enemy.getMovementDirection();
      if (boundaryReached) {
        enemy.setMovementDirection(Direction.DOWN);
        enemy.move();
        if (movementDirection === Direction.RIGHT) {
          enemy.setMovementDirection(Direction.LEFT);
        } else {
          enemy.setMovementDirection(Direction.RIGHT);
        }
      } else {
        enemy.move();
      }
    }
  }

}
