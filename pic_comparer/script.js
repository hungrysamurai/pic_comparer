class Comparer {
  constructor(parentContainer, { enableUpload, enableDragDrop, bgLink, fgLink }) {
    this.id = Math.floor(Math.random() * 1000);
    this.parentContainer = parentContainer;

    // Init DOM elements
    this.initDOMElements(enableUpload, enableDragDrop);

    this.comparerContainer = parentContainer.querySelector(".comparer-container");
    this.range = parentContainer.querySelector("#range");
    this.fgImage = parentContainer.querySelector(".comparer-fg");
    this.bgImage = parentContainer.querySelector(".comparer-bg");
    this.handler = parentContainer.querySelector(".handler");

    // Init upload buttons
    if (enableUpload) {
      this.imageInput1 = parentContainer.querySelector(`#comparer-upload-${this.id}`);
      this.imageInput2 = parentContainer.querySelector(`#comparer-upload-${this.id}-2`);
      this.uploadBtn1 = parentContainer.querySelector('#upload-btn-1');
      this.uploadBtn2 = parentContainer.querySelector('#upload-btn-2');
    }

    // Init Drag'n'Drop Area
    if (enableDragDrop) {
      this.dropArea = parentContainer.querySelector('.drop-area');
      this.dropInput = parentContainer.querySelector('#fileElem');
      this.dropInner = parentContainer.querySelector('.drop-inner');

      // Prevent defaults for drag events
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        this.dropArea.addEventListener(eventName, this.preventDefaults);
      });

      // Highlight/unhighlight area
      ['dragenter', 'dragover'].forEach(eventName => {
        this.dropArea.addEventListener(eventName, () => {
          this.highlight(this.dropArea)
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        this.dropArea.addEventListener(eventName, () => {
          this.dropArea.addEventListener(eventName, () => {
            this.unhighlight(this.dropArea)
          });
        });
      });

    }

    // Init state object
    this.state = {
      background: false,
      foreground: false
    }

    // If links provided - load images
    if (fgLink && bgLink) {
      this.fgImage.style.backgroundImage = `url(${fgLink})`;
      this.bgImage.style.backgroundImage = `url(${bgLink})`;

      if (enableUpload) {
        this.state = {
          background: true,
          foreground: true
        }

        this.classChanger(this.uploadBtn1, 'empty', 'full');
        this.classChanger(this.uploadBtn2, 'empty', 'full');
      }

    }

    // Add events
    this.addEvents(enableUpload, enableDragDrop);
  }

  initDOMElements(uploadArea, dropArea) {
    const comparerContainer = document.createElement('div');
    comparerContainer.classList.add('comparer-container');
    comparerContainer.innerHTML = `
            <div class="comparer-bg"></div>
            <div class="comparer-fg"></div>

        <input
          type="range"
          step="0.01"
          value="50"
          id="range"
          class="range"
          max="100"
          min="0"
        />
        <div class="handler"></div>
    `;
    this.parentContainer.append(comparerContainer);

    // Add upload Buttons
    if (uploadArea) {
      const uploadContainer = document.createElement('div');
      uploadContainer.classList.add('comparer-upload-container');
      uploadContainer.innerHTML = `
            <input
          type="file"
          id="comparer-upload-${this.id}"
          accept="image/jpeg, image/png, image/jpg"
          hidden
        />
        <input
          type="file"
          id="comparer-upload-${this.id}-2"
          accept="image/jpeg, image/png, image/jpg"
          hidden
        />
        <label
          for="comparer-upload-${this.id}-2"
          id="upload-btn-2"
          class="comparer-btn empty"
          >Background</label
        >
        <label
          for="comparer-upload-${this.id}"
          id="upload-btn-1"
          class="comparer-btn empty"
          >Foreground</label
        >
    `;
      this.parentContainer.append(uploadContainer);
    }

    // Add Drag'n'Drop area
    if (dropArea) {
      const dropContainer = document.createElement('div');
      dropContainer.classList.add('drop-area');
      dropContainer.innerHTML = `
      <div class="drop-inner">Drop some files to compare</div>
        <input
          type="file"
          id="fileElem"
          multiple
          accept="image/*"
          onchange="handleFiles(this.files)"
        />
`;
      this.parentContainer.append(dropContainer);
    }
  }

  generatePreview(el, file, background) {
    let reader = new FileReader()
    reader.readAsDataURL(file);

    // bind context to self
    const self = this;

    reader.onloadend = function () {
      let img = new Image();
      if (background) {
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          self.comparerContainer.style.aspectRatio = `${aspectRatio} / 1`;
        };
      }

      img.src = reader.result;
      el.style.backgroundImage = `url(${img.src})`;
    }
  }


  classChanger(el, class1, class2) {
    el.classList.remove(class1);
    el.classList.add(class2)
  }

  preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  };

  highlight(el) {
    el.classList.add('highlight')
  };

  unhighlight(el) {
    el.classList.remove('highlight')
  };

  handleFiles(files) {

    files = [...files];

    if (files.length === 2) {
      files.forEach((file, index) => {
        if (index === 0) {
          this.generatePreview(this.fgImage, file, false);
        } else if (index === 1) {
          this.generatePreview(this.bgImage, file, true);
        }
      });
      this.classChanger(this.uploadBtn1, 'empty', 'full');
      this.classChanger(this.uploadBtn2, 'empty', 'full');
      this.state.foreground = true;
      this.state.background = true;
    }
    else if (files.length === 1) {
      if (!this.state.background && !this.state.foreground) {
        this.generatePreview(this.bgImage, files[0], true);
        this.classChanger(this.uploadBtn2, 'empty', 'full');
        this.state.background = true;
      } else if (this.state.background && !this.state.foreground) {
        this.generatePreview(this.fgImage, files[0]);
        this.classChanger(this.uploadBtn1, 'empty', 'full');
        this.state.foreground = true;
      } else if (this.state.background && this.state.foreground) {
        this.generatePreview(this.bgImage, files[0], true);
      } else if (this.state.foreground && !this.state.background) {
        this.generatePreview(this.bgImage, files[0], true);
      }
    }
  };

  checkFile(file) {
    if (!file) return false;
    if (!file.type.startsWith('image/')) return false;
    return true;
  }

  addEvents(buttons, dragDrop) {
    // Drag-to-compare range
    this.range.addEventListener("input", (e) => {
      const position = e.target.value;
      this.handler.style.left = `${position}%`;
      this.fgImage.style.width = `${position}%`;
      this.bgImage.style.width = `calc(100% -${position}%)`;

      this.state.background = true;
    });

    if (buttons) {
      // Foreground image upload via button
      this.imageInput1.addEventListener("change", (e) => {
        // Check file type
        if (!this.checkFile(e.target.files[0])) return;
        this.classChanger(this.uploadBtn1, 'empty', 'full');
        this.generatePreview(this.fgImage, e.target.files[0]);
        this.state.foreground = true;
      });

      // Background image upload via button
      this.imageInput2.addEventListener("change", (e) => {
        // Check file type
        if (!this.checkFile(e.target.files[0])) return;
        this.classChanger(this.uploadBtn2, 'empty', 'full');
        this.generatePreview(this.bgImage, e.target.files[0], true);
        this.state.background = true;
      });
    }
    // Drag'n'Drop area uploads
    if (dragDrop) {
      this.dropArea.addEventListener('drop', (e) => {
        let dt = e.dataTransfer
        let files = dt.files

        if (files.length > 2) {
          this.dropInner.textContent = 'Please drop one or two images!';
          return;
        }
        if ([...files].map(file => {
          if (!this.checkFile(file)) return false;
          return true;
        }).includes(false)) return;

        this.handleFiles(files)
      })
    }

  }
}

const comparer1 = new Comparer(document.querySelector('.parent-container'), { enableDragDrop: true, enableUpload: true });

// const comparer2 = new Comparer(document.querySelector('.parent-container2'), { enableDragDrop: true, enableUpload: true });

const comparer2 = new Comparer(document.querySelector('.parent-container2'), { bgLink: 'https://work.ekry.ru/wp-content/uploads/2021/02/person_2_1.jpg', fgLink: 'https://work.ekry.ru/wp-content/uploads/2021/02/person_2.jpg' });





// const comparer2 = new Comparer(document.querySelector('.parent-container2'));

// const comparerContainer = document.querySelector(".comparer-container");
// const range = document.querySelector("#range");
// const fgImage = document.querySelector(".comparer-fg");
// const bgImage = document.querySelector(".comparer-bg");
// const handler = document.querySelector(".handler");
// const imageInput1 = document.querySelector("#comparer-upload-1");
// const imageInput2 = document.querySelector("#comparer-upload-2");
// const uploadBtn1 = document.querySelector('#upload-btn-1');
// const uploadBtn2 = document.querySelector('#upload-btn-2');
// const dropArea = document.getElementById('drop-area');
// const dropInput = document.querySelector('#fileElem');
// const dropInner = document.querySelector('.drop-inner');


// // State object
// const state = {
//   background: false,
//   foreground: false
// }

// // Drag-to-compare range
// range.addEventListener("input", (e) => {
//   const position = e.target.value;
//   handler.style.left = `${position}%`;
//   fgImage.style.width = `${position}%`;
//   state.background = true;
// });

// // Foreground image upload via button
// imageInput1.addEventListener("change", (e) => {
//   classChanger(uploadBtn1, 'empty', 'full');
//   generatePreview(fgImage, e.target.files[0]);
//   state.foreground = true;
// });

// // Background image upload via button
// imageInput2.addEventListener("change", (e) => {
//   classChanger(uploadBtn2, 'empty', 'full');
//   generatePreview(bgImage, e.target.files[0], true);
//   state.background = true;
// });


// // Image replacement function
// function generatePreview(el, file, background) {
//   let reader = new FileReader()
//   reader.readAsDataURL(file);

//   reader.onloadend = function () {
//     let img = new Image();

//     if (background) {
//       img.onload = function () {
//         const aspectRatio = img.width / img.height;
//         comparerContainer.style.aspectRatio = `${aspectRatio} / 1`;
//       };
//     }

//     img.src = reader.result;
//     el.style.backgroundImage = `url(${img.src})`;
//   }
// }

// // Drag-n-drop area

// // Prevent default for listeners
// function preventDefaults(e) {
//   e.preventDefault()
//   e.stopPropagation()
// };

// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//   dropArea.addEventListener(eventName, preventDefaults)
// });

// // Highlight the area when dragged
// function highlight() {
//   dropArea.classList.add('highlight')
// };

// function unhighlight() {
//   dropArea.classList.remove('highlight')
// };

// ['dragenter', 'dragover'].forEach(eventName => {
//   dropArea.addEventListener(eventName, highlight)
// });

// ['dragleave', 'drop'].forEach(eventName => {
//   dropArea.addEventListener(eventName, unhighlight)
// });

// // On drop event
// dropArea.addEventListener('drop', handleDrop)

// function handleDrop(e) {
//   let dt = e.dataTransfer
//   let files = dt.files
//   handleFiles(files)
// }

// // Handle files from drag-and-drop area
// function handleFiles(files) {

//   files = [...files];

//   if (files.length > 2) {
//     dropInner.textContent = 'Please drop one or two images!'
//   } else if (files.length === 2) {
//     files.forEach((file, index) => {
//       if (index === 0) {
//         generatePreview(fgImage, file, false);
//       } else if (index === 1) {
//         generatePreview(bgImage, file, true);
//       }
//     });
//     classChanger(uploadBtn1, 'empty', 'full');
//     classChanger(uploadBtn2, 'empty', 'full');
//     state.foreground = true;
//     state.background = true;
//   }
//   else if (files.length === 1) {
//     if (!state.background && !state.foreground) {
//       generatePreview(bgImage, files[0], true);
//       classChanger(uploadBtn2, 'empty', 'full');
//       state.background = true;
//     } else if (state.background && !state.foreground) {
//       generatePreview(fgImage, files[0]);
//       classChanger(uploadBtn1, 'empty', 'full');
//       state.foreground = true;
//     } else if (state.background && state.foreground) {
//       generatePreview(bgImage, files[0], true);
//     } else if (state.foreground && !state.background) {
//       generatePreview(bgImage, files[0], true);
//     }
//   }
// };

// // Class switcher function
// function classChanger(el, class1, class2) {
//   el.classList.remove(class1);
//   el.classList.add(class2)
// }