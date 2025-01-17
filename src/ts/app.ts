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
      placement: (context: any, dynamicPopoverElement: HTMLDivElement, triggeringElement: HTMLButtonElement) => {
        if (triggeringElement.id.startsWith("stories-icon-btn-wrapper-")) {
          const popoutElemId = dynamicPopoverElement.id;
          // const position = {
          //   top: dynamicPopoverElement.offsetTop,
          //   left: dynamicPopoverElement.offsetLeft,
          // };
          // if (position.left > 515) {
          //   return "left";
          // }
          // if (position.left < 515) {
          //   return "right";
          // }
          // if (position.top < 110) {
          //   return "bottom";
          // }
          // return "top";

          const rect = dynamicPopoverElement.getBoundingClientRect();
          // const isOffscreen = rect.x + rect.width < 0 || rect.y + rect.height < 0 || rect.x > window.innerWidth || rect.y > window.innerHeight;
          // const rectX = rect.x; // + window.scrollX;
          // const rectY = rect.y; // + window.scrollY;
          // const rectRight = rectX + rect.width;
          // const rectRightAdj = rectRight - 160;
          // // const rectBottom = rectY + rect.height;
          // const isOffscreen = rectRight > window.innerWidth;
          // // alert(JSON.stringify({ isOffscreen, rect, wInW: window.innerWidth, wInH: window.innerHeight }));
          // const { y, height, top, bottom, left, ...toShowRect } = JSON.parse(JSON.stringify(rect));
          // const toLog = { isOffscreen, position, rect: { ...toShowRect, rectX, rectRight, rectRightAdj }, wInW: window.innerWidth, wInH: window.innerHeight };
          // console.log("toLog", toLog);
          // // alert(JSON.stringify(toLog));
          //
          // // setTimeout(() => {
          // const tl = document.createElement("span");
          // tl.className = "indicatorTopLeft";
          // document.body.appendChild(tl);
          // const popoutElem = document.querySelector("#" + popoutElemId) as HTMLDivElement;
          // const position1 = {
          //   top: popoutElem.offsetTop,
          //   left: popoutElem.offsetLeft,
          // };
          // // const rect1 = popoutElem.getBoundingClientRect();
          // // const left = rect1.x - Math.abs(position1.left);
          // // const top = rect1.y - position1.top;
          // // console.log("toLog2", { rect1: JSON.parse(JSON.stringify(rect1)), position1, left, top });
          // const left1 = rect.x - Math.abs(position1.left);
          // const top1 = rect.y - position1.top;
          // console.log("toLog2", { rect: JSON.parse(JSON.stringify(rect)), position1, left: left1, top: top1 });
          // // tl.style.left = left1 + "px";
          // // tl.style.top = top1 + "px";

          const rightMargin = 50;
          const trgElemRect = triggeringElement.getBoundingClientRect();
          const FifteenRem = 15 * 16;
          // tl.style.left = (trgElemRect.x - Math.abs(position1.left)) + "px";
          // tl.style.top = trgElemRect.y + "px";

          // const rightSide = trgElemRect.x - Math.abs(position1.left) + rect.width;
          const rightSide = trgElemRect.x - FifteenRem + rect.width;
          const isOffscreen1 = rightSide > window.innerWidth;
          // alert(isOffscreen1 + " - " + rightSide + " - " + (trgElemRect.x - FifteenRem - rightSide - window.innerWidth));
          if (isOffscreen1) {
            const diff = rightSide - window.innerWidth;
            // alert(isOffscreen1 + " - " + rightSide + " - " + trgElemRect.x + " - " + diff);
            setTimeout(() => {
              // const tl = document.createElement("span");
              // tl.className = "indicatorTopLeft";
              // document.body.appendChild(tl);
              // tl.style.left = trgElemRect.x - FifteenRem + "px";
              // tl.style.top = trgElemRect.y + "px";

              const popoutElem = document.querySelector("#" + popoutElemId) as HTMLDivElement;
              const newX = -1 * (trgElemRect.x - FifteenRem - diff + rightMargin);
              // alert(trgElemRect.x - FifteenRem - diff + " - " + newX + " - " + popoutElem.style.left + " - " + popoutElem.id);
              // alert(newX + "px !important");
              // alert(popoutElem.style.cssText);
              // popoutElem.style.left = newX + "px !important";
              popoutElem.style.cssText = popoutElem.style.cssText + "left:" + newX + "px !important;";
              // popoutElem.setAttribute("style", popoutElem.style.cssText + "left:" + newX + "px !important;");
            }, 200);
            return "top";
          }

          // }, 2000);
        }
        return "auto";
      },
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
