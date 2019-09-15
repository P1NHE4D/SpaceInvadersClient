import {Bullet} from "../../game-objects/Bullet";
import {Enemy} from "../../game-objects/Enemy";
import {Battleship} from "../../game-objects/Battleship";
import {Direction, GameBoundaries} from "../../game-objects/GameObject";

export class GameLogic {
  private gameIsOver: boolean = false;
  private bullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private playerOne: Battleship;
  private boundaries: GameBoundaries;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.boundaries = {
      leftBoundary: 0,
      rightBoundary: this.ctx.canvas.width,
      lowerBoundary: this.ctx.canvas.height,
      upperBoundary: 0
    };
  }

  /**
   * Spawns a single player in the middle of the game board
   * @param img image that depicts the player
   */
  spawnSinglePlayer(img: HTMLImageElement): void {
    this.playerOne = new Battleship(
      img,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height,
      this.boundaries
    );
  }

  // TODO: Implement
  spawnMultiPlayer(): void {

  }

  spawnEnemyRow(img: HTMLImageElement): void {
    let y: number = 10;
    if (this.enemies.length > 0) {
      y += this.enemies[length - 1].getY() + 10;
    }
    //calc enemies per row
    let enemiesPerRow = (this.ctx.canvas.width - 2 * img.width) / (img.width + 10);
    for (let i = 0; i < enemiesPerRow; ++i) {
      let enemy: Enemy = new Enemy(img, i * img.width + 10, y, this.boundaries, Direction.RIGHT);
      enemy.draw(this.ctx);
      this.enemies.push(enemy);
    }
  }

  movePlayer(): void {

  }

  moveBullets(): void {
    for(let bullet of this.bullets) {
      for (let enemy of this.enemies) {
        if(bullet.intersectsWithObject(enemy.getX(), enemy.getWidth(), enemy.getY(), enemy.getHeight())) {
          let index = this.enemies.indexOf(enemy);
          this.enemies.splice(index, 1);
          index = this.bullets.indexOf(bullet);
          this.bullets.splice(index, 1);
        } else {
          bullet.move(Direction.UP, () => {
            let index = this.bullets.indexOf(bullet);
            this.bullets.splice(index, 1);
          });
          bullet.draw(this.ctx);
        }
      }
    }
    for(let bullet of this.enemyBullets) {
      if(bullet.intersectsWithObject(this.playerOne.getX(), this.playerOne.getWidth(), this.playerOne.getY(), this.playerOne.getHeight())) {
        this.gameIsOver = true;
      } else {
        bullet.move(Direction.DOWN, () => {
          let index = this.enemyBullets.indexOf(bullet);
          this.enemyBullets.splice(index, 1);
        });
      }
    }
  }

  initiateEnemyFire(img: HTMLImageElement): void {
    let randomIndex = Math.floor(Math.random() * this.enemies.length);
    let randomEnemy = this.enemies[randomIndex];
    let bullet = new Bullet(
      img,
      randomEnemy.getX() + (randomEnemy.getWidth() / 2),
      randomEnemy.getY(),
      this.boundaries
    );
    this.enemyBullets.push(bullet);
  }

  // TODO: Improve
  moveEnemies(): void {
    let boundaryReached: boolean = false;
    for (let enemy of this.enemies) {
      if (enemy.boundaryReached()) {
        boundaryReached = true;
      }
    }
    if (boundaryReached) {
      for(let enemy of this.enemies) {
        let movementDirection: Direction = enemy.getMovementDirection();
        enemy.setMovementDirection(Direction.DOWN);
        enemy.move();
        enemy.draw(this.ctx);
        if (movementDirection === Direction.RIGHT) {
          enemy.setMovementDirection(Direction.LEFT);
        } else {
          enemy.setMovementDirection(Direction.RIGHT);
        }
      }
    } else {
      for (let enemy of this.enemies) {
        enemy.move();
        enemy.draw(this.ctx);
      }
    }
  }

  gameOver(): boolean {
    return this.gameIsOver;
  }

}
