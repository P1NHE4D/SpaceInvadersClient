import {Injectable} from '@angular/core';
import {Direction} from "../game-objects/GameObject";
import {Battleship} from "../game-objects/Battleship";
import {Bullet} from "../game-objects/Bullet";
import {Enemy} from "../game-objects/Enemy";
import {Explosion} from "../game-objects/Explosion";
import {Howl} from "howler";

@Injectable()
export class GameLogicService {
  private _players: Map<string, Battleship> = new Map<string, Battleship>();
  private _playerBullets: Map<string, Bullet[]> = new Map<string, Bullet[]>();
  private _enemies: Enemy[] = [];
  private _enemyBullets: Bullet[] = [];
  private _explosions: Explosion[] = [];
  private _gameOver: boolean = false;
  private _enemyRowCount: number = 4;
  private _ticksBetweenMoves: number = 20;
  private _movementTicksCount: number = 0;
  private _ticksBetweenShots: number = 90;
  private _shotTicksCount: number = 0;
  private _level: number = 1;
  private _soundMuted: boolean = false;

  constructor(
  ) {}

  /**
   * Spawns a battleship instance
   * @param playerName name of player
   * @param img image that depicts the player
   * @param ctx canvas rendering context
   * @param x initial x-position of the battleship
   * @param y initial y-position of the battleship
   * @param frames _frames of image used to depict player
   * @param ticksPerFrame ticks between two _frames
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
    this._players.set(playerName, player);
    this._playerBullets.set(playerName, []);
  }

  spawnEnemies(metaData: EnemyMetaData[], ctx: CanvasRenderingContext2D): void {
    let count: number = metaData.length;
    let image: HTMLImageElement;
    let hitScore: number;
    let frames: number;
    let ticksPerFrame: number;
    for(let i = 0; i < this._enemyRowCount; ++i) {
      image = metaData[i % count].image;
      hitScore = metaData[i % count].hitScore;
      frames = metaData[i % count].frames;
      ticksPerFrame = metaData[i % count].ticksPerFrame;
      this.spawnEnemyRow(image, ctx, hitScore, frames, ticksPerFrame);
    }
  }

  /**
   * Spawns a single row of enemies filling the entire screen
   * @param img image used to depict the enemy
   * @param ctx canvas rendering context
   * @param hitScore rewarded score for hitting the enemy
   * @param frames number of image _frames
   * @param ticksPerFrame ticks in between two _frames
   */
  spawnEnemyRow(img: HTMLImageElement, ctx: CanvasRenderingContext2D, hitScore: number, frames?: number, ticksPerFrame?: number): void {
    let enemiesPerRow = (ctx.canvas.width - 2 * img.width) / (img.width + 10);
    let yPos = img.height;
    if (this._enemies.length > 0) {
      yPos = this._enemies[this._enemies.length - 1].y + img.height + 10;
    }
    for (let i = 0; i < enemiesPerRow; ++i) {
      let xPos: number = (i * (img.width + 10));
      let enemy: Enemy = new Enemy(img, ctx, xPos, yPos, hitScore, Direction.RIGHT, frames, ticksPerFrame);
      this._enemies.push(enemy);
    }
  }

  /**
   * Moves the player to the left
   * @param playerName of player
   */
  movePlayerLeft(playerName: string): void {
    let player = this._players.get(playerName);
    if (player) {
      player.move(Direction.LEFT);
    }
  }

  /**
   * Moves the player to the right
   * @param playerName of player
   */
  movePlayerRight(playerName: string): void {
    let player = this._players.get(playerName);
    if (player) {
      player.move(Direction.RIGHT);
    }
  }

  /**
   * Moves the enemies in the game world
   */
  moveEnemies(): void {
    if (++this._movementTicksCount === this._ticksBetweenMoves) {
      this._movementTicksCount = 0;

      let movementDirection: Direction;
      let boundaryReached: boolean = false;
      for (let enemy of this._enemies) {
        if (enemy.boundaryReached()) {
          boundaryReached = true;
        }
      }

      for (let enemy of this._enemies) {
        movementDirection = enemy.movementDirection;
        if (boundaryReached) {
          enemy.movementDirection = Direction.DOWN;
          enemy.move();
          if (movementDirection === Direction.RIGHT) {
            enemy.movementDirection = Direction.LEFT;
          } else {
            enemy.movementDirection = Direction.RIGHT;
          }
          for (let player of this._players.values()) {
            if (enemy.y + enemy.height >= player.y) {
              this._gameOver = true;
            }
          }
        } else {
          enemy.move();
        }
      }
    }
  }

  /**
   * Moves each player bullet up
   */
  movePlayerBullets(): void {
    for (let bullets of this._playerBullets.values()) {
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
    for (let bullet of this._enemyBullets) {
      bullet.move(Direction.DOWN, () => {
        let index = this._enemyBullets.indexOf(bullet);
        this._enemyBullets.splice(index, 1);
      });
    }
  }

  /**
   * Fires a bullet from a player object
   * @param playerName name of the player object
   * @param img image used to depict the bullet
   * @param ctx canvas rendering context
   * @param audio optional audio that will be played when firing a bullet
   */
  fireBullet(playerName: string, img: HTMLImageElement, ctx: CanvasRenderingContext2D, audio?: Howl): void {
    let player = this._players.get(playerName);
    if (player) {
      let bullet = new Bullet(img, ctx, player.x + player.width / 2, player.y);
      this._playerBullets.get(playerName).push(bullet);
      if (audio && !this._soundMuted) {
        audio.play();
      }
    }
  }

  /**
   * Fires an enemy bullet
   * @param image image used to depict the bullet
   * @param ctx canvas rendering context
   */
  fireEnemyBullet(image: HTMLImageElement, ctx: CanvasRenderingContext2D): void {
    if (++this._shotTicksCount === this._ticksBetweenShots && this.enemies.length > 0) {
      this._shotTicksCount = 0;

      let randomIndex = Math.floor(Math.random() * this._enemies.length);
      let randomEnemy = this._enemies[randomIndex];
      let bullet = new Bullet(image, ctx, randomEnemy.x + randomEnemy.width / 2, randomEnemy.y);
      this._enemyBullets.push(bullet);
    }
  }

  /**
   * Checks if a player bullet intersects with an enemy
   * @param image image used for explosion if bullet hit enemy
   * @param ctx canvas rendering context
   * @param frames _frames of the image
   * @param ticksPerFrame ticks between two _frames of the image
   * @param audio optional audio that will be played on impact
   */
  checkForPlayerBulletIntersections(image: HTMLImageElement, ctx: CanvasRenderingContext2D, frames: number, ticksPerFrame: number, audio?: Howl) {
    for (let enemy of this._enemies) {
      for (let playerName of this._playerBullets.keys()) {
        let bullets: Bullet[] = this._playerBullets.get(playerName);
        let playerObject: Battleship = this._players.get(playerName);
        for (let bullet of bullets) {
          if (bullet.intersectsWithObject(enemy.x, enemy.width, enemy.y, enemy.height)) {
            let index = bullets.indexOf(bullet);
            bullets.splice(index, 1);
            if ((playerObject.score % 1000) + enemy.hitScore >= 1000) {
              playerObject.addLife();
            }
            playerObject.addToScore(enemy.hitScore);
            index = this._enemies.indexOf(enemy);
            if (audio && !this._soundMuted) {
              audio.play();
            }
            let explosion = new Explosion(image, ctx, enemy.x, enemy.y, frames, ticksPerFrame);
            this._explosions.push(explosion);
            this._enemies.splice(index, 1);
          }
        }
      }
    }
  }

  /**
   * Checks if an enemy bullet intersects with a player object
   * @param image image used for explosion if bullet hit player
   * @param ctx canvas rendering context
   * @param frames _frames of the image
   * @param ticksPerFrame ticks between two _frames of the image
   * @param audio optional audio that will be played on impact
   */
  checkForEnemyBulletIntersections(image: HTMLImageElement, ctx: CanvasRenderingContext2D, frames: number, ticksPerFrame: number, audio?: Howl) {
    for (let player of this._players.values()) {
      for (let bullet of this._enemyBullets) {
        if (bullet.intersectsWithObject(player.x, player.width, player.y, player.height)) {
          let index = this._enemyBullets.indexOf(bullet);
          this._enemyBullets.splice(index, 1);
          let x = player.x;
          let y = player.y;
          if (x + (image.width / 32) > ctx.canvas.width) {
            x -= (x + (image.width / 32)) % ctx.canvas.width;
          }
          if (y + image.height > ctx.canvas.height) {
            y-= (y + image.height) % ctx.canvas.height;
          }
          let explosion = new Explosion(image, ctx, x, y, frames, ticksPerFrame);
          this._explosions.push(explosion);
          if (audio && !this._soundMuted) {
            audio.play();
          }
          player.removeLife();
          if (player.lives === 0) {
            this._gameOver = true;
          }
        }
      }
    }

  }

  /**
   * Renders all game objects
   */
  renderGameObjects(): void {
    for (let player of this._players.values()) {
      player.render();
      player.update();
    }
    for (let enemy of this._enemies) {
      enemy.render();
      enemy.update();
    }
    for (let bullets of this._playerBullets.values()) {
      for (let bullet of bullets) {
        bullet.render();
        bullet.update();
      }
    }
    for (let bullet of this._enemyBullets) {
      bullet.render();
      bullet.update();
    }
    for (let explosion of this._explosions) {
      explosion.render();
      explosion.update(() => {
        let index = this._explosions.indexOf(explosion);
        this._explosions.splice(index, 1);
      });
    }
  }

  /**
   * Increases the level of the game by 1 and deletes all bullets currently in game
   */
  increaseLevel(): void {
    ++this._level;
    for (let key of this._playerBullets.keys()) {
      this._playerBullets.set(key, []);
    }
    this._enemyBullets = [];
  }

  /**
   * Increases the difficulty of the game
   */
  increaseDifficulty(): void {
    if (this._enemyRowCount <= 7 && this._level % 2 === 0) {
      ++this._enemyRowCount;
    }
    if (this._ticksBetweenShots >= 60 && this._level % 3 === 0) {
      this._ticksBetweenShots -= 10;
      this._shotTicksCount = 0;
    }
    if (this._ticksBetweenMoves >= 10 && this._level % 5 === 0) {
      this._ticksBetweenMoves -= 5;
      this._movementTicksCount = 0;
    }
  }

  /**
   * Enables / Disables in-game sounds
   */
  switchSoundMuted(): void {
    this._soundMuted = !this._soundMuted;
  }

  /**
   * @return game over
   */
  get gameOver(): boolean {
    return this._gameOver;
  }

  /**
   * @param playerName name of the player
   * @return Returns the score of the player
   */
  getPlayerScore(playerName: string): number {
    return this._players.get(playerName).score;
  }

  /**
   * @return returns total score
   */
  getTotalScore(): number {
    let score: number = 0;
    for (let player of this._players.values()) {
      score += player.score;
    }
    return score;
  }

  /**
   * @param playerName name of the player
   * @return returns lives of the player
   */
  getPlayerLives(playerName: string): number {
    return this._players.get(playerName).lives;
  }

  /**
   * Gets a player object by name
   * @param playerName name of the player
   * @return returns the game object of the player
   */
  getPlayer(playerName: string): Battleship {
    return this._players.get(playerName);
  }

  /**
   * @return returns a map containing the name and corresponding game object of the player
   */
  get players(): Map<string, Battleship> {
    return this._players;
  }

  /**
   * @return returns a map containing the name and the corresponding array of bullets of the player
   */
  get playerBullets(): Map<string, Bullet[]> {
    return this._playerBullets;
  }

  /**
   * @return returns all enemies currently in the game
   */
  get enemies(): Enemy[] {
    return this._enemies;
  }

  /**
   * @return returns all enemy bullets currently in game
   */
  get enemyBullets(): Bullet[] {
    return this._enemyBullets;
  }

  /**
   * @return returns all explosions currently in game
   */
  get explosions(): Explosion[] {
    return this._explosions;
  }

  /**
   * @return returns the current level of the game
   */
  get level(): number {
    return this._level;
  }

}

export interface EnemyMetaData {
  image: HTMLImageElement;
  hitScore: number;
  frames: number;
  ticksPerFrame: number;
}
