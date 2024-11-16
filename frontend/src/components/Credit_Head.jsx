import cardBack from "/bg-card-back.png?url";
import cardFront from "/bg-card-front.png?url";

export default function Head({ formData, formattedCardNumber }) {
  const { name, cardNumber, month, year, cvc } = formData;

  return (
    <header className="relative flex flex-col items-center lg:items-start bg-black h-60 w-full lg:w-[483px] lg:h-screen">
      <div className="w-[343px] lg:w-[541px] mt-10 lg:mt-[187px] lg:ml-[164px] flex flex-col lg:flex-col-reverse">
        {/* Back of Card */}
        <div className="w-[286px] lg:w-[447px] self-end relative">
          <img className="w-full" src={cardBack} alt="Back of credit card" />
          <p className="absolute top-[73px] left-[228px] lg:top-[111px] lg:left-[358px] text-white text-sm tracking-wider">
            {!cvc ? "000" : cvc}
          </p>
        </div>

        {/* Front of Card */}
        <div className="relative w-[286px] lg:w-[447px] bottom-[68px] lg:bottom-[32px]">
          <img className="w-full" src={cardFront} alt="Front of credit card" />
          {/* Circles */}
          <div className="absolute top-[17.6px] left-[19px] lg:top-[28px] lg:left-[32px] flex items-center">
            <div className="w-[30px] h-[30px] lg:w-[47px] lg:h-[47px] bg-white rounded-full mr-[10px] lg:mr-4"></div>
            <div className="w-[14px] h-[14px] lg:w-[21px] lg:h-[21px] border-white border-2 rounded-full"></div>
          </div>
          {/* Card Details */}
          <div className="absolute top-[84px] left-[19px] lg:top-[139px] lg:left-[32px]">
            <h1 className="text-white text-lg lg:text-2xl tracking-widest mb-4">
              {!cardNumber ? "0000 0000 0000 0000" : formattedCardNumber}
            </h1>
            <div className="flex items-center">
              <p className="text-white uppercase text-sm lg:text-base tracking-wider">
                {!name ? "jane appleseed" : name}
              </p>
              <p className="ml-auto text-white text-sm lg:text-base tracking-wider">
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
