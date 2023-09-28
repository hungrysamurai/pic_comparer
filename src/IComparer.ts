export default interface IComparer {
  parentContainer: HTMLElement;
  comparerContainer: HTMLDivElement;
  bgImageContainer: HTMLDivElement;
  fgImageContainer: HTMLDivElement;
  rangeInput: HTMLInputElement;
  handler: HTMLDivElement;
  uploadContainer?: HTMLDivElement;
  backgroundInput?: HTMLInputElement;
  foregroundInput?: HTMLInputElement;
  foregroundInputLabel?: HTMLLabelElement;
  backgroundInputLabel?: HTMLLabelElement;
  dropArea?: HTMLDivElement;
  dropInner?: HTMLDivElement;
  buttons?: [HTMLLabelElement, HTMLLabelElement]
  initDOMElements: (createButtons: boolean, createDropArea: boolean) => void;
  addEvents: () => void;
  applyExtraStyles: (extraStyles: IComparerExtraStyles) => void;
  generatePreview: (
    element: HTMLDivElement,
    file: File,
    background?: boolean
  ) => void;
  activateEl: (element: HTMLElement) => void;
  preventDefaults: (e: Event) => void;
  highlight: (element: HTMLElement) => void;
  unHighlight: (element: HTMLElement) => void;
  handleFiles: (files: FileList) => void;
  checkFile: (file: File) => boolean;
}

export interface IComparerInputSettings {
  enableUpload: boolean;
  enableDragDrop: boolean;
  bgLink?: string;
  fgLink?: string;
}

export interface IComparerState {
  background: boolean;
  foreground: boolean;
}

export enum ElementsWithCustomStyles {
  handler = 'handler',
  comparerContainer = 'comparerContainer',
  buttons = 'buttons'
}

export interface IComparerExtraStyles {
  handler?: {
    [key: string]: string
  },
  comparerContainer?: {
    [key: string]: string
  },
  buttons?: {
    [key: string]: string
  }
}

export enum ButtonsClassNames {
  empty = 'empty',
  full = 'full'
}