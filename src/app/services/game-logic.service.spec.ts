import { TestBed } from '@angular/core/testing';

import { GameLogicService } from './game-logic.service';
import {Battleship} from "../game-objects/Battleship";
import {Bullet} from "../game-objects/Bullet";
import {Enemy} from "../game-objects/Enemy";

// TODO: Unit test for bullet intersection method

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

  it('should fire four player bullets', () => {
    service.spawnPlayer("playerOne", playerImage, ctx, 50, 50);
    let playerBullets: Bullet[];
    for (let i = 0; i < 4; ++i) {
      service.fireBullet("playerOne", bulletImage, ctx);
    }
    playerBullets = service.playerBullets.get("playerOne");
    expect(playerBullets.length).toBe(4);
  });

  it('should spawn a row of enemies', () => {
    let enemiesPerRow = (ctx.canvas.width - 2 * enemyImage.width) / (enemyImage.width + 10);
    service.spawnEnemyRow(enemyImage, ctx, 20);
    let enemies: Enemy[] = service.enemies;
    expect(enemies.length).toBe(enemiesPerRow);
  });

  it('should fire four enemy bullets', () => {
    let bullets: Bullet[];
    service.spawnEnemyRow(enemyImage, ctx, 20);
    for (let i = 0; i < 4; ++i) {
      service.fireEnemyBullet(bulletImage, ctx);
    }
    bullets = service.enemyBullets;
    expect(bullets.length).toBe(4);
  });

  it('should move all player bullets up', () => {
    let playerBullets: Map<string, Bullet[]>;
    let initialX: number = 20;
    let initialY: number = 20;
    service.spawnPlayer("testPlayer", playerImage, ctx, initialX, initialY);
    for (let i = 0; i < 4; ++i) {
      service.fireBullet("testPlayer", bulletImage, ctx);
    }
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

  it('should move enemy bullet down', () => {
    let initialX: number;
    let initialY: number;
    let speed: number;
    service.spawnEnemyRow(enemyImage, ctx, 20);
    service.fireEnemyBullet(bulletImage, ctx);
    initialX = service.enemyBullets[0].x;
    initialY = service.enemyBullets[0].y;
    speed = service.enemyBullets[0].movementSpeed;
    service.moveEnemyBullets();
    let newX: number;
    let newY: number;
    newX = service.enemyBullets[0].x;
    newY = service.enemyBullets[0].y;
    expect(newX).toBe(initialX);
    expect(newY).toBe(initialY + speed);
  });

});
