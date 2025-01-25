/** @format */

// Import our custom CSS
import "../scss/style.scss";

import "@popperjs/core";
import "bootstrap";
// import { Popover } from "bootstrap";
// import { BehaviorSubject, Observable } from "rxjs";
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

    manageReviewPopovers();
    manageFormSubmission();
    manageQuotesCalculation();
  });
})();
