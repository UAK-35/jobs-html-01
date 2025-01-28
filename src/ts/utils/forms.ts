/** @format */

import emailJs, { EmailJSResponseStatus } from "@emailjs/browser";
import { Modal, Toast } from "bootstrap";

import IndexDbManager from "../lib/indexDbManager";
import { ISelectionRecord } from "../lib/types";
// @ts-ignore
import workDurationTypes from "../../assets/json/workDurationTypes.json5";

const errorFieldParentClassName = "has-input-error";
const formFieldInvalidClassName = "is-invalid";
const formFieldValidClassName = "is-valid";

function validateRequired(controlValue: string) {
  return (controlValue || "").trim().length > 0;
}

function validateName(nameValue: string) {
  // You may also wish to add the apostrophe and hyphen between the brackets, since Irish and Italian names include the former (O'Donnell, D'Ambrosio)
  // and some folks have hyphenated last names (Claude Levi-Strauss, Ima Page-Turner, etc.).
  const validRegex = /^[a-zA-Z'\- ]+$/; // help link: https://stackoverflow.com/a/2283148
  return !!nameValue.match(validRegex);
}

function validateEmail(emailValue: string) {
  const validRegex =
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
  return !!emailValue.match(validRegex);
}

function validateUkPhone(phoneValue: string) {
  // help link: https://medium.com/@davidlindercodes/the-ultimate-regex-for-verifying-uk-phone-numbers-fd99db881753
  const validRegex =
    // @ts-ignore
    /^((((\+44\s?([0–6]|[8–9])\d{3}|\(?0([0–6]|[8–9])\d{3}\)?)\s?\d{3}\s?(\d{2}|\d{3}))|((\+44\s?([0–6]|[8–9])\d{3}|\(?0([0–6]|[8–9])\d{3}\)?)\s?\d{3}\s?(\d{4}|\d{3}))|((\+44\s?([0–6]|[8–9])\d{1}|\(?0([0–6]|[8–9])\d{1}\)?)\s?\d{4}\s?(\d{4}|\d{3}))|((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4})))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/;
  return !!phoneValue.match(validRegex);
}

function validateUkAddress(emailValue: string) {
  const validRegex = /[a-zA-Z0-9,# \-\/!@$%^\*(){}|[\]\\]*/gi;
  return !!emailValue.match(validRegex);
}

const handleEmailSuccess = () => {
  const calculateForm = document.querySelector<HTMLFormElement>("#calculateForm");
  if (calculateForm != null) {
    const submitButton = calculateForm.querySelector<HTMLButtonElement>("button[type=submit]");
    if (submitButton != null) submitButton.innerText = "Email sent successfully";
  }
  const emailModal = Modal.getOrCreateInstance("#emailSuccessModal", {
    // backdrop: false,
    focus: true,
    keyboard: false,
  });
  if (emailModal != null) {
    document.querySelector("#emailSuccessModal")!.addEventListener("hide.bs.modal", (_event) => {
      // document.querySelector("#full-screen-overlay")!.classList.remove("active");
      setTimeout(() => {
        document.location.href = "index.html";
      }, 2000);
    });
  }
  emailModal.show();
};

function doSendEmail(fromName: string, fromEmail: string, fromPhone: string, fromAddress: string, totalAmount: string, duration: string, emailBody: string) {
  // console.log("doSendEmail", { fromName, fromEmail, fromPhone, fromAddress, totalAmount, duration, emailBody });
  const serviceId = process.env.EMAIL_JS_SERVICE_ID;
  const templateId = process.env.EMAIL_JS_TEMPLATE_ID; // to_email is permanently set in template which can be modified
  const toEmail = process.env.TO_EMAIL;

  if (serviceId != null && templateId != null && toEmail != null) {
    const templateParams = {
      from_name: fromName,
      from_email: fromEmail,
      from_phone: fromPhone,
      from_address: fromAddress,
      to_name: "MyJobDone Admin",
      to_email: toEmail,
      reply_to: fromEmail,
      current_date: new Date().toDateString(),
      total_amount: `&pound;${totalAmount}`,
      start_duration: duration,
      message: emailBody,
    };
    // console.log("email data", templateParams);

    emailJs.send(serviceId, templateId, templateParams).then(
      function (response) {
        console.log("EMAIL-SUCCESS!", response.status, response.text);
        handleEmailSuccess();
      },
      function (err) {
        console.log("EMAIL-FAILED error-text...", (err as EmailJSResponseStatus).text);
        console.log("EMAIL-FAILED...", err);
        alert("Mail send failed");
      }
    );
  }

  // setTimeout(() => handleEmailSuccess(), 4000); // for testing purposes only
}

const changeErrorText = (element: HTMLFormElement, reqMsg: string) => {
  if (element.nextElementSibling != null) {
    if (element.nextElementSibling.nextElementSibling != null) {
      const errorElement = element.nextElementSibling.nextElementSibling as HTMLDivElement;
      errorElement.innerText = reqMsg;
    }
  }
};

const validateField = (element: HTMLFormElement, reqMsg: string, formatValidator: (fieldValue: string) => boolean, formatMsg: string) => {
  let fieldErrorOccurred = !validateRequired(element.value);
  if (fieldErrorOccurred) {
    changeErrorText(element, reqMsg);
  } else {
    fieldErrorOccurred = !formatValidator(element.value);
    if (fieldErrorOccurred) {
      changeErrorText(element, formatMsg);
    }
  }

  const parentElem = element.parentElement as HTMLDivElement;
  if (fieldErrorOccurred) {
    element.classList.remove(formFieldValidClassName);
    element.classList.add(formFieldInvalidClassName);
    if (!parentElem.classList.contains(errorFieldParentClassName)) parentElem.classList.add(errorFieldParentClassName);
    setTimeout(() => {
      element.focus();
    }, 1000);
  } else {
    element.classList.remove(formFieldInvalidClassName);
    element.classList.add(formFieldValidClassName);
    if (parentElem.classList.contains(errorFieldParentClassName)) parentElem.classList.remove(errorFieldParentClassName);
  }
  return fieldErrorOccurred;
};

const setHeadingElementText = (elemSelector: string, textToSet: string) => {
  const headingElement = document.querySelector<HTMLHeadingElement>(elemSelector);
  if (headingElement != null) {
    const valueElem = headingElement.children[1];
    valueElem.textContent = textToSet;
  }
};

const addServicesTableRow = (tbody: HTMLTableSectionElement, serviceVal: string, qtyText: string, priceVal: number, totalVal: number) => {
  const row = tbody.insertRow();

  const serviceCell = row.insertCell();
  serviceCell.textContent = serviceVal;

  const quantityCell = row.insertCell();
  quantityCell.textContent = qtyText;

  const priceCell = row.insertCell();
  priceCell.textContent = `\u00A3${priceVal}`;

  const totalCell = row.insertCell();
  totalCell.textContent = `\u00A3${totalVal}`;
};

function getDurationText(durationCode: string): string {
  const dataList = workDurationTypes as Array<any>;
  for (const dataItem of dataList) {
    if (dataItem.code === durationCode) {
      return dataItem.descriptiveText;
    }
  }
  return "";
}

const hideToast = () => {
  const userToastElem = Toast.getOrCreateInstance("#userToast", { autohide: false });
  userToastElem.hide();
};

const showToast = (toastClasses: string, html: string) => {
  const userToastElem = Toast.getOrCreateInstance("#userToast", { autohide: false });
  document.querySelector("#userToast")!.querySelector(".toast-body")!.innerHTML = html;
  document.querySelector("#userToast")!.classList.add(...toastClasses.split(" "));
  (document.querySelector("#userToast")! as HTMLElement).style.cssText = "--bs-bg-opacity: .5;";
  userToastElem.show();
};

const showErrorToast = (message: string) => {
  const errorToastClasses = "text-bg-danger border-2 border-danger";
  showToast(errorToastClasses, message);
};

export default async function manageFormSubmission() {
  // clear style attribute value of all hidden elements - hidden elements are those which are initially hidden like overlays, modals, toasts, etc.
  const hiddenElements = document.querySelectorAll<HTMLDivElement>(".hidden-elem");
  hiddenElements.forEach((hiddenElem) => {
    hiddenElem.style.cssText = "";
  });

  if (process.env.EMAIL_JS_PUBLIC_KEY != null) {
    emailJs.init({
      publicKey: process.env.EMAIL_JS_PUBLIC_KEY,
      blockHeadless: true, // Do not allow headless browsers
    });
  }

  // create reference for Index DB API access object
  const indexedDb = new IndexDbManager("quotation_selections", 1);
  await indexedDb.createObjectStore(["selections"]);
  const dataToSend: FormDataRecord = {};

  // create reference for quotation summary modal dialog
  const summaryModal = Modal.getOrCreateInstance("#quotationSummaryModal", {
    focus: true,
    keyboard: false,
  });

  const calculateForm = document.querySelector<HTMLFormElement>("#calculateForm");
  if (calculateForm != null) {
    // add event listener to quotation summary modal dialog close event
    document.querySelector("#quotationSummaryModal")!.addEventListener("hide.bs.modal", () => {
      // change form submit button text
      const submitButton = calculateForm.querySelector<HTMLButtonElement>("button[type=submit]");
      if (submitButton != null) submitButton.innerText = "Submit again";
    });

    const submitButton = calculateForm.querySelector<HTMLButtonElement>("button[type=submit]");
    const sendEmailButton = document.querySelector<HTMLButtonElement>("#sendEmailBtn");
    if (sendEmailButton != null) {
      sendEmailButton.addEventListener("click", async (e: any) => {
        e.preventDefault();

        const calculateForm = document.querySelector<HTMLFormElement>("#calculateForm");
        if (calculateForm != null) {
          // change form submit button text
          const submitButton = calculateForm.querySelector<HTMLButtonElement>("button[type=submit]");
          if (submitButton != null) submitButton.innerText = "Sending email! Wait...";
        }

        summaryModal.hide();
        document.querySelector("#full-screen-overlay")!.classList.add("active");

        // prepare data for email
        const fromName = dataToSend["name"] as string;
        const fromEmail = dataToSend["email"] as string;
        const phone = dataToSend["phone"] as string;
        const address = dataToSend["address"] as string;
        const totalAmount = dataToSend["totalAmount"] as string;
        const duration = dataToSend["duration"] as string;

        let emailBody = "";
        const allUserSelections: ISelectionRecord[] = await indexedDb.getAllValues("selections");
        allUserSelections.forEach((record) => {
          emailBody += "<tr>";
          emailBody += `<td style="text-align: center; border: 1px solid gainsboro;">${record.service}</td>`;
          emailBody += `<td style="text-align: center; border: 1px solid gainsboro;">${record.quantityText}</td>`;
          emailBody += `<td style="text-align: center; border: 1px solid gainsboro;">&pound;${record.pricePerItem}</td>`;
          emailBody += `<td style="text-align: center; border: 1px solid gainsboro;">&pound;${record.price}</td>`;
          emailBody += "</tr>";
        });
        doSendEmail(fromName, fromEmail, phone, address, totalAmount, duration, emailBody);
      });
    }

    if (calculateForm.dataset["hasSubmitHandler"] == null) {
      calculateForm.dataset["hasSubmitHandler"] = "true";
      calculateForm.addEventListener("submit", async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (submitButton != null) submitButton.innerText = "Submitting form...";
        const formElem = e.target as HTMLFormElement;

        // validate all form fields
        let inputErrorOccurred = false;
        const formElements = formElem.elements;
        for (const formElement of formElements) {
          const element = formElement as HTMLFormElement;
          if (element.tagName != null && !(element.tagName === "BUTTON")) {
            const key = element.id != null ? element.id : element.name;

            if (key === "name") {
              inputErrorOccurred = validateField(element, "Name is required", validateName, "Invalid format of name");
            }
            if (!inputErrorOccurred && key === "email") {
              inputErrorOccurred = validateField(element, "Email is required", validateEmail, "Invalid format of email");
            }
            if (!inputErrorOccurred && key === "phone") {
              inputErrorOccurred = validateField(element, "Phone is required", validateUkPhone, "Invalid format of phone");
            }
            if (!inputErrorOccurred && key === "address") {
              inputErrorOccurred = validateField(element, "Address is required", validateUkAddress, "Invalid format of address");
            }

            if (!inputErrorOccurred) dataToSend[key] = element.value;
          }
        }

        if (inputErrorOccurred) {
          if (submitButton != null) submitButton.innerText = "Correct and Submit again";
        } else {
          // check that any duration is selected or not - show error if not selected
          const timeDurationContainer = document.querySelector<HTMLDivElement>("#timeDurationSelectionContainer");
          const durationCheckboxElems = document.querySelectorAll<HTMLInputElement>("input.form-check-input.work-dur-type-ckbx:checked");
          if (durationCheckboxElems.length === 0) {
            if (timeDurationContainer != null) {
              timeDurationContainer.classList.add("blinking-div");
            }
            showErrorToast('<span>Select start duration <i class="fw-medium">(Time on Starting the Job)</i></span>');
          } else {
            if (timeDurationContainer != null && timeDurationContainer.classList.contains("blinking-div")) {
              timeDurationContainer.classList.remove("blinking-div");
            }
            hideToast();

            // prepare data to show on quotation summary modal dialog
            const allUserSelections: ISelectionRecord[] = await indexedDb.getAllValues("selections");

            const fromName = dataToSend["name"] as string;
            const fromEmail = dataToSend["email"] as string;
            const phone = dataToSend["phone"] as string;
            const address = dataToSend["address"] as string;

            const totalAmount = localStorage.getItem("totalAmount") || "0";
            dataToSend["totalAmount"] = totalAmount;

            const duration = getDurationText(localStorage.getItem("durationCode") || "");
            dataToSend["duration"] = duration;

            setHeadingElementText("#from-name", fromName);
            setHeadingElementText("#from-email", fromEmail);
            setHeadingElementText("#from-phone", phone);
            setHeadingElementText("#from-address", address);
            setHeadingElementText("#total", `\u00A3${totalAmount}`);
            setHeadingElementText("#duration", duration);

            const tableElement = document.querySelector<HTMLTableElement>("#quotation-review-tbl");
            if (tableElement != null) {
              // remove all previous shown data first
              const tBodies = tableElement.tBodies;
              if (tBodies.length > 0) [...tBodies].forEach((x) => x.remove());

              const tbody = tableElement.createTBody();
              allUserSelections.forEach((record) => {
                addServicesTableRow(tbody, record.service, record.quantityText, record.pricePerItem, record.price);
              });
            }

            summaryModal.show();
          }
        }
      });
    }
  }
}
