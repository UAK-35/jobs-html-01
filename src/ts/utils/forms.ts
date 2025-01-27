/** @format */

import emailJs, { type EmailJSResponseStatus } from "@emailjs/browser";

const form_being_submitted = true;
const errorFieldParentClassName = "has-input-error";
const formFieldInvalidClassName = "is-invalid";
const formFieldValidClassName = "is-valid";

// function isAlphabetic(value: string) {
//   for (let i = 0; i < value.length; i++) {
//     const charCode = value.charCodeAt(i);
//     if (!(charCode > 64 && charCode < 91) && !(charCode > 96 && charCode < 123)) {
//       return false;
//     }
//   }
//   return true;
// }

function validateRequired(controlValue: string) {
  return (controlValue || "").trim().length > 0;
}

function validateName(nameValue: string) {
  // const validRegex = /^[a-zA-Z\s-]+$/;
  // You may also wish to add the apostrophe and hyphen between the brackets, since Irish and Italian names include the former (O'Donnell, D'Ambrosio)
  // and some folks have hyphenated last names (Claude Levi-Strauss, Ima Page-Turner, etc.).
  const validRegex = /^[a-zA-Z'\- ]+$/; // help link: https://stackoverflow.com/a/2283148
  return !!nameValue.match(validRegex);
}

function validateEmail(emailValue: string) {
  // const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
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

function validateUsAddress(emailValue: string) {
  // help link: https://www.geopostcodes.com/blog/address-validation-regex-javascript/
  const validRegex = /^(\\d+[A-Z]*)\\s([A-Z0-9\\s.-]+?)[\\s,]+([A-Z\\s.-]+?)[\\s,]+([A-Z\\s.-]+)\\s(\\d{5})[\\s,]+(US|USA|(United States(?: Of America)?))$/;
  return !!emailValue.match(validRegex);
}

function validateUkAddress(emailValue: string) {
  const validRegex = /[a-zA-Z0-9,# \-\/!@$%^\*(){}|[\]\\]*/gi;
  return !!emailValue.match(validRegex);
}

function doSendEmail(fromName: string, fromEmail: string, fromPhone: string, fromAddress: string, totalAmount: string, emailBody: string) {
  console.log("doSendEmail", { fromName, fromEmail, fromPhone, fromAddress, totalAmount, emailBody });
  // const serviceId = "service_20r3f2f";
  // const templateId = "template_g1qnhik"; // to_email is permanently set in template which can be modified
  // // const toEmail = "admin@myjobdone.co.uk";
  // const toEmail = "uak282006@gmail.com";
  // const templateParams = {
  //   from_name: fromName,
  //   from_email: fromEmail,
  //   from_phone: fromPhone,
  //   from_address: fromAddress,
  //   to_name: "MyJobDone Admin",
  //   to_email: toEmail,
  //   reply_to: fromEmail,
  //   current_date: new Date().toDateString(),
  //   total_amount: totalAmount,
  //   message: emailBody,
  // };
  // emailJs.send(serviceId, templateId, templateParams).then(
  //   function (response) {
  //     console.log("SUCCESS!", response.status, response.text);
  //     alert("Mail sent successfully");
  //   },
  //   function (err) {
  //     console.log('FAILED...', (error as EmailJSResponseStatus).text);
  //     console.log("FAILED...", err);
  //     alert("Mail send failed");
  //   }
  // );
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

export default function manageFormSubmission(currentPagePath: string) {
  const calculateForm = document.querySelector<HTMLFormElement>("#calculateForm");
  if (calculateForm != null) {
    const submitButton = calculateForm.querySelector<HTMLButtonElement>("button[type=submit]");
    if (submitButton != null) {
      // submitButton.addEventListener("click", (e: any) => {
      //   alert("button");
      //   e.preventDefault();
      // });
    }

    if (calculateForm.dataset["hasSubmitHandler"] == null) {
      calculateForm.dataset["hasSubmitHandler"] = "true";
      calculateForm.addEventListener("submit", (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (submitButton != null) submitButton.innerText = "Submitting form...";
        const formElem = e.target as HTMLFormElement;
        const dataToSend: FormDataRecord = {};
        let inputErrorOccurred = false;
        const formElements = formElem.elements;
        console.group("form-errors");
        for (const formElement of formElements) {
          const element = formElement as HTMLFormElement;
          if (element.tagName != null && !(element.tagName === "BUTTON")) {
            // console.group("form-element");
            // console.log("   name", element.name);
            // console.log("     id", element.id);
            // console.log("tagName", element.tagName);
            // console.log("  value", element.value);
            // console.groupEnd();
            const key = element.id != null ? element.id : element.name;
            const parentElem = element.parentElement as HTMLDivElement;

            if (key === "name") {
              inputErrorOccurred = validateField(element, "Name is required", validateName, "Invalid format of name");
              console.log("name error", inputErrorOccurred);
            }
            if (!inputErrorOccurred && key === "email") {
              inputErrorOccurred = validateField(element, "Email is required", validateEmail, "Invalid format of email");
              console.log("email error", inputErrorOccurred);
            }
            if (!inputErrorOccurred && key === "phone") {
              inputErrorOccurred = validateField(element, "Phone is required", validateUkPhone, "Invalid format of phone");
              console.log("phone error", inputErrorOccurred);
            }
            if (!inputErrorOccurred && key === "address") {
              inputErrorOccurred = validateField(element, "Address is required", validateUkAddress, "Invalid format of address");
              console.log("address error", inputErrorOccurred);
            }

            if (!inputErrorOccurred) dataToSend[key] = element.value;
          }
        }
        console.groupEnd();

        if (inputErrorOccurred) {
          if (submitButton != null) submitButton.innerText = "Correct and Submit again";
        } else {
          const fromName = dataToSend["name"] as string;
          const fromEmail = dataToSend["email"] as string;
          const phone = dataToSend["phone"] as string;
          const address = dataToSend["address"] as string;
          const totalAmount = localStorage.getItem("totalAmount") || "0";
          const emailBody = "New calculation request received";

          // console.log("dataToSend", dataToSend);
          // console.log({ fromName, fromEmail, phone, address, emailBody });
          if (totalAmount !== "0") {
            doSendEmail(fromName, fromEmail, phone, address, totalAmount, emailBody);
          }
        }
      });
    }
  }
}

// function checkForm(form: HTMLFormElement) {
//   if (form_being_submitted) {
//     alert("The form is being submitted, please wait a moment...");
//     form.myButton.disabled = true;
//     return false;
//   }
//
//   form.submitBtn.value = "Submitting form...";
//   form_being_submitted = true;
//   return true; /* submit form */
// }
