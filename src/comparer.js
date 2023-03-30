class Comparer {

  #id = Date.now() + Math.floor(Math.random() * 1000);

  constructor(parentContainer, { enableUpload, enableDragDrop, bgLink, fgLink }) {
    this.parentContainer = parentContainer;

    // Init DOM elements based on settings
    this.initDOMElements(enableUpload, enableDragDrop);

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

        this.switchClass(this.uploadBtnBG, 'empty', 'full');
        this.switchClass(this.uploadBtnFG, 'empty', 'full');
      }
    }

    // Add events
    this.addEvents(enableUpload, enableDragDrop);
  }

  initDOMElements(uploadArea, dropArea) {

    // Init Comparer  container
    this.comparerContainer = document.createElement('div');
    this.comparerContainer.classList.add('comparer-container');
    this.comparerContainer.innerHTML = `
        <div class="comparer-bg"></div>
        <div class="comparer-fg"></div>

        <input
          type="range"
          step="0.01"
          value="50"
          id="comparer-range-${this.#id}"
          class="comparer-range"
          max="100"
          min="0"
        />

        <div class="comparer-handler"></div>
    `;

    this.range = this.comparerContainer.querySelector(`#comparer-range-${this.#id}`);
    this.fgImage = this.comparerContainer.querySelector(".comparer-fg");
    this.bgImage = this.comparerContainer.querySelector(".comparer-bg");
    this.handler = this.comparerContainer.querySelector(".comparer-handler");

    this.parentContainer.appendChild(this.comparerContainer);

    // Init upload Buttons
    if (uploadArea) {
      const uploadContainer = document.createElement('div');
      uploadContainer.classList.add('comparer-upload-container');
      uploadContainer.innerHTML = `
        
        <input
          type="file"
          id="comparer-upload-${this.#id}-foreground"
          accept="image/jpeg, image/png, image/jpg"
          hidden
        />
        <input
          type="file"
          id="comparer-upload-${this.#id}-background"
          accept="image/jpeg, image/png, image/jpg"
          hidden
        />
        <label
          for="comparer-upload-${this.#id}-background"
          id="comparer-upload-btn-background-${this.#id}"
          class="comparer-btn empty"
          >Foreground</label
        >
        <label
          for="comparer-upload-${this.#id}-foreground"
          id="comparer-upload-btn-foreground-${this.#id}"
          class="comparer-btn empty"
          >Background</label
        >
    `;

      this.imageInputBackground = uploadContainer.querySelector(`#comparer-upload-${this.#id}-background`);
      this.imageInputForeground = uploadContainer.querySelector(`#comparer-upload-${this.#id}-foreground`);
      this.uploadBtnBG = uploadContainer.querySelector(`#comparer-upload-btn-background-${this.#id}`);
      this.uploadBtnFG = uploadContainer.querySelector(`#comparer-upload-btn-foreground-${this.#id}`);

      this.parentContainer.appendChild(uploadContainer);
    }

    // Add Drag'n'Drop area
    if (dropArea) {
      this.dropArea = document.createElement('div');
      this.dropArea.classList.add('comparer-drop-area');

      this.dropInner = document.createElement('div');
      this.dropInner.classList.add('comparer-drop-inner');
      this.dropInner.textContent = 'Drop some images to compare';

      this.dropArea.appendChild(this.dropInner)

      this.parentContainer.appendChild(this.dropArea);

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
  }

  addEvents(buttons, dragDrop) {
    // Drag-to-compare range
    this.range.addEventListener("input", (e) => {
      const position = e.target.value;
      const px = Math.floor((parseInt(getComputedStyle(this.comparerContainer).width)) / 100 * position);
      this.handler.style.left = `${position}%`;
      this.fgImage.style.width = `${px}px`;
    });

    this.range.addEventListener('mouseenter', () => {
      this.handler.classList.add('active')
    });

    this.range.addEventListener('mouseleave', () => {
      this.handler.classList.remove('active')
    });

    this.range.addEventListener('touchstart', () => {
      this.handler.classList.add('active')
    })

    this.range.addEventListener('touchend', () => {
      this.handler.classList.remove('active')
    })

    if (buttons) {
      // Foreground image upload via button
      this.imageInputBackground.addEventListener("input", (e) => {
        // Check file type
        if (!this.checkFile(e.target.files[0])) return;
        this.switchClass(this.uploadBtnBG, 'empty', 'full');
        this.generatePreview(this.fgImage, e.target.files[0]);
        this.state.foreground = true;
      });

      // Background image upload via button
      this.imageInputForeground.addEventListener("input", (e) => {
        // Check file type
        if (!this.checkFile(e.target.files[0])) return;
        this.switchClass(this.uploadBtnFG, 'empty', 'full');
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

  switchClass(el, class1, class2) {
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
      this.switchClass(this.uploadBtnBG, 'empty', 'full');
      this.switchClass(this.uploadBtnFG, 'empty', 'full');
      this.state.foreground = true;
      this.state.background = true;
    }
    else if (files.length === 1) {
      if (!this.state.background && !this.state.foreground) {
        this.generatePreview(this.bgImage, files[0], true);
        this.switchClass(this.uploadBtnFG, 'empty', 'full');
        this.state.background = true;
      } else if (this.state.background && !this.state.foreground) {
        this.generatePreview(this.fgImage, files[0]);
        this.switchClass(this.uploadBtnBG, 'empty', 'full');
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
}

