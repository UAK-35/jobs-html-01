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
[...popoverTriggerList].map((popoverTriggerEl) => {
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
      // @ts-ignore
      placement: (_context: any, dynamicPopoverElement: HTMLDivElement, triggeringElement: HTMLButtonElement) => {
        if (triggeringElement.id.startsWith("stories-icon-btn-wrapper-")) {
          const popoutElemId = dynamicPopoverElement.id;
          const rect = dynamicPopoverElement.getBoundingClientRect();
          const rightMargin = 50;
          const trgElemRect = triggeringElement.getBoundingClientRect();
          const FifteenRem = 15 * 16;
          const rightSide = trgElemRect.x - FifteenRem + rect.width;
          const isOffscreen1 = rightSide > window.innerWidth;
          if (isOffscreen1) {
            const diff = rightSide - window.innerWidth;
            setTimeout(() => {
              const popoutElem = document.querySelector("#" + popoutElemId) as HTMLDivElement;
              const newX = -1 * (trgElemRect.x - FifteenRem - diff + rightMargin);
              // popoutElem.style.left = newX + "px !important"; // not working
              popoutElem.style.cssText = popoutElem.style.cssText + "left:" + newX + "px !important;";
              // popoutElem.setAttribute("style", popoutElem.style.cssText + "left:" + newX + "px !important;"); // also works
            }, 200);
            return "top";
          }
        }
        return "auto";
      },
    });
  }
  return new Popover(popoverTriggerEl);
});

const calculateForm = document.querySelector("#calculateForm") as HTMLFormElement;
if (calculateForm != null) {
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
}

// IIFE
(function () {
  onReady(() => {
    const spinnerElement = document.querySelector("#loadingSpinner") as HTMLDivElement;
    if (spinnerElement != null) spinnerElement.remove();
  });
})();
