/** @format */

import { BehaviorSubject, Observable } from "rxjs";
import IndexDbManager from "../lib/indexDbManager";
import { SelectionInfo } from "../lib/types";
import { Toast } from "bootstrap";

const runningTotalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
const runningTotalObservable: Observable<any> = runningTotalSubject.asObservable();

const calcAllPageCheckedBoxesCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
const calcAllPageCheckedBoxesCountObservable: Observable<any> = calcAllPageCheckedBoxesCountSubject.asObservable();

const classForHidingCalculationSections = "d-none-not-imp";
const classForDisablingCalculationSections = "disabled-div";

let indexedDb: IndexDbManager | null = null;
let currentNumberInputVal = "";
const maxNumberVal = 9999;

function getElementsByText(str: string, tag = "a", parentElement?: HTMLElement) {
  if (parentElement == null) parentElement = document.body;
  return Array.prototype.slice.call(parentElement.getElementsByTagName(tag)).filter((el) => el.textContent.trim() === str.trim());
}

function updateTotalPriceOnCheckChange(itemInfo: SelectionInfo, priceToAdd: number, addPrice = false) {
  const totalPrice = runningTotalSubject.getValue();
  runningTotalSubject.next(addPrice ? totalPrice + priceToAdd : totalPrice - priceToAdd);
  if (addPrice) indexedDb!.insertValue("selections", { ...itemInfo, price: priceToAdd });
  else indexedDb!.searchAndDelete("selections", "service", itemInfo.service);
}

function updateTotalPriceOnQuantityChange(itemInfo: SelectionInfo, lastQuantity: number) {
  const totalPrice = runningTotalSubject.getValue();
  const quantity = itemInfo.quantity;
  const itemPrice = itemInfo.pricePerItem;
  const diff = lastQuantity < quantity ? quantity - lastQuantity : lastQuantity - quantity;

  let price: number;
  if (lastQuantity < quantity) {
    price = totalPrice + itemPrice * diff; // diff is positive
  } else {
    // diff below is negative or zero
    if (diff === 0 && quantity === 1) {
      price = totalPrice + itemPrice;
    } else {
      price = totalPrice - itemPrice * diff;
    }
  }
  runningTotalSubject.next(price);
  const updatedData = { ...itemInfo, price: quantity * itemPrice };
  indexedDb!.searchAndPatch("selections", updatedData, "service");
}

const hideToast = () => {
  const userToastElem = Toast.getOrCreateInstance("#userToast", { autohide: false });
  userToastElem.hide();
};

const handleQuantityChanged = (eventTarget: EventTarget, unitsStr: string | null) => {
  const quantityElem = eventTarget as HTMLInputElement;
  if (quantityElem.value.length > 0) {
    const lastQuantity = Number(quantityElem.dataset.lastValue);
    quantityElem.dataset.lastValue = quantityElem.value;
    const quantity = quantityElem.valueAsNumber;

    // find quantity input's related checkbox
    const parentDivElem = quantityElem.closest<HTMLLIElement>("li.list-group-item");
    if (parentDivElem != null) {
      const chkElem = parentDivElem.querySelector<HTMLInputElement>("input.form-check-input.ckbx-with-quantity");
      if (chkElem != null) {
        const serviceGroupName = chkElem.dataset.serviceGroupName;
        const itemPrice = Number(chkElem.dataset["priceInPounds"]);
        const chkLabel = chkElem.nextElementSibling; // find/get service name from checkbox's label
        if (chkLabel != null && serviceGroupName != null) {
          const titleSpan = chkLabel.children[0] as HTMLSpanElement;
          const quantityText = unitsStr === "sqm" ? `${quantity} ${unitsStr}` : String(quantity);
          updateTotalPriceOnQuantityChange({ serviceGroup: serviceGroupName, service: titleSpan.innerText, quantity, quantityText, pricePerItem: itemPrice }, lastQuantity);
        }
      }
    }
  }
};

const handleCheckboxCheckChange = (eventTarget: EventTarget | null, re: RegExp) => {
  const chkElem = eventTarget as HTMLInputElement;
  const itemPrice = Number(chkElem.dataset["priceInPounds"]);

  // find/get job type (service group) name from checkbox's parent card heading
  let serviceGroupName: string | null = null;
  const parentCardContainerElem = chkElem.closest<HTMLDivElement>(".quote-page-card.card");
  if (parentCardContainerElem != null) {
    const cardHeaderDiv = parentCardContainerElem.querySelector(".card-header");
    if (cardHeaderDiv != null) {
      const headingElem = cardHeaderDiv.children[0] as HTMLHeadingElement;
      if (headingElem != null) {
        serviceGroupName = headingElem.innerText;
        chkElem.dataset.serviceGroupName = serviceGroupName; // also add attribute to checkbox for later easy retrieval
      }
    }
  }

  // find/get service name from checkbox's label
  const chkLabel = chkElem.nextElementSibling;
  if (chkLabel != null && serviceGroupName != null) {
    const titleSpan = chkLabel.children[0] as HTMLSpanElement;

    // find/get related quantity element
    // const re = /(?<trailingNumber>\d+)$/;
    const regExMatch = re.exec(chkElem.id);
    if (regExMatch != null) {
      const quantityElem = document.querySelector<HTMLInputElement>(`#${chkElem.id.replace(/\d+$/, "")}Q${regExMatch[0]}`);
      if (quantityElem != null) {
        quantityElem.disabled = !chkElem.checked;

        // find/get unit from label on right side of quantity element
        let unitsStr: string | null = null;
        if (quantityElem.nextElementSibling != null) {
          unitsStr = (quantityElem.nextElementSibling as HTMLLabelElement).textContent;
        }
        const quantity = quantityElem.valueAsNumber;
        const quantityText = unitsStr === "sqm" ? `${quantity} ${unitsStr}` : String(quantity);
        updateTotalPriceOnCheckChange({ serviceGroup: serviceGroupName, service: titleSpan.innerText, quantity, quantityText, pricePerItem: itemPrice }, itemPrice * quantity, chkElem.checked);
      }
    }
  }

  const oldCount = calcAllPageCheckedBoxesCountSubject.getValue();
  calcAllPageCheckedBoxesCountSubject.next(chkElem.checked ? oldCount + 1 : oldCount - 1);
};

export default async function manageQuotesCalculation(currentPagePath: string) {
  indexedDb = new IndexDbManager("quotation_selections", 1);
  await indexedDb.createObjectStore(["selections"]);
  await indexedDb.clearObjectStore("selections"); // clear all previous selections on page refresh/reload

  runningTotalObservable.subscribe((value: number) => {
    const totalElem = document.querySelector<HTMLElement>("#calc-price");
    if (totalElem != null) {
      const valueString = String(value);
      totalElem.innerText = valueString;
      localStorage.setItem("totalAmount", valueString);
    }
  });

  calcAllPageCheckedBoxesCountObservable.subscribe((value: number) => {
    const timeDurationContainer = document.querySelector<HTMLDivElement>("#timeDurationSelectionContainer");
    if (timeDurationContainer != null) {
      if (value === 1 && timeDurationContainer.classList.contains(classForHidingCalculationSections))
        timeDurationContainer.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
      if (value === 0 && !timeDurationContainer.classList.contains(classForHidingCalculationSections))
        timeDurationContainer.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);
    }

    const formContainer = document.querySelector<HTMLDivElement>("#formContainer");
    if (formContainer != null) {
      if (value === 1 && formContainer.classList.contains(classForHidingCalculationSections)) formContainer.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
      if (value === 0 && !formContainer.classList.contains(classForHidingCalculationSections)) formContainer.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);
    }
  });

  if (currentPagePath === "calculate-all.html") {
    const jobTypeChkboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.job-type-ckbx");
    if (jobTypeChkboxElems.length > 0) {
      jobTypeChkboxElems.forEach((jobTypeChkboxElem) => {
        jobTypeChkboxElem.addEventListener("change", (evt: Event) => {
          const chkElem = evt.target as HTMLInputElement;
          if (chkElem.id.startsWith("jobType")) {
            // additional may be unnecessary check
            const parentContainerElem = chkElem.closest<HTMLDivElement>(".job-types-container");
            if (parentContainerElem != null) {
              if (parentContainerElem.parentElement != null) {
                const outerContainerElem = parentContainerElem.parentElement.parentElement;
                if (outerContainerElem != null) {
                  // const headingElem = outerContainerElem.querySelector("h5:first-child");
                  const headingElems = getElementsByText(chkElem.value, "h5", outerContainerElem);
                  if (headingElems.length === 1) {
                    const headingElem = headingElems[0] as HTMLHeadingElement;
                    const cardElem = headingElem.closest<HTMLDivElement>(".quote-page-card");
                    if (cardElem != null) {
                      if (chkElem.checked && cardElem.classList.contains(classForHidingCalculationSections)) cardElem.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
                      if (!chkElem.checked && !cardElem.classList.contains(classForHidingCalculationSections)) cardElem.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);
                    }
                  }
                  if (headingElems.length === 2) {
                    // solution to problem of bootstrap responsive hide/show elements - dual elements inside different parents to be visible on different screen resolutions
                    headingElems.forEach((hElem) => {
                      const headingElem = hElem as HTMLHeadingElement;
                      const cardElem = headingElem.closest<HTMLDivElement>(".quote-page-card");
                      if (cardElem != null) {
                        if (chkElem.checked && cardElem.classList.contains(classForHidingCalculationSections)) cardElem.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
                        if (!chkElem.checked && !cardElem.classList.contains(classForHidingCalculationSections)) cardElem.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);
                      }
                    });
                  }
                }
              }
            }
          }
        });
      });
    }
  }

  const re = /(\d+)$/; // regex to get/extract number from checkbox id attribute value

  // get all number inputs
  const numberInputElems = document.querySelectorAll<HTMLInputElement>("input[type=number]");
  if (numberInputElems.length > 0) {
    numberInputElems.forEach((numberInputElement) => {
      numberInputElement.valueAsNumber = 0;
      numberInputElement.dataset.lastValue = "0";
      numberInputElement.setAttribute("max", String(maxNumberVal));
      numberInputElement.addEventListener(
        "keydown",
        (evt: KeyboardEvent) => {
          if (evt.key === "-" || evt.key === "ArrowUp" || evt.key === "ArrowDown") {
            // do not allow negative values
            evt.preventDefault();
          }
        },
        { passive: false, capture: true }
      );
    });
  }

  // get all checkboxes which have related quantity input
  const quantityRelatedCheckboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.ckbx-with-quantity");
  if (quantityRelatedCheckboxElems.length > 0) {
    quantityRelatedCheckboxElems.forEach((quantityCheckboxElem) => {
      quantityCheckboxElem.addEventListener("change", (evt: Event) => {
        handleCheckboxCheckChange(evt.target, re);
      }); // END OF -> quantityCheckboxElem.addEventListener("change",

      // finding/getting related quantity element - getting 2nd time - 1st time inside handleCheckboxCheckChange
      const regExMatch = re.exec(quantityCheckboxElem.id);
      if (regExMatch != null) {
        const quantityElemId = `${quantityCheckboxElem.id.replace(/\d+$/, "")}Q${regExMatch[0]}`;
        const quantityElement = document.querySelector<HTMLInputElement>(`#${quantityElemId}`);
        if (quantityElement != null) {
          // find/get unit from label on right side of quantity element
          let unitsStr: string | null = null;
          if (quantityElement.nextElementSibling != null) {
            unitsStr = (quantityElement.nextElementSibling as HTMLLabelElement).textContent;
          }
          quantityElement.addEventListener(
            "input",
            (evt: Event) => {
              const eventTarget = evt.target! as HTMLInputElement;
              if (eventTarget.value.length > 0) {
                if (isNaN(eventTarget.valueAsNumber) || eventTarget.valueAsNumber > maxNumberVal || eventTarget.value == currentNumberInputVal + " ") {
                  eventTarget.value = currentNumberInputVal;
                } else {
                  if (eventTarget.valueAsNumber <= 0) {
                    if (eventTarget.valueAsNumber < 0) {
                      eventTarget.value = "1";
                      currentNumberInputVal = "1";
                    }
                    handleQuantityChanged(eventTarget, unitsStr);
                  } else {
                    currentNumberInputVal = eventTarget.value;
                    handleQuantityChanged(eventTarget, unitsStr);
                  }
                }
                // } else {
                //     eventTarget.value = "1";
                //     currentNumberInputVal = "1";
                //     handleQuantityChanged(eventTarget, unitsStr);
                //     eventTarget.disabled = true;
                //     quantityCheckboxElem.checked = false;
                //     handleCheckboxCheckChange(quantityCheckboxElem, re);
              }
            },
            { passive: false, capture: true }
          );
          // quantityElement.addEventListener("change", (evt: Event) => {
          //   const eventTarget = evt.target! as HTMLInputElement;
          //   handleQuantityChanged(eventTarget, unitsStr);
          // });
          quantityElement.addEventListener("blur", (evt: Event) => {
            const eventTarget = evt.target! as HTMLInputElement;
            if (isNaN(eventTarget.valueAsNumber) || eventTarget.valueAsNumber === 0 || eventTarget.valueAsNumber > maxNumberVal || eventTarget.value == currentNumberInputVal + " ") {
              eventTarget.value = "0";
              currentNumberInputVal = "0";
              handleQuantityChanged(eventTarget, unitsStr);
              eventTarget.disabled = true;
              quantityCheckboxElem.checked = false;
              handleCheckboxCheckChange(quantityCheckboxElem, re);
            }
          });
        }
      }
    });
  }

  // find/get all duration checkboxes
  const durationCheckboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.work-dur-type-ckbx");
  if (durationCheckboxElems.length > 0) {
    durationCheckboxElems.forEach((durationCheckboxElem) => {
      durationCheckboxElem.addEventListener("change", (evt: Event) => {
        const chkElem = evt.target as HTMLInputElement;
        const chkElemIsChecked = chkElem.checked;
        const parentContainerElem = chkElem.closest<HTMLDivElement>(".list-group");

        // uncheck all checkboxes - part of logic to create radio button like functionality - mutually exclusive checkboxes
        const allCheckboxes = parentContainerElem!.querySelectorAll<HTMLInputElement>("input.form-check-input.work-dur-type-ckbx");
        allCheckboxes.forEach((chk) => {
          chk.checked = false;
        });

        // check event's checkbox again
        chkElem.checked = chkElemIsChecked;
        if (chkElemIsChecked) {
          localStorage.setItem("durationCode", chkElem.value); // save selected duration code

          // remove error indication
          const timeDurationContainer = document.querySelector<HTMLDivElement>("#timeDurationSelectionContainer");
          if (timeDurationContainer!.classList.contains("blinking-div")) timeDurationContainer!.classList.remove("blinking-div");

          // remove error toast
          hideToast();
        }
      });
    });
  }
  // duration-selection-container
}
