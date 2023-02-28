export default class SImage extends HTMLElement {
    constructor() {
      super();
      this.photoId = this.getAttribute("photoId") || "sid";
      this.class = this.getAttribute("class") || "big";
      this.previewSize = this.getAttribute("previewSize") || "n";
      this.indexImage = this.getAttribute("indexImage") || "1"
    }

    connectedCallback() {
      this.innerHTML = `<div class="${this.class}"><img id="myImg" src="${this.photoId}${this.previewSize}.jpg"               onclick="setImage('${this.indexImage}','${this.photoId}','c.jpg')" indexImage="${this.indexImage}"> </div>`;
    }
  }

  customElements.define("s-image", SImage);
