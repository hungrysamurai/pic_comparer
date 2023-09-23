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
  initDOMElements: (createButtons: boolean, createDropArea: boolean) => void;
  addEvents: () => void;
  generatePreview: (
    element: HTMLDivElement,
    file: File,
    background?: boolean
  ) => void;
  switchClass: (element: HTMLElement, class1: string, class2: string) => void;
  preventDefaults: (e: Event) => void;
  highlight: (element: HTMLElement) => void;
  unHighlight: (element: HTMLElement) => void;
  handleFiles: (files: FileList) => void;
  checkFile: (file: File) => boolean;
}

export interface IComparerInputSettings {
  enableUpload: boolean;
  enableDragDrop: boolean;
  bgLink: string;
  fgLink: string;
}
