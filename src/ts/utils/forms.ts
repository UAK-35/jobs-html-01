import emailJs from "@emailjs/browser";

function doSendEmail(fromName: string, fromEmail: string, emailBody: string) {
  const serviceId = "service_20r3f2f";
  const templateId = "template_g1qnhik"; // to_email is permanently set in template which can be modified
  const templateParams = {
    from_name: fromName,
    from_email: fromEmail,
    to_name: "MyJobDone Admin",
    to_email: "admin@myjobdone.co.uk",
    message: emailBody,
    reply_to: "admin@myjobdone.co.uk",
  };
  emailJs.send(serviceId, templateId, templateParams).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Mail sent successfully");
    },
    function (err) {
      console.log("FAILED...", err);
      alert("Mail send failed");
    }
  );
}

export default function manageFormSubmission() {
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


      // const fromName = dataToSend["name"];
      const fromName = "test-user";
      // const fromEmail =  dataToSend["email"];
      const fromEmail = "uak252003@yahoo.com";
      const emailBody = "New calculation request received";

      doSendEmail(fromName, fromEmail, emailBody);
    });
  }
}
