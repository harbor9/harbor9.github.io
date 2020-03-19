export default class SImage extends HTMLElement {
    constructor() {
      super();
      this.photoId = this.getAttribute("photoId") || "sid";
      this.class = this.getAttribute("class") || "big";
      this.previewSize = this.getAttribute("previewSize") || "w";
    }

    connectedCallback() {
      this.innerHTML = `<div class="${this.class}"><img id="myImg" src="${this.photoId}${this.previewSize}.jpg" onclick="setImage('${this.photoId}','c.jpg')"> </div>`;
    }
  }

  customElements.define("s-image", SImage);
