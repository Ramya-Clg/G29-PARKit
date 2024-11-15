export default function Form({ formData, handleInput, formattedCardNumber, handleSubmit, formErrors }) {
    const { name, month, year, cvc } = formData;

    return (
        <form
            aria-label="credit card form"
            className="form mt-[91px] lg:mt-[111px] flex flex-col w-[327px] h-[348px] lg:w-[381px] lg:h-[372px] lg:ml-[349px] lg:mb-[90px]"
        >
            <label htmlFor="name" className="form--name_label mb-2">
                Cardholder Name
            </label>
            <input
                className={`form--name_input lg:w-[381px] min-h-[45px] rounded-md border text-left focus:outline-none focus:ring-2 focus:ring-indigo-600 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                name="name"
                value={name}
                id="name"
                aria-label="name"
                onChange={handleInput}
                placeholder="e.g. Manish Joshi"
            />
            {formErrors.name && <div className="text-red-500 mt-2 text-xs">{formErrors.name}</div>}

            <label htmlFor="cardNumber" className="form--cardNumber_label mt-[18px] lg:mt-[26px] mb-2">
                Card Number
            </label>
            <input
                className={`form--card_number_input lg:w-[381px] min-h-[45px] rounded-md border text-left focus:outline-none focus:ring-2 focus:ring-indigo-600 ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                name="cardNumber"
                value={formattedCardNumber}
                id="cardNumber"
                aria-label="cardNumber"
                onChange={handleInput}
                placeholder="e.g. 1234 5678 9123 0000"
                maxLength={19}
            />
            {formErrors.cardNumber && <div className="text-red-500 mt-2 text-xs">{formErrors.cardNumber}</div>}

            <div className="form--exp_container flex w-full mt-[14px] mb-[28px] lg:mb-[40px] lg:mt-[26px]">
                <div className="form--month_container mr-2">
                    <label htmlFor="month" className="form--month_label block mb-[9px]">
                        EXP.DATE
                    </label>
                    <input
                        className="form--month_input w-[72px] lg:w-[80px] p-2 text-left"
                        name="month"
                        value={month}
                        id="month"
                        aria-label="month"
                        onChange={handleInput}
                        placeholder="MM"
                        maxLength={2}
                    />
                    {formErrors.month && <div className="text-red-500 mt-2 text-xs">{formErrors.month}</div>}
                </div>

                <div className="form--month_container mr-[11px] lg:mr-[20px]">
                    <label htmlFor="year" className="form--year_label block mb-[9px]">
                        MM/YY
                    </label>
                    <input
                        className="form--yeara_input w-[72px] lg:w-[80px] p-2 text-left"
                        name="year"
                        value={year}
                        id="year"
                        aria-label="year"
                        onChange={handleInput}
                        placeholder="YY"
                        maxLength={2}
                    />
                    {formErrors.year && <div className="text-red-500 mt-2 text-xs">{formErrors.year}</div>}
                </div>

                <div className="form--cvc_container">
                    <label htmlFor="cvc" className="form--cvc_label block mb-[9px]">
                        CVC
                    </label>
                    <input
                        className={`form--cvc_input w-[155px] lg:w-[191px] rounded-md border text-left focus:outline-none focus:ring-2 focus:ring-indigo-600 ${formErrors.cvc ? 'border-red-500' : 'border-gray-300'}`}
                        name="cvc"
                        value={cvc}
                        id="cvc"
                        aria-label="cvc"
                        onChange={handleInput}
                        placeholder="e.g. 123"
                        maxLength={3}
                    />
                    {formErrors.cvc && <div className="text-red-500 mt-2 text-xs">{formErrors.cvc}</div>}
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="form--submit_btn bg-gray-300 text-black w-[327px] min-h-[53px] rounded-lg lg:w-[381px] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="confirm button">
                Confirm
            </button>

        </form>
    );
}
