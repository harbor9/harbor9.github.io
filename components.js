// Native Web Components for the Harbor 9 page — no framework, just the
// Custom Elements + Shadow DOM platform APIs.
//
//   <harbor-gallery>     self-contained photo grid + lightbox
//   <harbor-lang-switch> EN / DE / PL language switcher
//
// Both keep their markup and styles encapsulated in a shadow root and react
// to the document-level "languagechange" event dispatched by i18n.js.

// Wrapped in an IIFE so these module-private helpers don't collide with the
// global `t` / `currentLang` that i18n.js declares in the shared script scope.
(() => {

// Translate helper — falls back to the raw key if i18n.js hasn't loaded.
const t = (key, vars) => (window.i18n ? window.i18n.t(key, vars) : key);
const currentLang = () => (window.i18n ? window.i18n.lang : "en");

/* ============================================================
   <harbor-gallery>
   Photos live on Flickr. Each base URL ends at the trailing "_";
   we append a size suffix + ".jpg":  "n" = 320px thumb, "c" = 800px large.
   `shape` controls how many grid cells a thumbnail spans.
   ============================================================ */
const PHOTOS = [
  { base: "https://live.staticflickr.com/1889/42676514890_a460f56471_", shape: "wide" },
  { base: "https://live.staticflickr.com/1878/30616610988_da21ba190c_", shape: "tall" },
  { base: "https://live.staticflickr.com/1894/42676517930_ca2a632e1a_", shape: "wide" },
  { base: "https://live.staticflickr.com/1894/43576608985_49f0bbb202_", shape: "wide" },
  { base: "https://live.staticflickr.com/1884/43767841034_bccb8b57a5_", shape: "tall" },
  { base: "https://live.staticflickr.com/1872/29548347767_27d80564ce_", shape: "wide" },
  { base: "https://live.staticflickr.com/1900/44485863931_17fbf65747_", shape: "wide" },
  { base: "https://live.staticflickr.com/1848/44485648931_9f18b00033_", shape: "wide" },
  { base: "https://live.staticflickr.com/1856/44436869102_4a2bef59a5_", shape: "wide" },
  { base: "https://live.staticflickr.com/1886/43767664394_b4816288c1_", shape: "tall" },
  { base: "https://live.staticflickr.com/1882/42676745410_9ae5e6a948_", shape: "tall" },
  { base: "https://live.staticflickr.com/1876/42676540860_4c7fe57d45_", shape: "tall" },
  { base: "https://live.staticflickr.com/1844/43767673154_f00304f2c4_", shape: "tall" },
  { base: "https://live.staticflickr.com/1871/44436877992_5096b0cf9f_", shape: "tall" },
  { base: "https://live.staticflickr.com/1858/30616458328_658bbdb39c_", shape: "wide" },
  { base: "https://live.staticflickr.com/1886/44436888712_94aaf909af_", shape: "wide" },
  { base: "https://live.staticflickr.com/1844/30616468898_743bcd0419_", shape: "tall" },
  { base: "https://live.staticflickr.com/1850/30616728248_a03f10253b_", shape: "tall" },
  { base: "https://live.staticflickr.com/1862/42676554940_72e081d11d_", shape: "wide" },
  { base: "https://live.staticflickr.com/1872/43576704185_c52fcd057a_", shape: "wide" },
  { base: "https://live.staticflickr.com/1876/44436685062_7769bc6378_", shape: "wide" },
  { base: "https://live.staticflickr.com/1848/43767954664_720ee85d59_", shape: "wide" },
  { base: "https://live.staticflickr.com/1861/30616482898_8b08477a26_", shape: "tall" },
  { base: "https://live.staticflickr.com/1868/30616489898_e4478d3611_", shape: "wide" },
  { base: "https://live.staticflickr.com/1853/43576495335_7c64ac45c5_", shape: "wide" },
  { base: "https://live.staticflickr.com/1877/43576499485_2c466b1f4d_", shape: "tall" },
  { base: "https://live.staticflickr.com/1842/29548684177_cdf86033a3_", shape: "tall" },
  { base: "https://live.staticflickr.com/1876/29548425457_1e78b39764_", shape: "wide" },
  { base: "https://live.staticflickr.com/1879/29548691227_b09def5b97_", shape: "wide" },
  { base: "https://live.staticflickr.com/1859/43576745355_036794f12e_", shape: "tall" },
  { base: "https://live.staticflickr.com/1857/43576509245_060a5f6641_", shape: "tall" },
  { base: "https://live.staticflickr.com/1859/43576789665_8bb5b2b717_", shape: "tall" },
  { base: "https://live.staticflickr.com/1897/44485720601_25cc00564c_", shape: "tall" },
  { base: "https://live.staticflickr.com/1872/44485731411_d7d0dd9ee9_", shape: "wide" },
  { base: "https://live.staticflickr.com/1852/43576797845_d001f1810c_", shape: "wide" },
  { base: "https://live.staticflickr.com/1853/30616566608_d089746e63_", shape: "tall" },
  { base: "https://live.staticflickr.com/1855/44485753651_f199c95487_", shape: "tall" },
  { base: "https://live.staticflickr.com/1851/30616808098_3596da8238_", shape: "tall" },
  { base: "https://live.staticflickr.com/1874/43767996374_c8ed415b2e_", shape: "wide" },
  { base: "https://live.staticflickr.com/1894/43767778894_d720f1bee1_", shape: "wide" },
];

const THUMB_SIZE = "n";
const LARGE_SIZE = "c";

class HarborGallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._index = 0;
    this._touchStartX = 0;
    this._onLang = () => this._localize();
    this._onKeydown = (e) => this._handleKey(e);
  }

  connectedCallback() {
    this._render();
    this._buildThumbs();
    this._bindLightbox();
    document.addEventListener("languagechange", this._onLang);
    document.addEventListener("keydown", this._onKeydown);
    this._localize();
  }

  disconnectedCallback() {
    document.removeEventListener("languagechange", this._onLang);
    document.removeEventListener("keydown", this._onKeydown);
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 160px;
          grid-auto-flow: dense;
          gap: 12px;
        }
        .item {
          padding: 0; border: 0; margin: 0;
          cursor: pointer; overflow: hidden;
          border-radius: var(--radius, 12px);
          background: var(--clr-border, #dde5ea);
          box-shadow: var(--shadow-sm, 0 2px 8px rgba(15,40,55,.08));
        }
        .item img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }
        .item:hover img,
        .item:focus-visible img { transform: scale(1.06); }
        .item--wide { grid-column: span 2; grid-row: span 2; }
        .item--tall { grid-row: span 2; }

        /* ---- Lightbox ---- */
        .lightbox {
          display: none;
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,.92);
          align-items: center; justify-content: center;
          padding: 1rem;
        }
        .lightbox[data-open] { display: flex; }
        .lb-img {
          max-width: 92vw; max-height: 82vh;
          border-radius: 6px;
          transition: opacity .3s ease;
          animation: zoom .3s ease;
        }
        @keyframes zoom { from { transform: scale(.9); } to { transform: scale(1); } }
        .lb-caption {
          position: absolute; bottom: 1.5rem; left: 0; right: 0;
          text-align: center; color: #e6e6e6; font-size: .95rem;
        }
        .lb-btn {
          position: absolute;
          background: rgba(255,255,255,.12); color: #fff;
          border: 0; cursor: pointer; user-select: none;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          transition: background .2s ease, transform .2s ease;
        }
        .lb-btn:hover { background: rgba(255,255,255,.28); }
        .lb-close { top: 1rem; right: 1rem; width: 48px; height: 48px; font-size: 2rem; line-height: 1; }
        .lb-prev, .lb-next { top: 50%; transform: translateY(-50%); width: 56px; height: 56px; font-size: 1.6rem; }
        .lb-prev { left: 1rem; }
        .lb-next { right: 1rem; }
        .lb-prev:hover, .lb-next:hover { transform: translateY(-50%) scale(1.1); }

        /* Tablets */
        @media (max-width: 900px) {
          .grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 150px; }
        }
        /* Phones: tidy 2-up grid of equal squares */
        @media (max-width: 720px) {
          .grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 46vw; gap: 8px; }
          .item--wide, .item--tall { grid-column: span 1; grid-row: span 1; }
        }
        @media (hover: none) and (pointer: coarse) {
          .lb-btn { background: rgba(255,255,255,.22); }
        }
      </style>

      <div class="grid" part="grid"></div>

      <div class="lightbox" role="dialog" aria-modal="true">
        <button class="lb-btn lb-close" aria-label="Close">&times;</button>
        <button class="lb-btn lb-prev" aria-label="Previous photo">&#10094;</button>
        <button class="lb-btn lb-next" aria-label="Next photo">&#10095;</button>
        <img class="lb-img" alt="">
        <div class="lb-caption"></div>
      </div>
    `;

    const $ = (sel) => this.shadowRoot.querySelector(sel);
    this._grid = $(".grid");
    this._lightbox = $(".lightbox");
    this._img = $(".lb-img");
    this._caption = $(".lb-caption");
    this._btnClose = $(".lb-close");
    this._btnPrev = $(".lb-prev");
    this._btnNext = $(".lb-next");
  }

  _buildThumbs() {
    const frag = document.createDocumentFragment();
    PHOTOS.forEach((photo, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `item item--${photo.shape}`;
      btn.setAttribute("aria-label", `${t("gallery.title")} — ${i + 1}`);

      const img = document.createElement("img");
      img.src = photo.base + THUMB_SIZE + ".jpg";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";

      btn.appendChild(img);
      btn.addEventListener("click", () => this.open(i));
      frag.appendChild(btn);
    });
    this._grid.appendChild(frag);
  }

  _bindLightbox() {
    this._btnClose.addEventListener("click", () => this.close());
    this._btnPrev.addEventListener("click", () => this.prev());
    this._btnNext.addEventListener("click", () => this.next());

    // Backdrop click (not on the image or a control) closes.
    this._lightbox.addEventListener("click", (e) => {
      if (e.target === this._lightbox) this.close();
    });

    // Touch swipe on phones/tablets.
    this._lightbox.addEventListener(
      "touchstart",
      (e) => (this._touchStartX = e.changedTouches[0].screenX),
      { passive: true }
    );
    this._lightbox.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].screenX - this._touchStartX;
        if (Math.abs(dx) > 50) (dx > 0 ? this.prev() : this.next());
      },
      { passive: true }
    );
  }

  get _isOpen() {
    return this._lightbox.hasAttribute("data-open");
  }

  _handleKey(e) {
    if (!this._isOpen) return;
    if (e.key === "Escape") this.close();
    else if (e.key === "ArrowLeft") this.prev();
    else if (e.key === "ArrowRight") this.next();
  }

  _show() {
    const photo = PHOTOS[this._index];
    this._img.style.opacity = "0.4";
    this._img.src = photo.base + LARGE_SIZE + ".jpg";
    this._img.onload = () => (this._img.style.opacity = "1");
    this._updateCaption();
  }

  _updateCaption() {
    this._caption.textContent = t("gallery.counter", {
      current: this._index + 1,
      total: PHOTOS.length,
    });
  }

  // ---- Public-ish API ----
  open(index) {
    this._index = index;
    this._show();
    this._lightbox.setAttribute("data-open", "");
    document.body.classList.add("no-scroll");
    this._btnClose.focus();
  }

  close() {
    this._lightbox.removeAttribute("data-open");
    document.body.classList.remove("no-scroll");
    this._img.src = "";
  }

  prev() {
    this._index = (this._index - 1 + PHOTOS.length) % PHOTOS.length;
    this._show();
  }

  next() {
    this._index = (this._index + 1) % PHOTOS.length;
    this._show();
  }

  _localize() {
    this._btnClose.setAttribute("aria-label", t("gallery.close"));
    this._btnPrev.setAttribute("aria-label", t("gallery.prev"));
    this._btnNext.setAttribute("aria-label", t("gallery.next"));
    this._grid.querySelectorAll(".item").forEach((btn, i) => {
      btn.setAttribute("aria-label", `${t("gallery.title")} — ${i + 1}`);
    });
    if (this._isOpen) this._updateCaption();
  }
}

customElements.define("harbor-gallery", HarborGallery);

/* ============================================================
   <harbor-lang-switch>
   ============================================================ */
class HarborLangSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._onLang = (e) => this._reflect(e.detail.lang);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .wrap {
          display: flex; gap: .25rem;
          border: 1px solid var(--clr-border, #dde5ea);
          border-radius: 999px; padding: .2rem;
        }
        button {
          border: 0; background: transparent;
          color: var(--clr-muted, #5b6b74);
          font: inherit; font-size: .78rem; font-weight: 700;
          padding: .3em .7em; border-radius: 999px; cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }
        button:hover { color: var(--clr-text, #1f2b33); }
        button.is-active {
          background: var(--clr-primary, #0e7c86); color: #fff;
        }
      </style>
      <div class="wrap" role="group" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="false">EN</button>
        <button type="button" data-lang="de" aria-pressed="false">DE</button>
        <button type="button" data-lang="pl" aria-pressed="false">PL</button>
      </div>
    `;

    this.shadowRoot.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.i18n) window.i18n.setLanguage(btn.dataset.lang);
      });
    });

    document.addEventListener("languagechange", this._onLang);
    this._reflect(currentLang());
  }

  disconnectedCallback() {
    document.removeEventListener("languagechange", this._onLang);
  }

  _reflect(lang) {
    this.shadowRoot.querySelectorAll("[data-lang]").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }
}

customElements.define("harbor-lang-switch", HarborLangSwitch);

})();
