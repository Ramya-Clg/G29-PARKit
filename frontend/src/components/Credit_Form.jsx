//CC Form
export default function Form({
  formSubmitted,
  handleSubmit,
  formattedCardNumber,
  formData,
  handleInput,
  formErrors,
}) {
  const { name, cardNumber, month, year, cvc } = formData;
  return (
    
    <form
      className="flex flex-col px-6 py-10 lg:py-20 lg:px-28 bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-lg shadow-lg w-full max-w-md bordershadow-lg rounded-md lg:ml-20"
      onSubmit={handleSubmit}
    >
      <div className="mb-6">
        <label
          className="block text-gray-800 text-xs font-bold mb-2 uppercase tracking-widest"
          htmlFor="name"
        >
          Cardholder Name
        </label>
        <input
          className={`w-full h-12 px-4 text-gray-900 border ${
            formErrors.name ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          type="text"
          id="name"
          name="name"
          value={name}
          maxLength={100}
          onChange={handleInput}
          placeholder="e.g. Jane Appleseed"
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-800 text-xs font-bold mb-2 uppercase tracking-widest"
          htmlFor="cardNumber"
        >
          Card Number
        </label>
        <input
          className={`w-full h-12 px-4 text-gray-900 border ${
            formErrors.cardNumber ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={cardNumber}
          maxLength={19}
          onChange={handleInput}
          placeholder="e.g. 1234 5678 9123 0000"
        />
        {formErrors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label
            className="block text-gray-800 text-xs font-bold mb-2 uppercase tracking-widest"
            htmlFor="month"
          >
            Exp. Date (MM/YY)
          </label>
          <div className="flex gap-4">
            <input
              className={`w-1/2 h-12 px-4 text-gray-900 border ${
                formErrors.month ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              type="text"
              id="month"
              name="month"
              value={month}
              onChange={handleInput}
              maxLength={2}
              placeholder="MM"
            />
            {formErrors.month && (
              <p className="text-red-500 text-xs mt-1">{formErrors.month}</p>
            )}
            <input
              className={`w-1/2 h-12 px-4 text-gray-900 border ${
                formErrors.year ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              type="text"
              id="year"
              name="year"
              value={year}
              onChange={handleInput}
              maxLength={2}
              placeholder="YY"
            />
            {formErrors.year && (
              <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label
            className="block text-gray-800 text-xs font-bold mb-2 uppercase tracking-widest"
            htmlFor="cvc"
          >
            CVC
          </label>
          <input
            className={`w-full h-12 px-4 text-gray-900 border ${
              formErrors.cvc ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            type="text"
            id="cvc"
            name="cvc"
            value={cvc}
            onChange={handleInput}
            maxLength={3}
            placeholder="e.g. 123"
          />
          {formErrors.cvc && (
            <p className="text-red-500 text-xs mt-1">{formErrors.cvc}</p>
          )}
        </div>
      </div>

      <button
        className="w-full h-12 bg-[#0E8388] text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:opacity-90"
        type="submit"
      >
        Confirm
      </button>
    </form>
  );
}
