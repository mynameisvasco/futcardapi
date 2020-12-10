import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas,
  loadImage,
  registerFont,
} from "canvas";
import {
  CARDS_STYLES,
  FACE_URL,
  CLUB_BADGE_URL,
  NATION_BADGE_URL,
  DYNAMIC_FACE_URL,
} from "./consts";
import path from "path";

export class Card {
  private _data: any;
  private _canvas: Canvas;
  private _context: CanvasRenderingContext2D;

  constructor(data: any) {
    this._data = data;
    this._canvas = createCanvas(644, 900);
    this._context = this._canvas.getContext("2d");
    registerFont(path.resolve("./fonts/RobotoCondensed-Bold.ttf"), {
      family: "Roboto Condensed",
      weight: "bold",
    });
    registerFont(path.resolve("./fonts/RobotoCondensed-Light.ttf"), {
      family: "Roboto Condensed",
      weight: "light",
    });
    registerFont(path.resolve("./fonts/RobotoCondensed-Regular.ttf"), {
      family: "Roboto Condensed",
      weight: "regular",
    });
  }

  private getQuality() {
    const { rating, rare_type } = this._data;
    if (rare_type !== 1 && rare_type !== 3 && rare_type !== 0) return 0;
    if (rating >= 75) return 3;
    else if (rating >= 65) return 2;
    return 1;
  }

  private async drawBackground() {
    const url = `${
      CARDS_STYLES[this._data.rare_type].background
    }/cards_bg_e_1_${this._data.rare_type}_${this.getQuality()}.png`;
    const bgImage = await loadImage(url);
    this._context.drawImage(bgImage, 0, 0);
  }

  private drawName() {
    const name = (this._data.common
      ? this._data.common
      : this._data.name
    ).toUpperCase();
    this._context.font = 'bold 48px "Roboto Condensed"';
    const textSize = this._context.measureText(name);
    const x = this._canvas.width / 2 - textSize.width / 2;
    this._context.fillText(name, x, 515);
  }

  private drawRating() {
    this._context.font = 'bold 84px "Roboto Condensed"';
    this._context.fillText(this._data.rating, 144, 200);
  }

  private drawPosition() {
    this._context.font = 'regular 42px "Roboto Condensed"';
    this._context.fillText(this._data.position, 160, 250);
  }

  private async drawDynamicFace() {
    const { resource } = this._data;
    let url = `${DYNAMIC_FACE_URL}/p${resource}.png`;
    const faceImage = await loadImage(url);
    this._context.drawImage(
      faceImage,
      this._canvas.width / 2 - faceImage.width / 2,
      110
    );
  }

  private async drawFace() {
    const { resource, baseid } = this._data;
    if (baseid !== resource && this._data.Special_Image === 1) {
      await this.drawDynamicFace();
      return;
    }
    let url = `${FACE_URL}/${baseid}.png`;
    const faceImage = await loadImage(url);
    this._context.drawImage(
      faceImage,
      245,
      145,
      faceImage.width * 2,
      faceImage.height * 2
    );
  }

  private async drawNation() {
    const url = `${NATION_BADGE_URL}/${this._data.nationid}.png`;
    const nationImage = await loadImage(url);
    this._context.drawImage(
      nationImage,
      148,
      285,
      nationImage.width * 0.75,
      nationImage.height * 0.75
    );
  }

  private async drawClub() {
    const url = `${CLUB_BADGE_URL}/${this._data.clubid}.png`;
    const clubImage = await loadImage(url);
    this._context.drawImage(
      clubImage,
      148,
      355,
      clubImage.width * 0.55,
      clubImage.height * 0.55
    );
  }

  private setTextColor() {
    this._context.fillStyle =
      CARDS_STYLES[this._data.rare_type].textColor[this.getQuality()];
  }

  async draw() {
    await this.drawBackground();
    await this.drawFace();
    await this.drawNation();
    await this.drawClub();
    this.setTextColor();
    this.drawName();
    this.drawPosition();
    this.drawRating();
    return this._canvas.createPNGStream().read();
  }
}
