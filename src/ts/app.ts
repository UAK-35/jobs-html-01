/** @format */

// Import our custom CSS
import "../scss/style.scss";

import "@popperjs/core";
import "bootstrap";
import { Popover } from "bootstrap";

function onReady(callback: () => void) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

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
    // const allHiddenElementsF = Array.from(document.querySelectorAll(".hidden-initially-flex"));
    // allHiddenElementsF.forEach((element, index) => {
    //   const htmlElement = element as HTMLDivElement;
    //   htmlElement.style.display = "flex";
    // });
    // const allHiddenElementsB = Array.from(document.querySelectorAll(".hidden-initially-block"));
    // allHiddenElementsB.forEach((element, index) => {
    //   const htmlElement = element as HTMLDivElement;
    //   htmlElement.style.display = "block";
    // });
    const spinnerElement = document.querySelector("#loadingSpinner") as HTMLDivElement;
    spinnerElement.remove();
    // spinnerElement.style.display = "none";
  });
})();
