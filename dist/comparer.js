var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Comparer_id, _Comparer_state;
/**
 * Class that generates a Comparer object
 */
class Comparer {
    /**
     *
     * @param parentContainer - DOM elements that will contain a Comparer element as a child node
     * @param ComparerInputSettings - object with options
     * @param ComparerInputSettings.enableUpload - if true creates upload buttons
     * @param ComparerInputSettings.enableDragDrop - if true creates upload drag and drop area
     * @param ComparerInputSettings.bgLink - link to background image
     * @param ComparerInputSettings.fgLink - link to foreground image
     * @this Comparer
     */
    constructor(parentContainer, { enableUpload, enableDragDrop, bgLink, fgLink }) {
        this.parentContainer = parentContainer;
        /**
         * Generates unique ID for Comparer Object
         */
        _Comparer_id.set(this, Date.now() + Math.floor(Math.random() * 1000));
        /**
         * Background/forefround state object. Track whether background or foreground is uploaded
         */
        _Comparer_state.set(this, {
            background: false,
            foreground: false,
        });
        this.comparerContainer = document.createElement("div");
        this.bgImageContainer = document.createElement("div");
        this.fgImageContainer = document.createElement("div");
        this.rangeInput = document.createElement("input");
        this.handler = document.createElement("div");
        // Init DOM elements based on settings
        this.initDOMElements(enableUpload, enableDragDrop);
        // If links provided - load images
        if (fgLink && bgLink) {
            this.fgImageContainer.style.backgroundImage = `url(${fgLink})`;
            this.bgImageContainer.style.backgroundImage = `url(${bgLink})`;
            if (enableUpload &&
                this.backgroundInputLabel &&
                this.foregroundInputLabel) {
                __classPrivateFieldGet(this, _Comparer_state, "f").background = true;
                __classPrivateFieldGet(this, _Comparer_state, "f").foreground = true;
                this.switchClass(this.backgroundInputLabel, "empty", "full");
                this.switchClass(this.foregroundInputLabel, "empty", "full");
            }
        }
        // Add events to DOM elements
        this.addEvents();
    }
    /**
     * @property {Function} initDOMElements - init Comparer in DOM
     * @param  uploadArea - creates upload buttons if true
     * @param  dropArea - creates drag and drop area if true
     */
    initDOMElements(createButtons, createDropArea) {
        this.comparerContainer.classList.add("comparer-container");
        this.bgImageContainer.classList.add("comparer-bg");
        this.fgImageContainer.classList.add("comparer-fg");
        this.rangeInput.setAttribute("type", "range");
        this.rangeInput.setAttribute("step", "0.01");
        this.rangeInput.setAttribute("value", "50");
        this.rangeInput.setAttribute("id", `comparer-range-${__classPrivateFieldGet(this, _Comparer_id, "f")}`);
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
            this.foregroundInput.setAttribute("id", `comparer-upload-${__classPrivateFieldGet(this, _Comparer_id, "f")}-foreground`);
            this.foregroundInput.setAttribute("type", "file");
            this.foregroundInput.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            this.foregroundInput.hidden = true;
            this.foregroundInputLabel = document.createElement("label");
            this.foregroundInputLabel.setAttribute("id", `comparer-upload-btn-foreground-${__classPrivateFieldGet(this, _Comparer_id, "f")}`);
            this.foregroundInputLabel.htmlFor = `comparer-upload-${__classPrivateFieldGet(this, _Comparer_id, "f")}-foreground`;
            this.foregroundInputLabel.className = "comparer-btn empty";
            this.foregroundInputLabel.textContent = "Foreground";
            this.backgroundInput = document.createElement("input");
            this.backgroundInput.setAttribute("id", `comparer-upload-${__classPrivateFieldGet(this, _Comparer_id, "f")}-background`);
            this.backgroundInput.setAttribute("type", "file");
            this.backgroundInput.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            this.backgroundInput.hidden = true;
            this.backgroundInputLabel = document.createElement("label");
            this.backgroundInputLabel.setAttribute("id", `comparer-upload-btn-background-${__classPrivateFieldGet(this, _Comparer_id, "f")}`);
            this.backgroundInputLabel.htmlFor = `comparer-upload-${__classPrivateFieldGet(this, _Comparer_id, "f")}-background`;
            this.backgroundInputLabel.className = "comparer-btn empty";
            this.backgroundInputLabel.textContent = "Background";
            this.uploadContainer.append(this.foregroundInput);
            this.uploadContainer.append(this.backgroundInput);
            this.uploadContainer.append(this.backgroundInputLabel);
            this.uploadContainer.append(this.foregroundInputLabel);
            this.parentContainer.appendChild(this.uploadContainer);
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
                var _a;
                (_a = this.dropArea) === null || _a === void 0 ? void 0 : _a.addEventListener(eventName, this.preventDefaults);
            });
            // Highlight/unhighlight area
            ["dragenter", "dragover"].forEach((eventName) => {
                var _a;
                (_a = this.dropArea) === null || _a === void 0 ? void 0 : _a.addEventListener(eventName, () => {
                    if (this.dropArea) {
                        this.highlight(this.dropArea);
                    }
                });
            });
            ["dragleave", "drop"].forEach((eventName) => {
                var _a;
                (_a = this.dropArea) === null || _a === void 0 ? void 0 : _a.addEventListener(eventName, () => {
                    if (this.dropArea) {
                        this.unHighlight(this.dropArea);
                    }
                });
            });
        }
    }
    /**
     *
     * @property {Function} addEvents - adds events listeners to Compparer
     */
    addEvents() {
        // Drag-to-compare range
        this.rangeInput.addEventListener("input", (e) => {
            if (e.target instanceof HTMLInputElement) {
                const position = Number(e.target.value);
                const px = Math.floor((parseInt(getComputedStyle(this.comparerContainer).width) / 100) *
                    position);
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
                if (e.target instanceof HTMLInputElement &&
                    e.target.files &&
                    this.backgroundInputLabel) {
                    if (!this.checkFile(e.target.files[0]))
                        return;
                    // Check file type
                    this.switchClass(this.backgroundInputLabel, "empty", "full");
                    this.generatePreview(this.fgImageContainer, e.target.files[0]);
                    __classPrivateFieldGet(this, _Comparer_state, "f").foreground = true;
                }
            });
            // Background image upload via button
            this.foregroundInput.addEventListener("input", (e) => {
                if (e.target instanceof HTMLInputElement &&
                    e.target.files &&
                    this.foregroundInputLabel) {
                    // Check file type
                    if (!this.checkFile(e.target.files[0]))
                        return;
                    this.switchClass(this.foregroundInputLabel, "empty", "full");
                    this.generatePreview(this.bgImageContainer, e.target.files[0], true);
                    __classPrivateFieldGet(this, _Comparer_state, "f").background = true;
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
                    if ([...files]
                        .map((file) => {
                        if (!this.checkFile(file))
                            return false;
                        return true;
                    })
                        .includes(false))
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
    generatePreview(element, file, background) {
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
            element.style.backgroundImage = `url(${img.src})`;
        };
    }
    /**
     * @property {Function} switchClass - swap classes on element
     * @param el - element on whitch class will be switched
     * @param  class1 - class to remove
     * @param class2 - class to add
     */
    switchClass(element, class1, class2) {
        element.classList.remove(class1);
        element.classList.add(class2);
    }
    /**
     * @property {Function} preventDefaults prevent default behaviour on DOM element
     * @param e - event object that contains target element
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    /**
     * @property {Function} highlight - adds class 'highlight' on provided element
     * @param el - element
     */
    highlight(element) {
        element.classList.add("highlight");
    }
    /**
     * @property {Function} unhighlight -removes class 'highlight' from provided element
     * @param el - element
     */
    unHighlight(element) {
        element.classList.remove("highlight");
    }
    /**
     * @property {Function} handleFiles - recieves files from drop area and displays them in DOM
     * @param files - array-like list of files that comes from upload area
     */
    handleFiles(files) {
        const filesArray = [...files];
        if (this.backgroundInputLabel && this.foregroundInputLabel) {
            if (filesArray.length === 2) {
                filesArray.forEach((file, index) => {
                    if (index === 0) {
                        this.generatePreview(this.fgImageContainer, file, false);
                    }
                    else if (index === 1) {
                        this.generatePreview(this.bgImageContainer, file, true);
                    }
                });
                this.switchClass(this.backgroundInputLabel, "empty", "full");
                this.switchClass(this.foregroundInputLabel, "empty", "full");
                __classPrivateFieldGet(this, _Comparer_state, "f").foreground = true;
                __classPrivateFieldGet(this, _Comparer_state, "f").background = true;
            }
            else if (filesArray.length === 1) {
                if (!__classPrivateFieldGet(this, _Comparer_state, "f").background && !__classPrivateFieldGet(this, _Comparer_state, "f").foreground) {
                    this.generatePreview(this.bgImageContainer, files[0], true);
                    this.switchClass(this.foregroundInputLabel, "empty", "full");
                    __classPrivateFieldGet(this, _Comparer_state, "f").background = true;
                }
                else if (__classPrivateFieldGet(this, _Comparer_state, "f").background && !__classPrivateFieldGet(this, _Comparer_state, "f").foreground) {
                    this.generatePreview(this.fgImageContainer, files[0]);
                    this.switchClass(this.backgroundInputLabel, "empty", "full");
                    __classPrivateFieldGet(this, _Comparer_state, "f").foreground = true;
                }
                else if (__classPrivateFieldGet(this, _Comparer_state, "f").background && __classPrivateFieldGet(this, _Comparer_state, "f").foreground) {
                    this.generatePreview(this.bgImageContainer, files[0], true);
                }
                else if (__classPrivateFieldGet(this, _Comparer_state, "f").foreground && !__classPrivateFieldGet(this, _Comparer_state, "f").background) {
                    this.generatePreview(this.bgImageContainer, files[0], true);
                }
            }
        }
    }
    /**
     * @property {Function} checkFile - checks if provided file is image
     * @param file - file to check
     */
    checkFile(file) {
        if (!file)
            return false;
        if (!file.type.startsWith("image/"))
            return false;
        return true;
    }
}
_Comparer_id = new WeakMap(), _Comparer_state = new WeakMap();
export default Comparer;
