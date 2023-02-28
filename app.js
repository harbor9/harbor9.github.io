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

function setImage(index, src = "", sufix = "w.jpg") {

    var modal = document.getElementById('myModal');
    // index we need to set to be able to switch previous and next image
    document.getElementById('currentIndex').setAttribute('value', index)

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById('myImg');
    var modalImg = document.getElementById("imgPreview");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = src + sufix
    captionText.innerHTML = img.alt;

    // Get the <span> element that closes the modal
    var closeSpan = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    closeSpan.onclick = function() {
      modal.style.display = "none";
      document.getElementById("imgPreview").src = '';
      document.getElementById('currentIndex').setAttribute('value', '')
    }

    var spanPreviousImg = document.getElementsByClassName("previousImg")[0];

    spanPreviousImg.onclick = function() {
      var currentIndex = document.getElementById('currentIndex').getAttribute('value')
      const sImages = document.getElementsByTagName("s-image")
      var sImage = sImages[currentIndex-1]
      setImage(sImage.indexImage, sImage.photoId, 'c.jpg')
    }

    var spanNextImg = document.getElementsByClassName("nextImg")[0];
    spanNextImg.onclick = function() {
      setImage('https://live.staticflickr.com/1872/29548347767_27d80564ce_','c.jpg')
    }
    // Get the <span> element that show the image on the right (previous)

    // Get the <span> element that show the image on the left (next)
}
