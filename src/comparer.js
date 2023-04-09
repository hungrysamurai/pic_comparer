/**
 * Class that generates a Comparer object
 */
class Comparer {
  /**
   * Generates unique ID for Comparer Object
   * @type {number}
   */
  #id = Date.now() + Math.floor(Math.random() * 1000);

  /**
   * Background/forefround state object. Track whether background or foreground is uploaded
   * @type {{background: boolean, foreground: boolean}}
   */
  #state = {
    background: false,
    foreground: false,
  };

  /**
   *
   * @param {HTMLElement} parentContainer - DOM elements that will contain a Comparer element as a child node
   * @param {Object} ComparerInitOptions - object with options
   * @param {boolean} [ComparerInitOptions.enableUpload] - if true creates upload buttons
   * @param {boolean} [ComparerInitOptions.enableDragDrop] - if true creates upload drag and drop area
   * @param {string} [ComparerInitOptions.bgLink] - link to background image
   * @param {string} [ComparerInitOptions.fgLink] - link to foreground image
   * @this Comparer
   */
  constructor(
    parentContainer,
    { enableUpload, enableDragDrop, bgLink, fgLink }
  ) {
    /**
     * @property {HTMLElement} parentContainer - is parent DOM element for Comparer
     */
    this.parentContainer = parentContainer;

    // Init DOM elements based on settings
    this.initDOMElements(enableUpload, enableDragDrop);

    // If links provided - load images
    if (fgLink && bgLink) {
      this.fgImage.style.backgroundImage = `url(${fgLink})`;
      this.bgImage.style.backgroundImage = `url(${bgLink})`;

      if (enableUpload) {
        this.#state.background = true;
        this.#state.foreground = true;

        this.switchClass(this.uploadBtnBG, "empty", "full");
        this.switchClass(this.uploadBtnFG, "empty", "full");
      }
    }

    // Add events to DOM elements
    this.addEvents(enableUpload, enableDragDrop);
  }

  /**
   * @property {Function} initDOMElements - init Comparer in DOM
   * @param {boolean} uploadArea - creates upload buttons if true
   * @param {boolean} dropArea - creates drag and drop area if true
   * @returns {void}
   */
  initDOMElements(uploadArea, dropArea) {
    // Init Comparer  container
    this.comparerContainer = document.createElement("div");
    this.comparerContainer.classList.add("comparer-container");
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

    this.range = this.comparerContainer.querySelector(
      `#comparer-range-${this.#id}`
    );
    this.fgImage = this.comparerContainer.querySelector(".comparer-fg");
    this.bgImage = this.comparerContainer.querySelector(".comparer-bg");
    this.handler = this.comparerContainer.querySelector(".comparer-handler");

    this.parentContainer.appendChild(this.comparerContainer);

    // Init upload Buttons
    if (uploadArea) {
      const uploadContainer = document.createElement("div");
      uploadContainer.classList.add("comparer-upload-container");
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

      this.imageInputBackground = uploadContainer.querySelector(
        `#comparer-upload-${this.#id}-background`
      );
      this.imageInputForeground = uploadContainer.querySelector(
        `#comparer-upload-${this.#id}-foreground`
      );
      this.uploadBtnBG = uploadContainer.querySelector(
        `#comparer-upload-btn-background-${this.#id}`
      );
      this.uploadBtnFG = uploadContainer.querySelector(
        `#comparer-upload-btn-foreground-${this.#id}`
      );

      this.parentContainer.appendChild(uploadContainer);
    }

    // Add Drag'n'Drop area
    if (dropArea) {
      this.dropArea = document.createElement("div");
      this.dropArea.classList.add("comparer-drop-area");

      this.dropInner = document.createElement("div");
      this.dropInner.classList.add("comparer-drop-inner");
      this.dropInner.textContent = "Drop some images to compare";

      this.dropArea.appendChild(this.dropInner);

      this.parentContainer.appendChild(this.dropArea);

      // Prevent defaults for drag events

      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        this.dropArea.addEventListener(eventName, this.preventDefaults);
      });

      // Highlight/unhighlight area

      ["dragenter", "dragover"].forEach((eventName) => {
        this.dropArea.addEventListener(eventName, () => {
          this.highlight(this.dropArea);
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        this.dropArea.addEventListener(eventName, () => {
          this.dropArea.addEventListener(eventName, () => {
            this.unhighlight(this.dropArea);
          });
        });
      });
    }
  }

  /**
   *
   * @property {Function} addEvents - adds events listeners to Compparer
   * @param {boolean} buttons - if true - adds buttons events
   * @param {boolean} dragDrop - if true adds upload area events
   * @returns {void}
   */
  addEvents(buttons, dragDrop) {
    // Drag-to-compare range
    this.range.addEventListener("input", (e) => {
      const position = e.target.value;
      const px = Math.floor(
        (parseInt(getComputedStyle(this.comparerContainer).width) / 100) *
          position
      );
      this.handler.style.left = `${position}%`;
      this.fgImage.style.width = `${px}px`;
    });

    this.range.addEventListener("mouseenter", () => {
      this.handler.classList.add("active");
    });

    this.range.addEventListener("mouseleave", () => {
      this.handler.classList.remove("active");
    });

    this.range.addEventListener("touchstart", () => {
      this.handler.classList.add("active");
    });

    this.range.addEventListener("touchend", () => {
      this.handler.classList.remove("active");
    });

    if (buttons) {
      // Foreground image upload via button
      this.imageInputBackground.addEventListener("input", (e) => {
        // Check file type
        if (!this.checkFile(e.target.files[0])) return;
        this.switchClass(this.uploadBtnBG, "empty", "full");
        this.generatePreview(this.fgImage, e.target.files[0]);
        this.#state.foreground = true;
      });

      // Background image upload via button
      this.imageInputForeground.addEventListener("input", (e) => {
        // Check file type
        if (!this.checkFile(e.target.files[0])) return;
        this.switchClass(this.uploadBtnFG, "empty", "full");
        this.generatePreview(this.bgImage, e.target.files[0], true);
        this.#state.background = true;
      });
    }
    // Drag'n'Drop area uploads
    if (dragDrop) {
      this.dropArea.addEventListener("drop", (e) => {
        let dt = e.dataTransfer;
        let files = dt.files;

        if (files.length > 2) {
          this.dropInner.textContent = "Please drop one or two images!";
          return;
        }
        if (
          [...files]
            .map((file) => {
              if (!this.checkFile(file)) return false;
              return true;
            })
            .includes(false)
        )
          return;

        this.handleFiles(files);
      });
    }
  }

  /**
   * @property {Function} generatePreview - displays uploaded image in DOM
   * @param {HTMLElement} el - DOM element, background or foreground div
   * @param {File} file - uploading file
   * @param {boolean} background - if true - this is background element that sets aspect ratio for whole Comparer
   * @returns {void}
   */
  generatePreview(el, file, background) {
    let reader = new FileReader();
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
    };
  }

  /**
   * @property {Function} switchClass - swap classes on element
   * @param {HTMLElement} el - element on whitch class will be switched
   * @param {string} class1 - class to remove
   * @param {string} class2 - class to add
   * @returns {void}
   */
  switchClass(el, class1, class2) {
    el.classList.remove(class1);
    el.classList.add(class2);
  }

  /**
   * @property {Function} preventDefaults prevent default behaviour on DOM element
   * @param {Object} e - event object that contains target element
   * @returns {void}
   */
  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * @property {Function} highlight - adds class 'highlight' on provided element
   * @param {HTMLElement} el - element
   * @returns {void}
   */
  highlight(el) {
    el.classList.add("highlight");
  }

  /**
   * @property {Function} unhighlight -removes class 'highlight' from provided element
   * @param {HTMLElement} el - element
   * @returns {void}
   */
  unhighlight(el) {
    el.classList.remove("highlight");
  }

  /**
   * @property {Function} handleFiles - recieves files from drop area and displays them in DOM
   * @param {FileList} files - array-like list of files that comes from upload area
   * @returns {void}
   */
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
      this.switchClass(this.uploadBtnBG, "empty", "full");
      this.switchClass(this.uploadBtnFG, "empty", "full");
      this.#state.foreground = true;
      this.#state.background = true;
    } else if (files.length === 1) {
      if (!this.#state.background && !this.#state.foreground) {
        this.generatePreview(this.bgImage, files[0], true);
        this.switchClass(this.uploadBtnFG, "empty", "full");
        this.#state.background = true;
      } else if (this.#state.background && !this.#state.foreground) {
        this.generatePreview(this.fgImage, files[0]);
        this.switchClass(this.uploadBtnBG, "empty", "full");
        this.#state.foreground = true;
      } else if (this.#state.background && this.#state.foreground) {
        this.generatePreview(this.bgImage, files[0], true);
      } else if (this.#state.foreground && !this.#state.background) {
        this.generatePreview(this.bgImage, files[0], true);
      }
    }
  }

  /**
   * @property {Function} checkFile - checks if provided file is image
   * @param {File} file - file to check
   * @returns {boolean}
   */
  checkFile(file) {
    if (!file) return false;
    if (!file.type.startsWith("image/")) return false;
    return true;
  }
}
