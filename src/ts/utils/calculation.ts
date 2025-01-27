/** @format */

import { BehaviorSubject, Observable } from "rxjs";

// const totalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
// const totalObservable: Observable<any> = totalSubject.asObservable();
const runningTotalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
const runningTotalObservable: Observable<any> = runningTotalSubject.asObservable();
// const classForHidingCalculationSections = "d-none";
const classForHidingCalculationSections = "d-none-not-imp";
const classForDisablingCalculationSections = "disabled-div";

const calcAllPageCheckedBoxesCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
const calcAllPageCheckedBoxesCountObservable: Observable<any> = calcAllPageCheckedBoxesCountSubject.asObservable();

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

export default function manageQuotesCalculation(currentPagePath: string) {
  // totalObservable.subscribe((value: number) => {
  //   // console.log("updated total", value);
  //   const totalElem = document.querySelector<HTMLElement>("#calc-price");
  //   if (totalElem != null) {
  //     totalElem.innerText = String(value);
  //   }
  // });

  runningTotalObservable.subscribe((value: number) => {
    // console.log("updated total", value);
    // alert(value);
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
              const outerContainerElem = parentContainerElem.parentElement;
              if (outerContainerElem != null) {
                // const headingElem = outerContainerElem.querySelector("h5:first-child");
                const headingElems = getElementsByText(chkElem.value, "h5");
                if (headingElems.length === 1) {
                  const headingElem = headingElems[0] as HTMLHeadingElement;
                  const cardElem = headingElem.closest<HTMLDivElement>(".quote-page-card");
                  if (cardElem != null) {
                    if (chkElem.checked && cardElem.classList.contains(classForHidingCalculationSections)) cardElem.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
                    if (!chkElem.checked && !cardElem.classList.contains(classForHidingCalculationSections)) cardElem.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);

                    // const checkboxCheckedElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.job-type-ckbx:checked");
                    //
                    // const timeDurationContainer = document.querySelector<HTMLDivElement>("#timeDurationSelectionContainer");
                    // if (timeDurationContainer != null) {
                    //   if (checkboxCheckedElems.length === 1 && timeDurationContainer.classList.contains(classForHidingCalculationSections))
                    //     timeDurationContainer.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
                    //   if (checkboxCheckedElems.length === 0 && !timeDurationContainer.classList.contains(classForHidingCalculationSections))
                    //     timeDurationContainer.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);
                    // }
                    //
                    // const formContainer = document.querySelector<HTMLDivElement>("#formContainer");
                    // if (formContainer != null) {
                    //   if (checkboxCheckedElems.length === 1 && formContainer.classList.contains(classForHidingCalculationSections))
                    //     formContainer.classList.remove(classForHidingCalculationSections, classForDisablingCalculationSections);
                    //   if (checkboxCheckedElems.length === 0 && !formContainer.classList.contains(classForHidingCalculationSections))
                    //     formContainer.classList.add(classForHidingCalculationSections, classForDisablingCalculationSections);
                    // }
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

  const quantityCheckboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.ckbx-with-quantity");
  if (quantityCheckboxElems.length > 0) {
    quantityCheckboxElems.forEach((quantityCheckboxElem) => {
      quantityCheckboxElem.addEventListener("change", (evt: Event) => {
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

        const oldCount = calcAllPageCheckedBoxesCountSubject.getValue();
        calcAllPageCheckedBoxesCountSubject.next(chkElem.checked ? oldCount + 1 : oldCount - 1);
      });

      const regExMatch = re.exec(quantityCheckboxElem.id);
      if (regExMatch != null) {
        const quantityElemId = `${quantityCheckboxElem.id.replace(/\d+$/, "")}Q${regExMatch[0]}`;
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
}
