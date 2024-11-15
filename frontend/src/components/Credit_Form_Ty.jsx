//CC ty
import Head from "./Credit_Head";
import iconComplete from "/icon-complete.svg?url";
export default function FormThankYou () {
  const handleClick = () => {
      location.reload()
  }
  return (
      <section className='thank-you max-md:mt-[91px] lg:ml-[349px] flex flex-col items-center'>
          <img src={iconComplete} alt='check mark complete logo' className='mb-[35px]'></img>
          <h1 className='mb-4'>THANK YOU!</h1>
          <h2 className='mb-12'>We've added your card details</h2>
          <button className='form--submit_btn bg-second-color text-main-color w-[327px] h-[53px] rounded-lg lg:w-[381px]' aria-label='continue button' onClick={handleClick}>Continue</button>
      </section>
  )
}
