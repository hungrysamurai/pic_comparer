const comparerContainer = document.querySelector(".comparer-container");
const range = document.querySelector("#range");
const fgImage = document.querySelector(".comparer-fg");
const bgImage = document.querySelector(".comparer-bg");
const handler = document.querySelector(".handler");
const imageInput1 = document.querySelector("#comparer-upload-1");
const imageInput2 = document.querySelector("#comparer-upload-2");
const uploadBtn1 = document.querySelector('#upload-btn-1');
const uploadBtn2 = document.querySelector('#upload-btn-2');

range.addEventListener("input", (e) => {
  const position = e.target.value;
  handler.style.left = `${position}%`;
  fgImage.style.width = `${position}%`;
});

imageInput1.addEventListener("change", (e) => {
  uploadBtn1.classList.remove('empty');
  uploadBtn1.classList.add('full');
  replaceImage(fgImage, e.target, true);
});

imageInput2.addEventListener("change", (e) => {
  uploadBtn2.classList.remove('empty');
  uploadBtn2.classList.add('full');
  replaceImage(bgImage, e.target, false);
});

function replaceImage(el, context, mainImg) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    let img = new Image();

    if (mainImg) {
      img.onload = function () {
        const aspectRatio = img.width / img.height;
        comparerContainer.style.aspectRatio = `${aspectRatio} / 1`;
      };
    }

    img.src = reader.result;
    el.style.backgroundImage = `url(${img.src})`;
  });

  reader.readAsDataURL(context.files[0]);
}

// range.addEventListener('click', function (e) {
//  const height = Math.floor(e.offsetY / (comparerContainer.offsetHeight / 100));
//  handler.style.top = `${height}%`;
// })
