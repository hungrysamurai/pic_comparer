"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
var _id = /*#__PURE__*/new WeakMap();
var Comparer = /*#__PURE__*/function () {
  function Comparer(parentContainer, _ref) {
    var enableUpload = _ref.enableUpload,
      enableDragDrop = _ref.enableDragDrop,
      bgLink = _ref.bgLink,
      fgLink = _ref.fgLink;
    _classCallCheck(this, Comparer);
    _classPrivateFieldInitSpec(this, _id, {
      writable: true,
      value: Date.now() + Math.floor(Math.random() * 1000)
    });
    this.parentContainer = parentContainer;

    // Init DOM elements based on settings
    this.initDOMElements(enableUpload, enableDragDrop);

    // Init state object
    this.state = {
      background: false,
      foreground: false
    };

    // If links provided - load images
    if (fgLink && bgLink) {
      this.fgImage.style.backgroundImage = "url(".concat(fgLink, ")");
      this.bgImage.style.backgroundImage = "url(".concat(bgLink, ")");
      if (enableUpload) {
        this.state = {
          background: true,
          foreground: true
        };
        this.switchClass(this.uploadBtnBG, 'empty', 'full');
        this.switchClass(this.uploadBtnFG, 'empty', 'full');
      }
    }

    // Add events
    this.addEvents(enableUpload, enableDragDrop);
  }
  _createClass(Comparer, [{
    key: "initDOMElements",
    value: function initDOMElements(uploadArea, dropArea) {
      var _this = this;
      // Init Comparer  container
      this.comparerContainer = document.createElement('div');
      this.comparerContainer.classList.add('comparer-container');
      this.comparerContainer.innerHTML = "\n        <div class=\"comparer-bg\"></div>\n        <div class=\"comparer-fg\"></div>\n\n        <input\n          type=\"range\"\n          step=\"0.01\"\n          value=\"50\"\n          id=\"comparer-range-".concat(_classPrivateFieldGet(this, _id), "\"\n          class=\"comparer-range\"\n          max=\"100\"\n          min=\"0\"\n        />\n\n        <div class=\"comparer-handler\"></div>\n    ");
      this.range = this.comparerContainer.querySelector("#comparer-range-".concat(_classPrivateFieldGet(this, _id)));
      this.fgImage = this.comparerContainer.querySelector(".comparer-fg");
      this.bgImage = this.comparerContainer.querySelector(".comparer-bg");
      this.handler = this.comparerContainer.querySelector(".comparer-handler");
      this.parentContainer.appendChild(this.comparerContainer);

      // Init upload Buttons
      if (uploadArea) {
        var uploadContainer = document.createElement('div');
        uploadContainer.classList.add('comparer-upload-container');
        uploadContainer.innerHTML = "\n        \n        <input\n          type=\"file\"\n          id=\"comparer-upload-".concat(_classPrivateFieldGet(this, _id), "-foreground\"\n          accept=\"image/jpeg, image/png, image/jpg\"\n          hidden\n        />\n        <input\n          type=\"file\"\n          id=\"comparer-upload-").concat(_classPrivateFieldGet(this, _id), "-background\"\n          accept=\"image/jpeg, image/png, image/jpg\"\n          hidden\n        />\n        <label\n          for=\"comparer-upload-").concat(_classPrivateFieldGet(this, _id), "-background\"\n          id=\"comparer-upload-btn-background-").concat(_classPrivateFieldGet(this, _id), "\"\n          class=\"comparer-btn empty\"\n          >Foreground</label\n        >\n        <label\n          for=\"comparer-upload-").concat(_classPrivateFieldGet(this, _id), "-foreground\"\n          id=\"comparer-upload-btn-foreground-").concat(_classPrivateFieldGet(this, _id), "\"\n          class=\"comparer-btn empty\"\n          >Background</label\n        >\n    ");
        this.imageInputBackground = uploadContainer.querySelector("#comparer-upload-".concat(_classPrivateFieldGet(this, _id), "-background"));
        this.imageInputForeground = uploadContainer.querySelector("#comparer-upload-".concat(_classPrivateFieldGet(this, _id), "-foreground"));
        this.uploadBtnBG = uploadContainer.querySelector("#comparer-upload-btn-background-".concat(_classPrivateFieldGet(this, _id)));
        this.uploadBtnFG = uploadContainer.querySelector("#comparer-upload-btn-foreground-".concat(_classPrivateFieldGet(this, _id)));
        this.parentContainer.appendChild(uploadContainer);
      }

      // Add Drag'n'Drop area
      if (dropArea) {
        this.dropArea = document.createElement('div');
        this.dropArea.classList.add('comparer-drop-area');
        this.dropInner = document.createElement('div');
        this.dropInner.classList.add('comparer-drop-inner');
        this.dropInner.textContent = 'Drop some images to compare';
        this.dropArea.appendChild(this.dropInner);
        this.parentContainer.appendChild(this.dropArea);

        // Prevent defaults for drag events

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
          _this.dropArea.addEventListener(eventName, _this.preventDefaults);
        });

        // Highlight/unhighlight area

        ['dragenter', 'dragover'].forEach(function (eventName) {
          _this.dropArea.addEventListener(eventName, function () {
            _this.highlight(_this.dropArea);
          });
        });
        ['dragleave', 'drop'].forEach(function (eventName) {
          _this.dropArea.addEventListener(eventName, function () {
            _this.dropArea.addEventListener(eventName, function () {
              _this.unhighlight(_this.dropArea);
            });
          });
        });
      }
    }
  }, {
    key: "addEvents",
    value: function addEvents(buttons, dragDrop) {
      var _this2 = this;
      // Drag-to-compare range
      this.range.addEventListener("input", function (e) {
        var position = e.target.value;
        var px = Math.floor(parseInt(getComputedStyle(_this2.comparerContainer).width) / 100 * position);
        _this2.handler.style.left = "".concat(position, "%");
        _this2.fgImage.style.width = "".concat(px, "px");
      });
      this.range.addEventListener('mouseenter', function () {
        _this2.handler.classList.add('active');
      });
      this.range.addEventListener('mouseleave', function () {
        _this2.handler.classList.remove('active');
      });
      this.range.addEventListener('touchstart', function () {
        _this2.handler.classList.add('active');
      });
      this.range.addEventListener('touchend', function () {
        _this2.handler.classList.remove('active');
      });
      if (buttons) {
        // Foreground image upload via button
        this.imageInputBackground.addEventListener("input", function (e) {
          // Check file type
          if (!_this2.checkFile(e.target.files[0])) return;
          _this2.switchClass(_this2.uploadBtnBG, 'empty', 'full');
          _this2.generatePreview(_this2.fgImage, e.target.files[0]);
          _this2.state.foreground = true;
        });

        // Background image upload via button
        this.imageInputForeground.addEventListener("input", function (e) {
          // Check file type
          if (!_this2.checkFile(e.target.files[0])) return;
          _this2.switchClass(_this2.uploadBtnFG, 'empty', 'full');
          _this2.generatePreview(_this2.bgImage, e.target.files[0], true);
          _this2.state.background = true;
        });
      }
      // Drag'n'Drop area uploads
      if (dragDrop) {
        this.dropArea.addEventListener('drop', function (e) {
          var dt = e.dataTransfer;
          var files = dt.files;
          if (files.length > 2) {
            _this2.dropInner.textContent = 'Please drop one or two images!';
            return;
          }
          if (_toConsumableArray(files).map(function (file) {
            if (!_this2.checkFile(file)) return false;
            return true;
          }).includes(false)) return;
          _this2.handleFiles(files);
        });
      }
    }
  }, {
    key: "generatePreview",
    value: function generatePreview(el, file, background) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      // bind context to self
      var self = this;
      reader.onloadend = function () {
        var img = new Image();
        if (background) {
          img.onload = function () {
            var aspectRatio = img.width / img.height;
            self.comparerContainer.style.aspectRatio = "".concat(aspectRatio, " / 1");
          };
        }
        img.src = reader.result;
        el.style.backgroundImage = "url(".concat(img.src, ")");
      };
    }
  }, {
    key: "switchClass",
    value: function switchClass(el, class1, class2) {
      el.classList.remove(class1);
      el.classList.add(class2);
    }
  }, {
    key: "preventDefaults",
    value: function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, {
    key: "highlight",
    value: function highlight(el) {
      el.classList.add('highlight');
    }
  }, {
    key: "unhighlight",
    value: function unhighlight(el) {
      el.classList.remove('highlight');
    }
  }, {
    key: "handleFiles",
    value: function handleFiles(files) {
      var _this3 = this;
      files = _toConsumableArray(files);
      if (files.length === 2) {
        files.forEach(function (file, index) {
          if (index === 0) {
            _this3.generatePreview(_this3.fgImage, file, false);
          } else if (index === 1) {
            _this3.generatePreview(_this3.bgImage, file, true);
          }
        });
        this.switchClass(this.uploadBtnBG, 'empty', 'full');
        this.switchClass(this.uploadBtnFG, 'empty', 'full');
        this.state.foreground = true;
        this.state.background = true;
      } else if (files.length === 1) {
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
    }
  }, {
    key: "checkFile",
    value: function checkFile(file) {
      if (!file) return false;
      if (!file.type.startsWith('image/')) return false;
      return true;
    }
  }]);
  return Comparer;
}();