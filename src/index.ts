import Comparer from './Comparer';

const comparer1 = new Comparer(
 document.querySelector(".parent-container") as HTMLElement,
 { enableDragDrop: true, enableUpload: true }
);

const comparer2 = new Comparer(
 document.querySelector(".parent-container2") as HTMLElement,
 {
  bgLink:
   "https://work.ekry.ru/wp-content/uploads/2021/02/person_2_1.jpg",
  fgLink:
   "https://work.ekry.ru/wp-content/uploads/2021/02/person_2.jpg",
 }
);

const comparer3 = new Comparer(
 document.querySelector(".parent-container3") as HTMLElement,
 { enableDragDrop: false, enableUpload: true },
 {
  handler: {
   width: "4px",
   height: "16px",
   borderRadius: "0",
   boxShadow: "none",
  },
  buttons: {
   boxShadow: "none",
   padding: "12px",
   borderRadius: "0",
  },
  comparerContainer: { boxShadow: "none", borderRadius: "0" },
 }
);
