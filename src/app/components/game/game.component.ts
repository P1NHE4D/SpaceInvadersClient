import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {


  private canvas;
  private ctx: CanvasRenderingContext2D;
  private battleship: Battleship;
  private imagePath: string = "../../../assets/gameObjects/";
  private fighterImg: HTMLImageElement;

  constructor() {
  }

  ngOnInit() {
    this.fighterImg = new Image();
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.loadImages();
  }

  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.fighterImg, this.battleship.getX(), this.battleship.getY());
  };

  /**
   * Load game assets
   */
  loadImages(): void {
    this.fighterImg.src = "../../../assets/gameObjects/RedFighter.png";
    this.fighterImg.onload = () => this.setupGame();
  }

  setupGame() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText("NAs", 100, 100);
    this.battleship = new Battleship(this.fighterImg, this.ctx, this.ctx.canvas.width / 2);
    this.ctx.drawImage(this.fighterImg, this.battleship.getX(), this.battleship.getY());
    this.gameLoop();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    switch(event.key) {
      case("ArrowLeft"):
        this.battleship.moveLeft();
        break;
      case("ArrowRight"):
        this.battleship.moveRight();
        break;
    }
  }

}

export class Battleship {
  private xPos: number;
  private readonly yPos: number;
  private readonly leftBoundary: number;
  private readonly rightBoundary: number;
  private img: HTMLImageElement;

  constructor(img: HTMLImageElement, ctx: CanvasRenderingContext2D, startPos: number) {
    this.img = img;
    this.rightBoundary = ctx.canvas.width - this.img.width;
    this.leftBoundary = 0;
    this.xPos = startPos - (this.img.width / 2);
    this.yPos = ctx.canvas.height - this.img.height;
  }

  public moveLeft(): void {
    if (this.xPos - 2 > this.leftBoundary) {
      this.xPos -= 2;
    }
  }

  public moveRight(): void {
    if (this.xPos + 2 < this.rightBoundary) {
      this.xPos += 2;
    }
  }

  public fire(): void {

  }

  public getX(): number {
    return this.xPos;
  }

  public getY(): number {
    return this.yPos;
  }
}
