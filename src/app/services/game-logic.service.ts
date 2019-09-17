import {Injectable} from '@angular/core';
import {Direction, GameBoundaries, GameObject} from "../game-objects/GameObject";
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
   * @param boundaries
   * @return returns a battleship instance
   */
  spawnPlayer(img: HTMLImageElement, x: number, y:number, boundaries: GameBoundaries): Battleship {
    return new Battleship(
      img,
      x,
      y,
      boundaries
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
  fireBullet(object: GameObject, img: HTMLImageElement, boundaries: GameBoundaries): Bullet {
    return new Bullet(img, object.getX() + object.getWidth() / 2, object.getY(), boundaries);
  }

  /**
   * Spawns a single row of enemies filling the entire screen
   * @param img image used to depict the enemy
   * @param yPos initial y-position of the row
   * @param boundaries game world boundaries
   */
  spawnEnemyRow(img: HTMLImageElement, yPos: number, boundaries: GameBoundaries): Enemy[] {
    let enemies: Enemy[] = [];
    let enemiesPerRow = (boundaries.rightBoundary - 4 * img.width) / (img.width + 10);
    for (let i = 0; i < enemiesPerRow; ++i) {
      let xPos: number = (i * (img.width + 10));
      let enemy: Enemy = new Enemy(img, xPos, yPos, boundaries, Direction.RIGHT);
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
