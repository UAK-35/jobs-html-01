/** @format */

import { Popover } from "bootstrap";

export default function manageReviewPopovers() {
  const popoverTriggerList = document.querySelectorAll<HTMLButtonElement>('[data-bs-toggle="popover"]');
  [...popoverTriggerList].map((popoverTriggerEl) => {
    const popoverHtmlElem = popoverTriggerEl as HTMLElement;
    if (popoverHtmlElem.dataset["hasHtmlContent"] === "true" && popoverHtmlElem.dataset["htmlContentContainerId"] != null) {
      const popoverShowInsideContainerElem = document.querySelector<HTMLElement>(`#${popoverHtmlElem.dataset["showInsideContainerId"]}`);
      const popoverHtmlContainerElem = document.querySelector<HTMLElement>(`#${popoverHtmlElem.dataset["htmlContentContainerId"]}`);
      if (popoverHtmlContainerElem != null && popoverShowInsideContainerElem != null) {
        const temp = document.createElement("div");
        temp.innerHTML = popoverHtmlContainerElem.innerHTML;
        return new Popover(popoverTriggerEl, {
          html: true,
          container: document.querySelector<HTMLElement>(`#${popoverShowInsideContainerElem.id}`) as HTMLElement,
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
                  const popoutElem = document.querySelector<HTMLDivElement>("#" + popoutElemId);
                  if (popoutElem != null) {
                    const newX = -1 * (trgElemRect.x - FifteenRem - diff + rightMargin);
                    // popoutElem.style.left = newX + "px !important"; // not working
                    popoutElem.style.cssText = popoutElem.style.cssText + "left:" + newX + "px !important;";
                    // popoutElem.setAttribute("style", popoutElem.style.cssText + "left:" + newX + "px !important;"); // also works
                  }
                }, 200);
                return "top";
              }
            }
            return "auto";
          },
        });
      }
    }
    return new Popover(popoverTriggerEl);
  });
}
