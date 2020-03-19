export default class SImage extends HTMLElement {
    constructor() {
      super();
      this.photoId = this.getAttribute("photoId") || "sid";
      this.class = this.getAttribute("class") || "big";
    }

    connectedCallback() {
      this.innerHTML = `<div class="${this.class}"><img id="myImg" src="${this.photoId}w.jpg" onclick="setImage('${this.photoId}','c.jpg')"> </div>`;
    }
  }

  customElements.define("s-image", SImage);
