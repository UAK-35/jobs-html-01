/** @format */

// Import our custom CSS
import "../scss/style.scss";

import "@popperjs/core";
import "bootstrap";
import { Popover } from "bootstrap";

import img1 from "../assets/images/pics/approach-1.png";
import img2 from "../assets/images/pics/approach-2.png";
import img3 from "../assets/images/pics/approach-3.png";
import img4 from "../assets/images/pics/partner-1.png";
import img5 from "../assets/images/pics/partner-2.png";
import img6 from "../assets/images/pics/partner-3.png";
import img7 from "../assets/images/pics/partner-4.png";
import img8 from "../assets/images/pics/localTradesmen.png";
import img9 from "../assets/images/pics/quoteCalculate.png";
import img10 from "../assets/images/pics/GREATER-LONDON.png";

import ico1 from "../assets/images/icons/Email.svg";
import ico2 from "../assets/images/icons/Location.svg";
import ico3 from "../assets/images/icons/PhoneCall.svg";
import ico4 from "../assets/images/icons/BathroomRemodeling.svg";
import ico5 from "../assets/images/icons/HomeExtensions.svg";
import ico6 from "../assets/images/icons/HouseRefurbishment.svg";
import ico7 from "../assets/images/icons/KitchenRefurbishment.svg";
import ico8 from "../assets/images/icons/ApproachArrow.svg";
import ico9 from "../assets/images/icons/Logo1.svg";
import ico10 from "../assets/images/icons/Hammer.svg";
import ico11 from "../assets/images/icons/Pin.svg";

const img = document.createElement("img");
img.src = img1;
img.src = img2;
img.src = img3;
img.src = img4;
img.src = img5;
img.src = img6;
img.src = img7;
img.src = img8;
img.src = img9;
img.src = img10;

img.src = ico1;
img.src = ico2;
img.src = ico3;
img.src = ico4;
img.src = ico5;
img.src = ico6;
img.src = ico7;
img.src = ico8;
img.src = ico9;
img.src = ico10;
img.src = ico11;

// document.addEventListener("load", (evt) => {
const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
// alert(popoverTriggerList.length);
const popoverList = [...popoverTriggerList].map((popoverTriggerEl) => {
  const popoverHtmlElem = popoverTriggerEl as HTMLElement;
  if (popoverHtmlElem.dataset["hasHtmlContent"] === "true" && popoverHtmlElem.dataset["htmlContentContainerId"] != null) {
    const popoverHtmlContainerElem = document.querySelector("#" + popoverHtmlElem.dataset["htmlContentContainerId"]) as HTMLElement;
    const temp = document.createElement("div");
    temp.innerHTML = popoverHtmlContainerElem.innerHTML;
    return new Popover(popoverTriggerEl, {
      html: true,
      content: temp,
    });
  }
  return new Popover(popoverTriggerEl);
});
// });

// import Collapse from "bootstrap/js/dist/collapse";
// import Popover from "bootstrap/js/dist/popover";
// import Button from "bootstrap/js/dist/button";

// // Import all of Bootstrap's JS
// // import * as bootstrap from 'bootstrap'
//
// import Alert from "bootstrap/js/dist/alert";
//
// // or, specify which plugins you need:
// import { Tooltip, Toast, Popover } from "bootstrap";
//
// // @ts-ignore
// import logo from "../assets/images/icon.png";
//
// import { getUsers } from "./users";
//
// export async function printUsers(): Promise<HTMLElement> {
//   const users = await getUsers();
//   const element = document.createElement("div");
//   element.innerHTML = `<h2>Current users</h2>
//                         ${users.map((user) => `<div>${user.name}</div>`).join("")}`;
//
//   return element;
// }
//
// // printUsers().then((element) => {
// //   // const img = document.createElement("img");
// //   // img.src = logo;
// //   // document.body.appendChild(img);
// //
// //   return document.body.appendChild(element);
// // })
// // .catch(() => console.error("Something went wrong"));
//
// (async () => {
//   const element = await printUsers();
//   document.body.appendChild(element);
// })();
