/** @format */

// Import our custom CSS
import "../scss/style.scss";

import "@popperjs/core";
import "bootstrap";
import emailJs from "@emailjs/browser";

import { onPageReady } from "./utils/helpers";
import manageFormSubmission from "./utils/forms";
import manageReviewPopovers from "./utils/reviews";
import manageQuotesCalculation from "./utils/calculation";

// IIFE
(function () {
  onPageReady(() => {
    const spinnerElement = document.querySelector<HTMLDivElement>("#loadingSpinner");
    if (spinnerElement != null) spinnerElement.remove();

    emailJs.init({
      publicKey: "iOXXeJ531GOeQqGwS",
      blockHeadless: true, // Do not allow headless browsers
    });

    const currentPagePath = window.location.pathname.slice(1);

    // calculate page hide-show logic
    if (currentPagePath === "calculate.html") {
      const urlParams = new URLSearchParams(window.location.search);
      let quoteType = urlParams.get("type");
      if (quoteType == null) {
        quoteType = "all";
      }

      const quotesCalcContainer = document.querySelector<HTMLDivElement>("#quotes-calc-container");
      if (quotesCalcContainer != null) {
        if (quoteType === "all" || quoteType === "full-house-job") {
          const quantityCards = quotesCalcContainer.querySelectorAll<HTMLDivElement>(".quote-page-card.card");
          quantityCards.forEach((cardElem) => {
            if (!cardElem.classList.contains("job-types-container")) cardElem.classList.add("disabled-div");
          });

          if (quotesCalcContainer.nextElementSibling != null) {
            const lastTwoCards = quotesCalcContainer.nextElementSibling.querySelectorAll<HTMLDivElement>(".quote-page-card.card");
            lastTwoCards.forEach((cardElem) => {
              cardElem.classList.add("disabled-div");
            });
          }
        } else {
          quotesCalcContainer.classList.add("not-all-types");
          quotesCalcContainer.classList.add(quoteType);
        }
      }
    }

    manageReviewPopovers();
    manageQuotesCalculation();
    manageFormSubmission();
  });
})();
