import { useState, useEffect } from "react";
import "./index.css";
import Head from "./Credit_Head";
import Form from "./Credit_Form";
import FormThankYou from "./Credit_Form_Ty";

function CreditFormMain() {
  console.log("CreditFormMain loaded");
  const [formData, setFormData] = useState({
    cardNumber: "",
    month: "",
    year: "",
    cvc: "",
    name: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formattedCardNumber, setFormattedCardNumber] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setFormattedCardNumber(
      formData.cardNumber
        .replace(/\s?/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim(),
    );
  }, [formData.cardNumber]);

  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str.replace(/\s/g, ""));
  }

  const validate = (values) => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Validate Name
    if (!values.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]*$/.test(values.name)) {
      errors.name = "Name can only contain alphabets and spaces";
    }

    // Validate Card Number
    if (!values.cardNumber) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(values.cardNumber)) {
      errors.cardNumber =
        "Card number must be 16 digits in the format 1234 5678 1234 5678";
    }

    // Validate CVC (3 digits)
    if (!values.cvc) {
      errors.cvc = "CVC is required";
    } else if (!/^\d{3}$/.test(values.cvc)) {
      errors.cvc = "CVC must be 3 digits";
    }

    // Validate Month (1-12)
    if (!values.month) {
      errors.month = "Month is required";
    } else if (!/^(0[1-9]|1[0-2])$/.test(values.month)) {
      errors.month = "Month must be between 01 and 12";
    }

    // Validate Year (current year and beyond)
    if (!values.year) {
      errors.year = "Year is required";
    } else {
      const year = parseInt(values.year);
      const fullYear = year < 100 ? 2000 + year : year;
      if (fullYear < currentYear) {
        errors.year = "Year must be the current year or a future year";
      } else if (fullYear == currentYear) {
        const expMonth = parseInt(values.month);
        if (expMonth < currentMonth) {
          errors.year = "Expiration date can't be in the past";
        }
      }
    }
    return errors;
  };
  const noErrors = Object.keys(formErrors).length === 0;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formData));
    setFormSubmitted(true);
  };

  const handleFormReset = () => {
    setFormData({
      cardNumber: "",
      month: "",
      year: "",
      cvc: "",
      name: "",
    });
    setFormErrors({});
    setFormSubmitted(false); // Show the form again after reset
  };

  return (
    <div className="h-full w-full flex flex-col items-center lg:flex-row">
      <Head formattedCardNumber={formattedCardNumber} formData={formData} />
      {!noErrors || !formSubmitted ? (
        <Form
        formSubmitted={formSubmitted}
        handleSubmit={handleSubmit}
        formattedCardNumber={formattedCardNumber}
        formData={formData}
        handleInput={handleInput}
        formErrors={formErrors}
        />
      ) : (
        <FormThankYou handleFormReset={handleFormReset} />
      )}
    </div>
  );
}

export default CreditFormMain;
