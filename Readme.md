# Pic_comparer

The `Comparer` is a JavaScript module that allows you to create a side-by-side image comparison tool within a web application. This README provides an overview of the `Comparer` class, its features, and how to use it effectively.

## Introduction

The `Comparer` class generates a visual comparison tool for two images. It provides a draggable range slider that allows users to interactively compare the two images by adjusting the position of the slider. Additionally, it supports optional features such as image upload buttons and drag-and-drop functionality.

## Usage

### Installation

    npm i @hungrysamurai/pic_comparer

First, make sure to include the `Comparer` module in your project. After that, you can use the `Comparer` class as follows:

    import { Comparer } from "@hungrysamurai/pic_comparer";

    // Your parent container element where the comparer will be added
    const parentContainer = document.getElementById("comparer-container");

    // Configuration options
    const comparerInputSettings = {
      enableUpload: true,        // Enable image upload buttons
      enableDragDrop: true,      // Enable drag-and-drop functionality
      bgLink: "background.jpg",  // Link to the background image (optional)
      fgLink: "foreground.jpg",  // Link to the foreground image (optional)
    };

    // Create a new Comparer instance
    const comparer = new Comparer(parentContainer, comparerInputSettings);`

### Initialization

To initialize a `Comparer` instance, provide the following parameters:

- `parentContainer`: The DOM element that will contain the `Comparer` as a child node.
- `comparerInputSettings`: An object with the following properties:
  - `enableUpload` (optional): If `true`, creates upload buttons for images.
  - `enableDragDrop` (optional): If `true`, creates a drag-and-drop area for image uploads.
  - `bgLink`: Link to the background image.
  - `fgLink`: Link to the foreground image.

### Optional Features

The `Comparer` class supports optional features that can be enabled during initialization:

#### Image Upload Buttons

If you set `enableUpload` to `true`, the `Comparer` will create upload buttons for both background and foreground images. Users can click these buttons to select images from their local device.

#### Drag-and-Drop Area

If you set `enableDragDrop` to `true`, the `Comparer` will create a drag-and-drop area where users can drop images to upload them.

## Methods

The `Comparer` class provides several methods for interacting with the comparison tool programmatically:

- `initDOMElements(createButtons?: boolean, createDropArea?: boolean)`: Initializes the DOM elements for the comparison tool. You can specify whether to create upload buttons and a drag-and-drop area.
- `applyExtraStyles(extraStyles: IComparerExtraStyles)`: Applies custom CSS styles to various parts of the `Comparer` tool, such as the handler, container, or buttons.
- `addEvents()`: Adds event listeners to the `Comparer` tool for interactivity, including handling slider movement, image uploads, and drag-and-drop.

## Events

The `Comparer` class provides event listeners for various user interactions, such as:

- Slider movement: The `rangeInput` element allows users to slide left or right to compare images.
- Mouse and touch events: Events are triggered when users hover over or interact with the slider.
- Image uploads: Events are fired when users upload background and foreground images using buttons or drag-and-drop.

You can customize these event listeners or add your own functionality as needed.

## Styling

You can customize the appearance of the `Comparer` tool by applying CSS styles to its elements. The class uses predefined CSS class names and structures for styling, making it easy to customize its visual aspects.
