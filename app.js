const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link')

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
    })
})

// Gallery Management Class
class ImageGallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.modal = null;
        this.modalImg = null;
        this.captionText = null;
        this.isInitialized = false;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGallery());
        } else {
            this.setupGallery();
        }
    }

    setupGallery() {
        // Collect all image data from s-image elements
        const sImageElements = document.getElementsByTagName("s-image");
        this.images = Array.from(sImageElements).map(element => ({
            index: parseInt(element.getAttribute("indexImage")),
            photoId: element.getAttribute("photoId"),
            class: element.getAttribute("class") || "big",
            previewSize: element.getAttribute("previewSize") || "n"
        }));

        // Sort images by index to ensure correct order
        this.images.sort((a, b) => a.index - b.index);

        // Get modal elements
        this.modal = document.getElementById('myModal');
        this.modalImg = document.getElementById("imgPreview");
        this.captionText = document.getElementById("caption");

        // Setup event listeners (only once)
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Close modal events
        const closeSpan = document.getElementsByClassName("close")[0];
        closeSpan.addEventListener('click', () => this.closeModal());

        // Navigation events
        const previousBtn = document.getElementsByClassName("previousImg")[0];
        const nextBtn = document.getElementsByClassName("nextImg")[0];

        previousBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === "block") {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextImage();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.closeModal();
                        break;
                }
            }
        });

        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openImage(index) {
        if (!this.isInitialized) {
            console.error('Gallery not initialized yet');
            return;
        }

        // Find image by index
        const imageIndex = this.images.findIndex(img => img.index === parseInt(index));
        if (imageIndex === -1) {
            console.error('Image not found:', index);
            return;
        }

        this.currentIndex = imageIndex;
        this.displayCurrentImage();
        this.modal.style.display = "block";
    }

    displayCurrentImage() {
        const image = this.images[this.currentIndex];
        if (!image) return;

        // Show loading state
        this.modalImg.style.opacity = '0.5';

        // Set image source
        this.modalImg.src = image.photoId + 'c.jpg';

        // Update caption with image counter
        this.captionText.innerHTML = `Image ${this.currentIndex + 1} of ${this.images.length}`;

        // Remove loading state when image loads
        this.modalImg.onload = () => {
            this.modalImg.style.opacity = '1';
        };

        // Update hidden input for compatibility
        document.getElementById('currentIndex').setAttribute('value', image.index);
    }

    previousImage() {
        if (this.images.length === 0) return;

        // Wrap around to last image if at first
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.displayCurrentImage();
    }

    nextImage() {
        if (this.images.length === 0) return;

        // Wrap around to first image if at last
        this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.displayCurrentImage();
    }

    closeModal() {
        this.modal.style.display = "none";
        this.modalImg.src = '';
        document.getElementById('currentIndex').setAttribute('value', '');
    }
}

// Initialize gallery
const gallery = new ImageGallery();

// Legacy function for compatibility with existing s-image onclick handlers
function setImage(index, src = "", suffix = "w.jpg") {
    gallery.openImage(index);
}
