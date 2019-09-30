import {TestBed} from '@angular/core/testing';

import {GameLogicService} from './game-logic.service';
import {Battleship} from "../game-objects/Battleship";
import {Bullet} from "../game-objects/Bullet";
import {Enemy} from "../game-objects/Enemy";
import {Direction} from "../game-objects/GameObject";

describe('GameLogicService', () => {
  let service: GameLogicService;
  let ctx: CanvasRenderingContext2D;
  let canvas: HTMLCanvasElement;
  let playerImage: HTMLImageElement;
  let bulletImage: HTMLImageElement;
  let enemyImage: HTMLImageElement;
  let explosionImage: HTMLImageElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameLogicService]
    });
    service = TestBed.get(GameLogicService);
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 800;
    playerImage = new Image();
    playerImage.src = '/assets/gameObjects/RedFighter.png';
    bulletImage = new Image();
    bulletImage.src = '/assets/gameObjects/Bullet.png';
    enemyImage = new Image();
    enemyImage.src = '/assets/gameObjects/AndroidAlien.png';
    explosionImage = new Image();
    explosionImage.src = '/assets/gameObjects/Explosion.png';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should spawn two players', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    service.spawnPlayer("playerTwo", playerImage, ctx, 100, 100);
    let players: Map<string, Battleship> = service.players;
    expect(players.size).toBe(2);
  });

  it('should spawn a row of enemies', () => {
    let enemiesPerRow = (ctx.canvas.width - 2 * enemyImage.width) / (enemyImage.width + 10);
    service.spawnEnemyRow(enemyImage, ctx, 20);
    let enemies: Enemy[] = service.enemies;
    expect(enemies.length).toBe(enemiesPerRow);
  });

  it('should spawn four enemy rows initially', () => {
    service.spawnEnemies([
      {image: enemyImage, hitScore: 10, frames: 2, ticksPerFrame: 30}
    ], ctx);
    let totalEnemies: number = service.enemies.length;
    let enemiesPerRow: number = service.enemies.length / 4;
    let rows: number = totalEnemies / enemiesPerRow;
    expect(rows).toBe(4);
  });

  it('should fire four player bullets', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    let playerBullets: Bullet[];
    for (let i = 0; i < 4; ++i) {
      service.fireBullet("playerOne", bulletImage, ctx);
    }
    playerBullets = service.playerBullets.get("playerOne");
    expect(playerBullets.length).toBe(4);
  });

  it('should fire an enemy bullet', () => {
    service.spawnEnemies([
      {image: enemyImage, hitScore: 10, frames: 2, ticksPerFrame: 30}
    ], ctx);
    let ticks: number = 90;
    for (let i = 0; i < ticks; ++i) {
      service.fireEnemyBullet(bulletImage, ctx);
    }
    expect(service.enemyBullets.length).toBe(1);
  });

  it('should move the player to the left', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    service.movePlayerLeft("playerOne");
    let player: Battleship = service.getPlayer("playerOne");
    let x: number = player.x;
    let y: number = player.y;
    let movementSpeed: number = player.movementSpeed;
    expect(x).toBe(50 - movementSpeed);
    expect(y).toBe(50);
  });

  it('should move the player to the right', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    service.movePlayerRight("playerOne");
    let player: Battleship = service.getPlayer("playerOne");
    let x: number = player.x;
    let y: number = player.y;
    let movementSpeed: number = player.movementSpeed;
    expect(x).toBe(50 + movementSpeed);
    expect(y).toBe(50);
  });

  it('should move all enemies in the set direction', () => {
    let ticks: number = 20;
    service.enemies.push(
      new Enemy(enemyImage, ctx, 100, 100, 50, Direction.RIGHT),
      new Enemy(enemyImage, ctx, 130, 100, 50, Direction.LEFT)
    );
    let movementSpeed: number = service.enemies[0].movementSpeed;
    let initXPositions: number[] = [];
    let initYPositions: number [] = [];
    for(let enemy of service.enemies) {
      initXPositions.push(enemy.x);
      initYPositions.push(enemy.y);
    }
    for (let i = 0; i < ticks; ++i) {
      service.moveEnemies();
    }
    for(let i = 0; i < service.enemies.length; ++i) {
      if (service.enemies[i].movementDirection === Direction.RIGHT) {
        expect(service.enemies[i].x).toBe(initXPositions[i] + movementSpeed);
        expect(service.enemies[i].y).toBe(initYPositions[i]);
      } else if (service.enemies[i].movementDirection === Direction.LEFT) {
        expect(service.enemies[i].x).toBe(initXPositions[i] - movementSpeed);
        expect(service.enemies[i].y).toBe(initYPositions[i]);
      }
    }
  });

  it('should move all enemies down if one is at a border of the game', () => {
    let initY: number = 100;
    let ticks: number = 20;
    service.enemies.push(new Enemy(enemyImage, ctx, ctx.canvas.width - enemyImage.width, initY, 40, Direction.RIGHT));
    service.enemies.push(new Enemy(enemyImage, ctx, 100, initY, 40, Direction.RIGHT));
    let speed: number = service.enemies[0].verticalMovementSpeed;
    for (let i = 0; i < ticks; ++i) {
      service.moveEnemies();
    }
    for(let enemy of service.enemies) {
      expect(enemy.y).toBe(initY + speed);
    }
  });

  it('should move all player bullets up', () => {
    let playerBullets: Map<string, Bullet[]>;
    let initialX: number = 20;
    let initialY: number = 20;
    service.spawnPlayer("testPlayer", playerImage, ctx, initialX, initialY);
    service.playerBullets.get("testPlayer").push(new Bullet(bulletImage, ctx, initialX, initialY));
    service.movePlayerBullets();
    playerBullets = service.playerBullets;
    for(let bullet of playerBullets.get("testPlayer")) {
      let x: number = bullet.x;
      let y: number = bullet.y;
      let speed: number = bullet.movementSpeed;
      expect(x).toBe(initialX);
      expect(y).toBe(initialY - speed);
    }
  });

  it('should move all enemy bullets down', () => {
    service.enemyBullets.push(new Bullet(bulletImage, ctx, 100, 100));
    service.enemyBullets.push(new Bullet(bulletImage, ctx, 120, 100));
    let initXPositions: number[] = [];
    let initYPositions: number[] = [];
    let speed: number = service.enemyBullets[0].movementSpeed;
    for (let bullet of service.enemyBullets) {
      initXPositions.push(bullet.x);
      initYPositions.push(bullet.y);
    }
    service.moveEnemyBullets();
    for (let i = 0; i < service.enemyBullets.length; ++i) {
      expect(service.enemyBullets[i].x).toBe(initXPositions[i]);
      expect(service.enemyBullets[i].y).toBe(initYPositions[i] + speed);
    }
  });

  it('should detect player bullet intersections', () => {
    let enemyX: number = 100;
    let enemyY: number = 100;
    let bulletY: number = 130;
    service.enemies.push(new Enemy(enemyImage, ctx, enemyX, enemyY, 40));
    service.spawnPlayer("testPlayer", playerImage, ctx);
    service.playerBullets.get("testPlayer").push(new Bullet(bulletImage, ctx, enemyX, bulletY));
    let bulletSpeed: number = service.playerBullets.get("testPlayer")[0].movementSpeed;
    for (let i = bulletY; i > enemyY + enemyImage.height; i -= bulletSpeed) {
      service.movePlayerBullets();
      service.checkForPlayerBulletIntersections(explosionImage, ctx, 32, 1);
    }
    expect(service.playerBullets.get("testPlayer").length).toBe(0);
    expect(service.enemies.length).toBe(0);
  });

  it('should detect enemy bullet intersections', () => {
    let playerX: number = 100;
    let playerY: number = 130;
    let bulletY: number = 100;
    service.enemyBullets.push(new Bullet(bulletImage, ctx, playerX, bulletY));
    service.spawnPlayer("testPlayer", playerImage, ctx, playerX, playerY);
    let bulletSpeed: number = service.enemyBullets[0].movementSpeed;

    let initPlayerLives: number = service.players.get("testPlayer").lives;
    for (let i = bulletY; i <= playerY; i += bulletSpeed) {
      service.moveEnemyBullets();
      service.checkForEnemyBulletIntersections(explosionImage, ctx, 32, 1);
    }
    expect(service.enemyBullets.length).toBe(0);
    expect(service.players.get("testPlayer").lives).toBe(initPlayerLives - 1);
  });

  it('should increase the level', () => {
    let initLevel: number = service.level;
    service.increaseLevel();
    expect(service.level).toBe(initLevel + 1);
  });


  it('should return the total score', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    service.spawnPlayer("playerTwo", playerImage, ctx, 100, 100);
    let score: number = 40;
    for(let player of service.players.values()) {
      player.addToScore(score);
    }
    expect(service.getTotalScore()).toBe(service.players.size * score);
  });

  it('should return the remaining player lives', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    let lives: number = service.players.get("playerOne").lives;
    expect(service.getPlayerLives("playerOne")).toBe(lives);
  });

});
