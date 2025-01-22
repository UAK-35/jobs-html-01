/** @format */

// Import our custom CSS
import "../scss/style.scss";

import "@popperjs/core";
import "bootstrap";
import { Popover } from "bootstrap";

import { BehaviorSubject, Observable } from "rxjs";

function onReady(callback: () => void) {
  document.addEventListener("DOMContentLoaded", callback);
  // if (document.readyState === "loading") {
  //   document.addEventListener("DOMContentLoaded", callback);
  // } else {
  //   callback();
  // }
}

function getElementsByText(str: string, tag = "a") {
  return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter((el) => el.textContent.trim() === str.trim());
}

function updateTotalPriceOnCheckChange(priceToAdd: number, addPrice = false) {
  const totalPrice = runningTotalSubject.getValue();
  console.log("TEST", { totalPrice, priceToAdd, addPrice });
  runningTotalSubject.next(addPrice ? totalPrice + priceToAdd : totalPrice - priceToAdd);
}

// function updateTotalPriceOnQuantityChange(priceToAdd: number) {
// const totalPrice = runningTotalSubject.getValue();
// console.log("TEST", { totalPrice, priceToAdd });
// runningTotalSubject.next(totalPrice + priceToAdd);
// }

function updateTotalPriceOnQuantityChange(itemPrice: number, lastQuantity: number, quantity: number) {
  const totalPrice = runningTotalSubject.getValue();
  // runningTotalSubject.next(itemPrice * quantity);
  if (lastQuantity < quantity) {
    const diff = quantity - lastQuantity;
    runningTotalSubject.next(totalPrice + itemPrice * diff);
  } else {
    const diff = lastQuantity - quantity;
    runningTotalSubject.next(totalPrice - itemPrice * diff);
  }
}

const totalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
const totalObservable: Observable<any> = totalSubject.asObservable();
const runningTotalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
const runningTotalObservable: Observable<any> = runningTotalSubject.asObservable();

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

const calculateForm = document.querySelector<HTMLFormElement>("#calculateForm");
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
    const spinnerElement = document.querySelector<HTMLDivElement>("#loadingSpinner");
    if (spinnerElement != null) spinnerElement.remove();

    totalObservable.subscribe((value: number) => {
      // console.log("updated total", value);
      const totalElem = document.querySelector<HTMLElement>("#calc-price");
      if (totalElem != null) {
        totalElem.innerText = String(value);
      }
    });

    runningTotalObservable.subscribe((value: number) => {
      // console.log("updated total", value);
      // alert(value);
      const totalElem = document.querySelector<HTMLElement>("#calc-price");
      if (totalElem != null) {
        totalElem.innerText = String(value);
      }
    });

    const jobTypeChkboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.job-type-ckbx");
    if (jobTypeChkboxElems.length > 0) {
      jobTypeChkboxElems.forEach((jobTypeChkboxElem) => {
        jobTypeChkboxElem.addEventListener("change", (evt: Event) => {
          const chkElem = evt.target as HTMLInputElement;
          if (chkElem.id.startsWith("jobType")) {
            // additional may be unnecessary check
            const parentContainerElem = chkElem.closest<HTMLDivElement>(".job-types-container");
            if (parentContainerElem != null) {
              const outerContainerElem = parentContainerElem.parentElement;
              if (outerContainerElem != null) {
                // const headingElem = outerContainerElem.querySelector("h5:first-child");
                const headingElems = getElementsByText(chkElem.value, "h5");
                if (headingElems.length === 1) {
                  const headingElem = headingElems[0] as HTMLHeadingElement;
                  const cardElem = headingElem.closest<HTMLDivElement>(".quote-page-card");
                  if (cardElem != null) {
                    if (chkElem.checked && cardElem.classList.contains("d-none")) cardElem.classList.remove("d-none");
                    if (!chkElem.checked && !cardElem.classList.contains("d-none")) cardElem.classList.add("d-none");

                    const checkboxCheckedElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.job-type-ckbx:checked");

                    const timeDurationContainer = document.querySelector<HTMLDivElement>("#timeDurationSelectionContainer");
                    if (timeDurationContainer != null) {
                      if (checkboxCheckedElems.length === 1 && timeDurationContainer.classList.contains("d-none")) timeDurationContainer.classList.remove("d-none");
                      if (checkboxCheckedElems.length === 0 && !timeDurationContainer.classList.contains("d-none")) timeDurationContainer.classList.add("d-none");
                    }

                    const formContainer = document.querySelector<HTMLDivElement>("#formContainer");
                    if (formContainer != null) {
                      if (checkboxCheckedElems.length === 1 && formContainer.classList.contains("d-none")) formContainer.classList.remove("d-none");
                      if (checkboxCheckedElems.length === 0 && !formContainer.classList.contains("d-none")) formContainer.classList.add("d-none");
                    }
                  }
                }
              }
            }
          }
        });
      });
    }

    const re = /(\d+)$/; // regex to get/extract number from checkbox id attribute value

    const bathroomTypeChkboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.ckbx-with-quantity");
    if (bathroomTypeChkboxElems.length > 0) {
      bathroomTypeChkboxElems.forEach((bathroomTypeChkboxElem) => {
        bathroomTypeChkboxElem.addEventListener("change", (evt: Event) => {
          const chkElem = evt.target as HTMLInputElement;
          const itemPrice = Number(chkElem.dataset["priceInPounds"]);

          // const re = /(?<trailingNumber>\d+)$/;
          const regExMatch = re.exec(chkElem.id);
          if (regExMatch != null) {
            const quantityElem = document.querySelector<HTMLInputElement>(`#${chkElem.id.replace(/\d+$/, "")}Q${regExMatch[0]}`);
            if (quantityElem != null) {
              const quantity = quantityElem.valueAsNumber;
              updateTotalPriceOnCheckChange(itemPrice * quantity, chkElem.checked);
            }
          }
        });

        const regExMatch = re.exec(bathroomTypeChkboxElem.id);
        if (regExMatch != null) {
          const quantityElemId = `${bathroomTypeChkboxElem.id.replace(/\d+$/, "")}Q${regExMatch[0]}`;
          // alert(quantityElemId);
          const quantityElement = document.querySelector<HTMLInputElement>(`#${quantityElemId}`);
          if (quantityElement != null) {
            quantityElement.addEventListener("change", (evt: Event) => {
              const quantityElem = evt.target as HTMLInputElement;
              const lastQuantity = Number(quantityElem.dataset.lastValue);
              quantityElem.dataset.lastValue = quantityElem.value;
              const quantity = quantityElem.valueAsNumber;

              const parentDivElem = quantityElem.closest<HTMLDivElement>("div.form-check.form-check-inline");
              if (parentDivElem != null) {
                const chkElem = parentDivElem.querySelector<HTMLInputElement>("input.form-check-input.ckbx-with-quantity");
                if (chkElem != null) {
                  const itemPrice = Number(chkElem.dataset["priceInPounds"]);
                  updateTotalPriceOnQuantityChange(itemPrice, lastQuantity, quantity);
                }
              }
            });
          }
        }
      });
    }
  });
})();
