export default class SImage extends HTMLElement {
    constructor() {
      super();
      this.photoId = this.getAttribute("photoId") || "sid";
    }

    connectedCallback() {
      this.innerHTML = `<img id="myImg" src="${this.photoId}w.jpg" onclick="setImage('${this.photoId}','c.jpg')">`;
    }
  }

  customElements.define("s-image", SImage);
