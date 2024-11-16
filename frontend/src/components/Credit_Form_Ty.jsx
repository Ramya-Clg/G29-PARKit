//cc TY
export default function ThankYou({ handleFormReset }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 lg:py-20 lg:px-28 bg-white shadow-lg rounded-md lg:ml-20">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 lg:w-16 lg:h-16 mb-4 text-purple-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.485 9.671-5.743 6.745a1 1 0 0 1-1.468 0L6.515 12.13a1 1 0 1 1 1.469-1.359l3.03 3.277 5.009-5.887a1 1 0 1 1 1.462 1.31Z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 text-center">
          Thank you!
        </h2>
        <p className="text-sm lg:text-base text-gray-500 text-center">
          We've added your card details.
        </p>
      </div>
      <button
        className="mt-6 w-full h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:opacity-90"
        onClick={handleFormReset}
      >
        Continue
      </button>
    </div>
  );
}
