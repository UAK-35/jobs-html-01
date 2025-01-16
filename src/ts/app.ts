/** @format */

// Import our custom CSS
import "../scss/style.scss";

// import smtp from "smtp.js";
// import emailjs from "emailjs-com";
import emailjs from "@emailjs/browser";
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
import img10 from "../assets/images/pics/GREATER-LONDON.jpg";
import img11 from "../assets/images/pics/Logo2.png";
import img12 from "../assets/images/pics/rvw-xtra-1.png";
// @ts-ignore
import img13 from "../assets/images/pics/rvw-DPFW9030.JPG";
// @ts-ignore
import img14 from "../assets/images/pics/rvw-OSVJE1220.JPG";

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

function onReady(callback: () => void) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

emailjs.init({
  publicKey: "iOXXeJ531GOeQqGwS",
  blockHeadless: true, // Do not allow headless browsers
});

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
img.src = img11;
img.src = img12;
img.src = img13;
img.src = img14;

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

const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = [...popoverTriggerList].map((popoverTriggerEl) => {
  const popoverHtmlElem = popoverTriggerEl as HTMLElement;
  if (popoverHtmlElem.dataset["hasHtmlContent"] === "true" && popoverHtmlElem.dataset["htmlContentContainerId"] != null) {
    const popoverShowInsideContainerElem = document.querySelector(`#${popoverHtmlElem.dataset["showInsideContainerId"]}`) as HTMLElement;
    const popoverHtmlContainerElem = document.querySelector(`#${popoverHtmlElem.dataset["htmlContentContainerId"]}`) as HTMLElement;
    const temp = document.createElement("div");
    temp.innerHTML = popoverHtmlContainerElem.innerHTML;
    return new Popover(popoverTriggerEl, {
      html: true,
      // container: document.querySelector("#stories-map-container") as HTMLElement,
      container: document.querySelector(`#${popoverShowInsideContainerElem.id}`) as HTMLElement,
      // offset: "10,30",
      content: temp,
    });
  }
  return new Popover(popoverTriggerEl);
});

const calculateForm = document.querySelector("#calculateForm") as HTMLFormElement;
calculateForm.addEventListener("submit", (e: any) => {
  e.preventDefault();
  const formElem = e.target as HTMLFormElement;

  const dataToSend: FormDataRecord = {};
  const formElements = formElem.elements;
  for (const elementKey in formElements) {
    const element = formElements[elementKey] as HTMLFormElement;
    if (element.tagName != null && !(element.tagName === "BUTTON")) {
      console.group("form-element");
      console.log("   name", element.name);
      console.log("     id", element.id);
      console.log("tagName", element.tagName);
      console.log("  value", element.value);
      console.groupEnd();
      const key = element.id != null ? element.id : element.name;
      // dataToSend.append(key, element.value);
      dataToSend[key] = element.value;
    }
  }
});

// IIFE
(function () {
  onReady(() => {
    const allHiddenElements = Array.from(document.querySelectorAll(".hidden-initially"));
    allHiddenElements.forEach((element, index) => {
      const htmlElement = element as HTMLDivElement;
      htmlElement.style.display = "block";
    });
    const spinnerElement = document.querySelector("#loadingSpinner") as HTMLDivElement;
    spinnerElement.remove();
    // spinnerElement.style.display = "none";
  });
})();
