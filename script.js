const comparerContainer = document.querySelector(".comparer-container");
const range = document.querySelector("#range");
const fgImage = document.querySelector(".comparer-fg");
const bgImage = document.querySelector(".comparer-bg");
const handler = document.querySelector(".handler");
const imageInput1 = document.querySelector("#comparer-upload-1");
const imageInput2 = document.querySelector("#comparer-upload-2");
const uploadBtn1 = document.querySelector('#upload-btn-1');
const uploadBtn2 = document.querySelector('#upload-btn-2');
const dropArea = document.getElementById('drop-area');
const dropInput = document.querySelector('#fileElem');
const dropInner = document.querySelector('.drop-inner');


// State object
const state = {
  background: false,
  foreground: false
}

// Drag-to-compare func
range.addEventListener("input", (e) => {
  const position = e.target.value;
  handler.style.left = `${position}%`;
  fgImage.style.width = `${position}%`;
  state.background = true;
});

// Foreground image upload via button
imageInput1.addEventListener("change", (e) => {
  classChanger(uploadBtn1, 'empty', 'full');
  generatePreview(fgImage, e.target.files[0]);
  state.foreground = true;
});

// Background image upload via button
imageInput2.addEventListener("change", (e) => {
  classChanger(uploadBtn2, 'empty', 'full');
  generatePreview(bgImage, e.target.files[0], true);
  state.background = true;
});


// Image replacement function
function generatePreview(el, file, background) {
  let reader = new FileReader()
  reader.readAsDataURL(file);

  reader.onloadend = function () {
    let img = new Image();

    if (background) {
      img.onload = function () {
        const aspectRatio = img.width / img.height;
        comparerContainer.style.aspectRatio = `${aspectRatio} / 1`;
      };
    }

    img.src = reader.result;
    el.style.backgroundImage = `url(${img.src})`;
  }
}

// Drag-n-drop area 

// Prevent default for listeners
function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults)
});

// Highlight the area when dragged
function highlight() {
  dropArea.classList.add('highlight')
};

function unhighlight() {
  dropArea.classList.remove('highlight')
};

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight)
});

// On drop event
dropArea.addEventListener('drop', handleDrop)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files)
}

// Handle files from drag-and-drop area
function handleFiles(files) {

  files = [...files];

  if (files.length > 2) {
    dropInner.textContent = 'Please drop one or two images!'
  } else if (files.length === 2) {
    files.forEach((file, index) => {
      if (index === 0) {
        generatePreview(fgImage, file, false);
      } else if (index === 1) {
        generatePreview(bgImage, file, true);
      }
    });
    classChanger(uploadBtn1, 'empty', 'full');
    classChanger(uploadBtn2, 'empty', 'full');
    state.foreground = true;
    state.background = true;
  }
  else if (files.length === 1) {
    if (!state.background && !state.foreground) {
      generatePreview(bgImage, files[0], true);
      classChanger(uploadBtn2, 'empty', 'full');
      state.background = true;
    } else if (state.background && !state.foreground) {
      generatePreview(fgImage, files[0]);
      classChanger(uploadBtn1, 'empty', 'full');
      state.foreground = true;
    } else if (state.background && state.foreground) {
      generatePreview(bgImage, files[0], true);
    } else if (state.foreground && !state.background) {
      generatePreview(bgImage, files[0], true);
    }
  }
};

// Class switcher function
function classChanger(el, class1, class2) {
  el.classList.remove(class1);
  el.classList.add(class2)
}