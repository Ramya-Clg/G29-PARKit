// Credit_Form.jsx
import { useState, useEffect } from 'react';
import './index.css';
import Head from './Credit_Head';
import Form from './Credit_Form';
import FormThankYou from './Credit_Form_Ty';

function CreditForm() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    month: '',
    year: '',
    cvc: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formattedCardNumber, setFormattedCardNumber] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setFormattedCardNumber(
      formData.cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
    );
  }, [formData.cardNumber]);

  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str.replace(/\s/g, ''));
  }

  const validate = values => {
    // ... same validation logic
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setFormErrors(validate(formData));
    setFormSubmitted(true);
  };

  const noErrors = Object.keys(formErrors).length === 0;

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
