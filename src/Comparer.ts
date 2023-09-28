import IComparer, { IComparerInputSettings, IComparerState, IComparerExtraStyles, ElementsWithCustomStyles } from "./IComparer.js";

/**
 * Class that generates a Comparer object
 */
export class Comparer implements IComparer {
  /**
   * Generates unique ID for Comparer Object
   */
  #id: number = Date.now() + Math.floor(Math.random() * 1000);

  /**
   * Background/forefround state object. Track whether background or foreground is uploaded
   */
  #state: IComparerState = {
    background: false,
    foreground: false,
  };

  comparerContainer = document.createElement("div");
  bgImageContainer = document.createElement("div");
  fgImageContainer = document.createElement("div");
  rangeInput = document.createElement("input");
  handler = document.createElement("div");

  // Optional
  uploadContainer?: HTMLDivElement;
  backgroundInput?: HTMLInputElement;
  foregroundInput?: HTMLInputElement;
  foregroundInputLabel?: HTMLLabelElement;
  backgroundInputLabel?: HTMLLabelElement;
  dropArea?: HTMLDivElement;
  dropInner?: HTMLDivElement;
  buttons?: [HTMLLabelElement, HTMLLabelElement]

  /**
   *
   * @param parentContainer - DOM elements that will contain a Comparer element as a child node
   * @param comparerInputSettings - object with options
   * @param comparerInputSettings.enableUpload - if true creates upload buttons
   * @param comparerInputSettings.enableDragDrop - if true creates upload drag and drop area
   * @param comparerInputSettings.bgLink - link to background image
   * @param comparerInputSettings.fgLink - link to foreground image
   * * @param extraStyles {('handler'|'comparerContainer'|'buttons')} - object with optional CSS properties for handler, container or buttons
   * @this Comparer
   */
  constructor(
    public parentContainer: HTMLElement,
    comparerInputSettings: IComparerInputSettings,
    extraStyles?: IComparerExtraStyles
  ) {
    const { enableUpload, enableDragDrop, bgLink, fgLink } =
      comparerInputSettings;
    // Init DOM elements based on settings
    this.initDOMElements(enableUpload, enableDragDrop);

    // If links provided - load images
    if (fgLink && bgLink) {
      this.fgImageContainer.style.backgroundImage = `url(${fgLink})`;
      this.bgImageContainer.style.backgroundImage = `url(${bgLink})`;

      if (
        enableUpload &&
        this.backgroundInputLabel &&
        this.foregroundInputLabel
      ) {
        this.#state.background = true;
        this.#state.foreground = true;

        this.activateEl(this.backgroundInputLabel);
        this.activateEl(this.foregroundInputLabel);
      }
    }

    if (extraStyles) {
      this.applyExtraStyles(extraStyles);
    }

    // Add events to DOM elements
    this.addEvents();
  }

  /**
   * @property {Function} initDOMElements - init Comparer in DOM
   * @param  uploadArea - creates upload buttons if true
   * @param  dropArea - creates drag and drop area if true
   */
  initDOMElements(createButtons?: boolean, createDropArea?: boolean) {
    this.comparerContainer.classList.add("comparer-container");

    this.bgImageContainer.classList.add("comparer-bg");
    this.fgImageContainer.classList.add("comparer-fg");

    this.rangeInput.setAttribute("type", "range");
    this.rangeInput.setAttribute("step", "0.01");
    this.rangeInput.setAttribute("value", "50");
    this.rangeInput.setAttribute("id", `comparer-range-${this.#id}`);
    this.rangeInput.setAttribute("min", "0");
    this.rangeInput.setAttribute("max", "100");
    this.rangeInput.classList.add("comparer-range");

    this.handler.classList.add("comparer-handler");

    this.comparerContainer.append(this.bgImageContainer);
    this.comparerContainer.append(this.fgImageContainer);
    this.comparerContainer.append(this.rangeInput);
    this.comparerContainer.append(this.handler);

    this.parentContainer.appendChild(this.comparerContainer);

    // Init upload Buttons
    if (createButtons) {
      this.uploadContainer = document.createElement("div");
      this.uploadContainer.classList.add("comparer-upload-container");

      this.foregroundInput = document.createElement("input");
      this.foregroundInput.setAttribute(
        "id",
        `comparer-upload-${this.#id}-foreground`
      );
      this.foregroundInput.setAttribute("type", "file");
      this.foregroundInput.setAttribute(
        "accept",
        "image/jpeg, image/png, image/jpg"
      );
      this.foregroundInput.hidden = true;

      this.foregroundInputLabel = document.createElement("label");
      this.foregroundInputLabel.setAttribute(
        "id",
        `comparer-upload-btn-foreground-${this.#id}`
      );
      this.foregroundInputLabel.htmlFor = `comparer-upload-${this.#id
        }-foreground`;
      this.foregroundInputLabel.className = "comparer-btn";
      this.foregroundInputLabel.textContent = "Foreground";

      this.backgroundInput = document.createElement("input");
      this.backgroundInput.setAttribute(
        "id",
        `comparer-upload-${this.#id}-background`
      );
      this.backgroundInput.setAttribute("type", "file");
      this.backgroundInput.setAttribute(
        "accept",
        "image/jpeg, image/png, image/jpg"
      );
      this.backgroundInput.hidden = true;

      this.backgroundInputLabel = document.createElement("label");
      this.backgroundInputLabel.setAttribute(
        "id",
        `comparer-upload-btn-background-${this.#id}`
      );
      this.backgroundInputLabel.htmlFor = `comparer-upload-${this.#id
        }-background`;
      this.backgroundInputLabel.className = "comparer-btn";
      this.backgroundInputLabel.textContent = "Background";

      this.uploadContainer.append(this.foregroundInput);
      this.uploadContainer.append(this.backgroundInput);
      this.uploadContainer.append(this.foregroundInputLabel);
      this.uploadContainer.append(this.backgroundInputLabel);

      this.parentContainer.appendChild(this.uploadContainer);

      this.buttons = [this.foregroundInputLabel, this.backgroundInputLabel];
    }

    // Add Drag'n'Drop area
    if (createDropArea) {
      this.dropArea = document.createElement("div");
      this.dropArea.classList.add("comparer-drop-area");

      this.dropInner = document.createElement("div");
      this.dropInner.classList.add("comparer-drop-inner");
      this.dropInner.textContent = "Drop some images to compare";

      this.dropArea.appendChild(this.dropInner);

      this.parentContainer.appendChild(this.dropArea);

      // Prevent defaults for drag events

      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        this.dropArea?.addEventListener(eventName, this.preventDefaults);
      });

      // Highlight/unhighlight area

      ["dragenter", "dragover"].forEach((eventName) => {
        this.dropArea?.addEventListener(eventName, () => {
          if (this.dropArea) {
            this.highlight(this.dropArea);
          }
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        this.dropArea?.addEventListener(eventName, () => {
          if (this.dropArea) {
            this.unHighlight(this.dropArea);
          }
        });
      });
    }
  }

  /**
 *
 * @property {Function} applyExtraStyles - apply provided styles to Comparer
 */
  applyExtraStyles(extraStyles: IComparerExtraStyles) {
    Object.keys(extraStyles).forEach(prop => {

      const target = this[prop as keyof IComparerExtraStyles];

      if (target && prop in ElementsWithCustomStyles) {
        if (Array.isArray(target)) {
          target.forEach(label => {
            Object.entries(extraStyles[prop as keyof object]).forEach(tuple => {
              const [key, value] = tuple;
              label.style[key as keyof object] = value as string;
            })
          })
        } else {
          Object.entries(extraStyles[prop as keyof object]).forEach(tuple => {
            const [key, value] = tuple;
            target.style[key as keyof object] = value as string;
          })
        }
      }
    })
  }

  /**
   *
   * @property {Function} addEvents - adds events listeners to Compparer
   */
  addEvents() {

    // Drag-to-compare range
    this.rangeInput.addEventListener("input", (e) => {
      if (e.target instanceof HTMLInputElement) {
        const position: number = Number((<HTMLInputElement>e.target).value);
        const px: number = Math.floor(
          (parseInt(getComputedStyle(this.comparerContainer).width) / 100) *
          position
        );
        this.handler.style.left = `${position}%`;
        this.fgImageContainer.style.width = `${px}px`;
      }
    });

    this.rangeInput.addEventListener("mouseenter", () => {
      this.handler.classList.add("active");
    });

    this.rangeInput.addEventListener("mouseleave", () => {
      this.handler.classList.remove("active");
    });

    this.rangeInput.addEventListener("touchstart", () => {
      this.handler.classList.add("active");
    });

    this.rangeInput.addEventListener("touchend", () => {
      this.handler.classList.remove("active");
    });

    if (this.foregroundInput && this.backgroundInput) {
      // Foreground image upload via button
      this.backgroundInput.addEventListener("input", (e) => {
        if (
          e.target instanceof HTMLInputElement &&
          e.target.files &&
          this.backgroundInputLabel
        ) {
          // Check file type
          if (!this.checkFile(e.target.files[0])) return;

          this.activateEl(this.backgroundInputLabel);
          this.generatePreview(this.bgImageContainer, e.target.files[0], true);

          this.#state.foreground = true;
        }
      });

      // Background image upload via button
      this.foregroundInput.addEventListener("input", (e) => {
        if (
          e.target instanceof HTMLInputElement &&
          e.target.files &&
          this.foregroundInputLabel
        ) {
          // Check file type
          if (!this.checkFile(e.target.files[0])) return;
          this.activateEl(this.foregroundInputLabel);
          this.generatePreview(this.fgImageContainer, e.target.files[0]);
          this.#state.background = true;
        }
      });
    }
    // Drag'n'Drop area uploads
    if (this.dropArea) {
      this.dropArea.addEventListener("drop", (e) => {
        let dt = e.dataTransfer;
        if (dt) {
          let files = dt.files;

          if (files.length > 2 && this.dropInner) {
            this.dropInner.textContent = "Please drop one or two images!";
            return;
          }
          if (
            Array.from(files)
              .map((file) => {
                if (!this.checkFile(file)) return false;
                return true;
              })
              .includes(false)
          )
            return;

          this.handleFiles(files);
        }
      });
    }
  }

  /**
   * @property {Function} generatePreview - displays uploaded image in DOM
   * @param element - DOM element, background or foreground div
   * @param file - uploading file
   * @param background - if true - this is background element that sets aspect ratio for whole Comparer
   */
  generatePreview(element: HTMLDivElement, file: File, background?: boolean) {
    let reader: FileReader = new FileReader();
    reader.readAsDataURL(file);

    // bind context to self
    const self: this = this;

    reader.onloadend = function () {
      let img: HTMLImageElement = new Image();
      if (background) {
        img.onload = () => {
          const aspectRatio: number = img.width / img.height;
          self.comparerContainer.style.aspectRatio = `${aspectRatio} / 1`;
        };
      }

      img.src = reader.result as string;
      element.style.backgroundImage = `url(${img.src})`;
    };
  }

  /**
   * @property {Function} activateEl - add active class on element
   * @param el - element on whitch class will be added
   */
  activateEl(element: HTMLElement) {
    element.classList.add('full');
  }

  /**
   * @property {Function} preventDefaults prevent default behaviour on DOM element
   * @param e - event object that contains target element
   */
  preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * @property {Function} highlight - adds class 'highlight' on provided element
   * @param el - element
   */
  highlight(element: HTMLElement) {
    element.classList.add("highlight");
  }

  /**
   * @property {Function} unhighlight -removes class 'highlight' from provided element
   * @param el - element
   */
  unHighlight(element: HTMLElement) {
    element.classList.remove("highlight");
  }

  /**
   * @property {Function} handleFiles - recieves files from drop area and displays them in DOM
   * @param files - array-like list of files that comes from upload area
   */
  handleFiles(files: FileList) {
    const filesArray: Array<File> = Array.from(files);

    if (filesArray.length === 2) {
      filesArray.forEach((file, index) => {
        if (index === 0) {
          this.generatePreview(this.fgImageContainer, file, false);
        } else if (index === 1) {
          this.generatePreview(this.bgImageContainer, file, true);
        }
      });
      if (this.backgroundInputLabel && this.foregroundInputLabel) {
        this.activateEl(this.backgroundInputLabel);
        this.activateEl(this.foregroundInputLabel);
      }
      this.#state.foreground = true;
      this.#state.background = true;

    } else if (filesArray.length === 1) {

      if (!this.#state.background && !this.#state.foreground) {
        this.generatePreview(this.bgImageContainer, files[0], true);
        if (this.backgroundInputLabel) {
          this.activateEl(this.backgroundInputLabel);
        }
        this.#state.background = true;

      } else if (this.#state.background && !this.#state.foreground) {
        this.generatePreview(this.fgImageContainer, files[0]);

        if (this.foregroundInputLabel) {
          this.activateEl(this.foregroundInputLabel);
        }

        this.#state.foreground = true;
      } else if (this.#state.background && this.#state.foreground) {
        this.generatePreview(this.bgImageContainer, files[0], true);
      } else if (this.#state.foreground && !this.#state.background) {
        this.generatePreview(this.bgImageContainer, files[0], true);
      }
    }
  }

  /**
   * @property {Function} checkFile - checks if provided file is image
   * @param file - file to check
   */
  checkFile(file: File) {
    if (!file) return false;
    if (!file.type.startsWith("image/")) return false;
    return true;
  }
}

