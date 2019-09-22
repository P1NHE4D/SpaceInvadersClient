import {Injectable} from '@angular/core';
import {Direction} from "../game-objects/GameObject";
import {Battleship} from "../game-objects/Battleship";
import {Bullet} from "../game-objects/Bullet";
import {Enemy} from "../game-objects/Enemy";
import {Explosion} from "../game-objects/Explosion";

@Injectable()
export class GameLogicService {
  private players: Map<string, Battleship> = new Map<string, Battleship>();
  private playerBullets: Map<string, Bullet[]> = new Map<string, Bullet[]>();
  private enemies: Enemy[] = [];
  private enemyBullets: Bullet[] = [];
  private explosions: Explosion[] = [];
  private gameOver: boolean = false;

  constructor(
  ) {}

  /**
   * Spawns a battleship instance
   * @param playerName name of player
   * @param img image that depicts the player
   * @param ctx canvas rendering context
   * @param x initial x-position of the battleship
   * @param y initial y-position of the battleship
   * @param frames frames of image used to depict player
   * @param ticksPerFrame ticks between two frames
   */
  spawnPlayer(
    playerName: string,
    img: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    x: number = ctx.canvas.width / 2,
    y:number = ctx.canvas.height - img.height,
    frames?: number,
    ticksPerFrame?: number
  ): void {
    let player = new Battleship(img, ctx, x, y, frames, ticksPerFrame);
    this.players.set(playerName, player);
    this.playerBullets.set(playerName, []);
  }

  /**
   * Moves the player to the left
   * @param playerName of player
   */
  movePlayerLeft(playerName: string): void {
    let player = this.players.get(playerName);
    if (player) {
      player.move(Direction.LEFT);
    }
  }

  /**
   * Moves the player to the right
   * @param playerName of player
   */
  movePlayerRight(playerName: string): void {
    let player = this.players.get(playerName);
    if (player) {
      player.move(Direction.RIGHT);
    }
  }

  /**
   * Fires a bullet from a player object
   * @param playerName name of the player object
   * @param img image used to depict the bullet
   * @param ctx canvas rendering context
   */
  fireBullet(playerName: string, img: HTMLImageElement, ctx: CanvasRenderingContext2D): void {
    let player = this.players.get(playerName);
    if (player) {
      let bullet = new Bullet(img, ctx, player.getX() + player.getWidth() / 2, player.getY());
      this.playerBullets.get(playerName).push(bullet);
    }
  }

  /**
   * Fires an enemy bullet
   * @param image image used to depict the bullet
   * @param ctx canvas rendering context
   */
  fireEnemyBullet(image: HTMLImageElement, ctx: CanvasRenderingContext2D): void {
    let randomIndex = Math.floor(Math.random() * this.enemies.length);
    let randomEnemy = this.enemies[randomIndex];
    let bullet = new Bullet(image, ctx, randomEnemy.getX() + randomEnemy.getWidth() / 2, randomEnemy.getY());
    this.enemyBullets.push(bullet);
  }

  /**
   * Spawns a single row of enemies filling the entire screen
   * @param img image used to depict the enemy
   * @param ctx canvas rendering context
   * @param hitScore rewarded score for hitting the enemy
   * @param frames number of image frames
   * @param ticksPerFrame ticks in between two frames
   *
   */
  spawnEnemyRow(img: HTMLImageElement, ctx: CanvasRenderingContext2D, hitScore: number, frames?: number, ticksPerFrame?: number): void {
    let enemiesPerRow = (ctx.canvas.width - 2 * img.width) / (img.width + 10);
    let yPos =img.height;
    if (this.enemies.length > 0) {
      yPos = this.enemies[this.enemies.length - 1].getY() + img.height + 10;
    }
    for (let i = 0; i < enemiesPerRow; ++i) {
      let xPos: number = (i * (img.width + 10));
      let enemy: Enemy = new Enemy(img, ctx, xPos, yPos, hitScore, Direction.RIGHT, frames, ticksPerFrame);
      this.enemies.push(enemy);
    }
  }

  /**
   * Moves each player bullet up
   */
  movePlayerBullets(): void {
    for (let bullets of this.playerBullets.values()) {
      for (let bullet of bullets) {
        bullet.move(Direction.UP, () => {
          let index = bullets.indexOf(bullet);
          bullets.splice(index, 1);
        });
      }
    }
  }

  /**
   * Moves each bullet of the enemy
   */
  moveEnemyBullets(): void {
    for (let bullet of this.enemyBullets) {
      bullet.move(Direction.DOWN, () => {
        let index = this.enemyBullets.indexOf(bullet);
        this.enemyBullets.splice(index, 1);
      });
    }
  }

  /**
   * Checks if a player bullet intersects with an enemy
   * @param image image used for explosion if bullet hit enemy
   * @param ctx canvas rendering context
   * @param frames frames of the image
   * @param ticksPerFrame ticks between two frames of the image
   */
  checkForPlayerBulletIntersections(image: HTMLImageElement, ctx: CanvasRenderingContext2D, frames: number, ticksPerFrame: number) {
    for (let enemy of this.enemies) {
      for (let playerName of this.playerBullets.keys()) {
        let bullets: Bullet[] = this.playerBullets.get(playerName);
        let playerObject: Battleship = this.players.get(playerName);
        for (let bullet of bullets) {
          if (bullet.intersectsWithObject(enemy.getX(), enemy.getWidth(), enemy.getY(), enemy.getHeight())) {
            let index = bullets.indexOf(bullet);
            bullets.splice(index, 1);
            if ((playerObject.getScore() % 1000) + enemy.getHitScore() >= 1000) {
              playerObject.addLife();
            }
            playerObject.addToScore(enemy.getHitScore());
            index = this.enemies.indexOf(enemy);
            // TODO: Add explosion sound
            let explosion = new Explosion(image, enemy.getX(), enemy.getY(), ctx, frames, ticksPerFrame);
            this.explosions.push(explosion);
            this.enemies.splice(index, 1);
          }
        }
      }
    }
  }

  /**
   * Checks if an enemy bullet intersects with a player object
   * @param image image used for explosion if bullet hit player
   * @param ctx canvas rendering context
   * @param frames frames of the image
   * @param ticksPerFrame ticks between two frames of the image
   */
  checkForEnemyBulletIntersections(image: HTMLImageElement, ctx: CanvasRenderingContext2D, frames: number, ticksPerFrame: number) {
    for (let player of this.players.values()) {
      for (let bullet of this.enemyBullets) {
        if (bullet.intersectsWithObject(player.getX(), player.getWidth(), player.getY(), player.getHeight())) {
          let index = this.enemyBullets.indexOf(bullet);
          this.enemyBullets.splice(index, 1);
          let x = player.getX();
          let y = player.getY();
          if (x + (image.width / 32) > ctx.canvas.width) {
            x -= (x + (image.width / 32)) % ctx.canvas.width;
          }
          if (y + image.height > ctx.canvas.height) {
            y-= (y + image.height) % ctx.canvas.height;
          }
          let explosion = new Explosion(image, x, y, ctx, frames, ticksPerFrame);
          this.explosions.push(explosion);
          player.removeLife();
          if (player.getLives() === 0) {
            this.gameOver = true;
          }
          //TODO: Add explosion sound and animation
          //TODO: if player is hit, remove player from game for a period of time and respawn
        }
      }
    }

  }

  /**
   * Moves the enemies in the game world
   */
  moveEnemies(): void {
    //TODO: Game over if enemies reached the lower boundary of the game
    let movementDirection: Direction;
    let boundaryReached: boolean = false;
    for (let enemy of this.enemies) {
      if (enemy.boundaryReached()) {
        boundaryReached = true;
      }
    }

    for (let enemy of this.enemies) {
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

  /**
   * Renders all game objects
   */
  renderGameObjects(): void {
    for (let player of this.players.values()) {
      player.render();
      player.update();
    }
    for (let enemy of this.enemies) {
      enemy.render();
      enemy.update();
    }
    for (let bullets of this.playerBullets.values()) {
      for (let bullet of bullets) {
        bullet.render();
        bullet.update();
      }
    }
    for (let bullet of this.enemyBullets) {
      bullet.render();
      bullet.update();
    }
    for (let explosion of this.explosions) {
      explosion.render();
      explosion.update(() => {
        let index = this.explosions.indexOf(explosion);
        this.explosions.splice(index, 1);
      });
    }
  }

  /**
   * @return game over
   */
  gameIsOver(): boolean {
    return this.gameOver;
  }

  /**
   * @return number of enemies remaining
   */
  enemiesRemaining(): number {
    return this.enemies.length;
  }

  /**
   * @param playerName name of the player
   * @return Returns the score of the player
   */
  getPlayerScore(playerName: string): number {
    return this.players.get(playerName).getScore();
  }

  /**
   * @param playerName name of the player
   * @return returns lives of the player
   */
  getPlayerLives(playerName: string): number {
    return this.players.get(playerName).getLives();
  }

  getPlayer(playerName: string): Battleship {
    return this.players.get(playerName);
  }

}
