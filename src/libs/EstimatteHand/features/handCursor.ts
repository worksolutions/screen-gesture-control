import { Position2D } from "../../types/math";

export class HandCursor {
  private readonly innerElement: HTMLSpanElement;
  private _position: Position2D;

  constructor() {
    this.innerElement = HandCursor.createHtmlCursor();
    document.body.appendChild(this.innerElement);
  }

  public move(pos: Position2D) {
    this.innerElement.style.left = pos.x + "px";
    this.innerElement.style.top = pos.y + "px";
    this._position = pos;
  }

  private static createHtmlCursor(): HTMLSpanElement {
    const cursor = document.createElement("span");
    cursor.style.position = "fixed";
    cursor.style.left = "0";
    cursor.style.top = "0";
    cursor.style.backgroundColor = "red";
    cursor.style.height = "25px";
    cursor.style.width = "25px";
    cursor.style.opacity = ".7";
    cursor.style.borderRadius = "50%";
    cursor.style.zIndex = "999";
    return cursor;
  }
}
