import cardBack from "/bg-card-back.png?url";
import cardFront from "/bg-card-front.png?url";

export default function Head({ formData, formattedCardNumber }) {
  const { name, cardNumber, month, year, cvc } = formData;

  return (
    <header className="relative flex flex-col items-center lg:items-start bg-[#2E8B8B] h-60 w-full lg:w-[50%] lg:h-screen overflow-hidden">
  <div className="w-[45%] lg:w-[90%] mt-10 lg:mt-[15%] lg:ml-[10%] flex flex-col lg:flex-col-reverse relative">
    {/* Back of Card */}
    <div className="relative w-[80%] lg:w-[85%] mx-auto">
      <img
        className="w-full h-auto max-w-full object-contain"
        src={cardBack}
        alt="Back of credit card"
      />
      <p className="absolute top-[14%] left-[80%] lg:top-[25%] lg:left-[80%] text-white tracking-wider"
         style={{
           fontSize: "clamp(0.8rem, 1.5vw, 1.2rem)", // Responsive font size
           whiteSpace: "nowrap", // Prevent text from breaking onto the next line
         }}>
        {!cvc ? "000" : cvc}
      </p>
    </div>

    {/* Front of Card */}
    <div className="relative w-[80%] lg:w-[85%] mx-auto bottom-[15%] lg:bottom-[5%]">
      <img
        className="w-full h-auto max-w-full object-contain"
        src={cardFront}
        alt="Front of credit card"
      />
      {/* Circles */}
      <div className="absolute top-[5%] left-[5%] lg:top-[6%] lg:left-[7%] flex items-center">
        <div className="w-[10%] h-[10%] lg:w-[8%] lg:h-[8%] bg-white rounded-full mr-[5%] lg:mr-[5%]"></div>
        <div className="w-[5%] h-[5%] lg:w-[4%] lg:h-[4%] border-white border-2 rounded-full"></div>
      </div>
      {/* Card Details */}
      <div className="absolute top-[35%] left-[3%] lg:top-[25%] lg:left-[7%] w-full">
  <h1
    className="text-white tracking-widest mb-2" // Reduced margin for tighter spacing
    style={{
      fontSize: "clamp(0.82rem, 2.5vw, 1.5rem)",
      whiteSpace: "nowrap", 
      textOverflow: "ellipsis", 
    }}
  >
    {!cardNumber ? "0000 0000 0000 0000" : formattedCardNumber}
  </h1>
  <div className="flex items-center gap-4 w-full"> {/* Removed justify-between, added gap */}
    <p
      className="text-white uppercase tracking-wider"
      style={{
        fontSize: "clamp(0.8rem, 2.5vw, 1.5rem)",
        whiteSpace: "nowrap",
      }}
    >
      {!name ? "jane appleseed" : name}
    </p>
    <p
      className="text-white tracking-wider"
      style={{
        fontSize: "clamp(0.8rem, 2.5vw, 1.5rem)",
        whiteSpace: "nowrap",
      }}
    >
      {!month ? "00/" : `${month}/`}
      {!year ? "00" : `${year}`}
    </p>
  </div>
</div>

    </div>
  </div>
</header>


  );
}
