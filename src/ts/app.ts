/** @format */

// Import our custom CSS
import "../scss/style.scss";

import "@popperjs/core";
import "bootstrap";

import { onPageReady } from "./utils/helpers";
import manageFormSubmission from "./utils/forms";
import manageReviewPopovers from "./utils/reviews";
import manageQuotesCalculation from "./utils/calculation";
import IndexDbManager from "./lib/indexDbManager";
import jobTypes from "../assets/json/jobTypes.json5";

// alert(process.env.NODE_ENV);

// let clearIndexDb = true; // for development/test purposes only
let clearIndexDb = false;
if (clearIndexDb && process.env.NODE_ENV !== "development") {
  clearIndexDb = false;
}

// const checkBrowserSupportsIndexDbApi = () => {
//   // Check for IndexedDB support:
//   if (!("indexedDB" in window)) {
//     // Can't use IndexedDB
//     alert("This browser doesn't support IndexedDB");
//   } else {
//     alert("This browser DOES support IndexedDB");
//   }
// };

// IIFE
(function () {
  onPageReady(async () => {
    // checkBrowserSupportsIndexDbApi();

    if (clearIndexDb) {
      const indexedDb = new IndexDbManager("quotation_selections", 0);
      await indexedDb.createObjectStore(["selections"]);
    }
    // await indexedDb.insertValue("books", { name: "A Game of Thrones" });
    // await indexedDb.patchValue("books", { name: "A Game of Thrones", id: 3 }, "id");
    // await indexedDb.putBulkValue("books", [{ name: "A Song of Fire and Ice" }, { name: "Harry Potter and the Chamber of Secrets" }]);
    // const val1 = await indexedDb.getValue("books", 2); alert(val1 == null);
    // const allData = await indexedDb.getAllValue("books");a lert(JSON.stringify(allData));
    // await indexedDb.deleteValue("books", 1);

    const spinnerElement = document.querySelector<HTMLDivElement>("#loadingSpinner");
    if (spinnerElement != null) spinnerElement.remove();

    let currentPagePath = window.location.pathname.slice(1);
    if (currentPagePath.length === 0) currentPagePath = "index.html";
    document.body.classList.add(currentPagePath.split(".")[0]);
    const urlParams = new URLSearchParams(window.location.search);

    let quoteType = urlParams.get("type");
    if (quoteType == null || quoteType === "full-house-job") {
      quoteType = "all";
    }

    // calculate page hide-show logic
    if (currentPagePath === "calculate.html" || currentPagePath === "calculate-all.html") {
      const quotesCalcContainers = document.querySelectorAll<HTMLDivElement>(".quantities-container");
      if (quotesCalcContainers.length > 0) {
        quotesCalcContainers.forEach((quotesCalcContainer) => {
          if (quoteType === "all") {
            const quantityCards = quotesCalcContainer.querySelectorAll<HTMLDivElement>(".quote-page-card.card");
            quantityCards.forEach((cardElem) => {
              if (!cardElem.classList.contains("job-types-container")) cardElem.classList.add("disabled-div");
            });
          } else {
            quotesCalcContainer.classList.add("not-all-types");
            quotesCalcContainer.classList.add(quoteType);
          }
        });

        if (currentPagePath === "calculate.html") {
          const spanInsideUlElem = document.querySelector<HTMLElement>("#titleDyn");
          if (spanInsideUlElem != null) {
            const jobTypeItem = jobTypes.find((j) => j.calculateButtonUrl.indexOf(quoteType) > -1);
            if (jobTypeItem != null) spanInsideUlElem.innerText = spanInsideUlElem.innerText.replace("###", jobTypeItem.title);
          }

          const quotesCalcContainer = quotesCalcContainers[0];
          if (quotesCalcContainer.nextElementSibling != null) {
            const lastTwoCards = quotesCalcContainer.nextElementSibling.querySelectorAll<HTMLDivElement>(".quote-page-card.card");
            lastTwoCards.forEach((cardElem) => {
              cardElem.classList.add("disabled-div");
            });
          }
        }

        if (currentPagePath === "calculate-all.html" && quotesCalcContainers[0].parentElement != null) {
          const quotesCalcContainerParent = quotesCalcContainers[0].parentElement;
          if (quotesCalcContainerParent.nextElementSibling != null) {
            const lastTwoCards = quotesCalcContainerParent.nextElementSibling.querySelectorAll<HTMLDivElement>(".quote-page-card.card");
            lastTwoCards.forEach((cardElem) => {
              cardElem.classList.add("disabled-div");
            });
          }
        }
      }
    }

    if (currentPagePath === "calculate.html" || currentPagePath === "calculate-all.html") {
      if (!clearIndexDb) manageQuotesCalculation(currentPagePath, quoteType);
      manageFormSubmission();
    } else {
      manageReviewPopovers(); // index page
    }
  });
})();
