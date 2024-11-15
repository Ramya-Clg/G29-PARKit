// Credit_Form.jsx
import { useState, useEffect } from 'react';
import './index.css';
import Head from './Credit_Head';
import Form from './Credit_Form';
import FormThankYou from './Credit_Form_Ty';

function CreditForm() {
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
    const regexCardNumber = containsOnlyNumbers(values.cardNumber);
    const regexMonth = containsOnlyNumbers(values.month);
    const regexYear = containsOnlyNumbers(values.year);
    const regexCvc = containsOnlyNumbers(values.cvc);
    const currentYear = new Date().getFullYear();
    const lastTwoDigitsOfYear = currentYear.toString().slice(-2);

    // Validate Name
    if (!values.name) {
      errors.name = "Name can't be blank";
    }

    // Validate Card Number
    if (!values.cardNumber) {
      errors.cardNumber = "Card number can't be blank";
    } else if (!regexCardNumber) {
      errors.cardNumber = "Wrong format, numbers only";
    } else if (values.cardNumber.length !== 19) {
      errors.cardNumber = "Card number length must be 16";
    }

    // Validate Month
    if (!values.month) {
      errors.month = "Can't be blank";
    } else if (!regexMonth) {
      errors.month = "Wrong format, numbers only";
    } else if (values.month > 12) {
      errors.month = "Must be less than 12";
    }

    // Validate Year
    if (!values.year) {
      errors.year = "Can't be blank";
    } else if (!regexYear) {
      errors.year = "Wrong format, numbers only";
    } else if (values.year < lastTwoDigitsOfYear) {
      errors.year = "Year can't be less than current year";
    }

    // Validate CVC
    if (!values.cvc) {
      errors.cvc = "Can't be blank";
    } else if (!regexCvc) {
      errors.cvc = "Wrong format, numbers only";
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
        <FormThankYou />
      )}
    </div>
  );
}

export default CreditForm;
