import cardBack from '/bg-card-back.png?url'
import cardFront from '/bg-card-front.png?url'
export default function Head({formData, formattedCardNumber}) {
    const {name, cardNumber, month, year, cvc} = formData
    return (
        <header className='head--container relative flex flex-col max-md:items-center bg-black h-60 w-full lg:w-[483px] lg:h-full'>
            <div className='header--cards_image_container w-[343px] max-md:h-[251px] mt-10 lg:ml-[164px] lg:mt-[187px] flex flex-col lg:flex-col-reverse lg:w-[541px] lg:h-[527px]'>
                <div className="header--image_container_back w-[286px] lg:w-[447px] self-end relative ">
                    <img className='header--card_back ' src={cardBack} alt="back of credit card" />
                    <p className='header--security_numbers absolute top-[73px] left-[228px] lg:top-[111px] lg:left-[358px]'>{!cvc ? '000' : cvc}</p>
                </div>
                
                <div className="header--image_container_front w-[286px] lg:w-[447px] relative bottom-[68px] lg:bottom-[32px]">
                    <img className='header--card_front' src={cardFront} alt="front of credit card" /> 
                    <div className=' circle--container absolute top-[17.6px] left-[19px] lg:top-[28px] lg:left-[32px] flex items-center'>
                        <div className="header--circle_large w-[30px] h-[30px] bg-main-color rounded-[15px] mr-[10px] lg:mr-4 lg:w-[47px] lg:h-[47px] lg:rounded-[23.5px]"></div>
                        <div className="header--circle_small w-[14px] h-[14px] border-main-color border rounded-[7px] lg:w-[21px] lg:h-[21px] lg:rounded-[10.5px]"></div>
                    </div>
                    
                    <div className='header--card_info_container absolute top-[84px] left-[19px] lg:top-[139px] lg:left-[32px]'>
                        <h1 className='header--card_numbers mb-[17px] lg:mb-[25.5px]'>{!cardNumber ? '0000 0000 0000 0000' : formattedCardNumber}</h1>
                        <div className='header--card_name_and_expiration_date_container flex'>
                            <p className='header--card_name'>{!name ? 'jane appleseed' : name}</p>
                            <p className='header--expiration_date ml-auto'>{!month ? '00/' : `${month}/`}{!year ? '00' : `${year}`}</p>
                        </div>  
                    </div>
                </div>
            </div>
            
        </header>
    )
}
