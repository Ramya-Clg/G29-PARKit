import React from 'react';
import './index.css';

export default function Main() {
  return (
    <div className='main-container w-full h-full bg-[rgba(203,228,222,0.29)] relative overflow-hidden mx-auto my-0'>
      <div className='relative z-20 mt-[-10vh] mx-auto w-[80%] max-w-[1500px]'>
        <div className='w-full h-[100vh] bg-[url(../assets/images/a1549723-0029-4969-9b1f-64de311e62e2.png)] bg-cover bg-no-repeat absolute top-0 left-[50%] transform -translate-x-1/2 z-[1]' />
        <div className='w-10 h-10 absolute top-[20vh] left-2 overflow-hidden z-20'>
          <div className='w-full h-full bg-[url(../assets/images/b897f237-6948-4668-b134-e354f484e99e.png)] bg-cover bg-no-repeat absolute top-[5%] left-[5%] z-[21]' />
          <div className='w-[27px] h-[20px] absolute bottom-2 right-2 overflow-hidden z-[22]'>
            <div className='w-full h-full bg-[url(../assets/images/6fa08a75-15b2-4b06-aab8-a81a3e5f3ef1.png)] bg-cover bg-no-repeat' />
          </div>
        </div>
        <div className='w-36 h-12 bg-transparent rounded-lg border border-[#0e8388] absolute top-[20vh] left-[50%] transform -translate-x-1/2 shadow-lg z-[7]'>
          <button className='w-full h-full bg-[rgba(14,131,136,0.5)] rounded-lg text-white font-bold text-lg'>
            LOGIN
          </button>
        </div>
        <nav className="flex justify-around text-[#2c3333] font-bold text-lg absolute top-[15vh] left-0 right-0 mx-auto z-[2] max-w-[80%]">
          <span>HOME</span>
          <span>RESERVE</span>
          <span>CONTACT</span>
          <span>ABOUT</span>
        </nav>
        <div className="flex flex-col items-start text-[#2c3333] absolute top-[35vh] left-4 z-[17]">
          <h1 className="text-4xl font-light tracking-wide">WELCOME TO</h1>
          <h2 className="text-7xl font-semibold mt-2">PARKit</h2>
          <p className="text-lg mt-4 max-w-md">
            A modern and user-friendly parking experience that saves you time and stress.
          </p>
        </div>
        <div className='w-[40vw] h-[30vh] bg-[url(../assets/images/98dccff4-ffde-477a-b190-95ee15324f8b.png)] bg-cover bg-no-repeat absolute top-[60vh] left-[60%] z-[16]' />
        <button className='w-48 h-16 bg-[rgba(11,86,86,0.17)] rounded-lg border border-[#2e4f4f] shadow-lg absolute top-[70vh] left-4 z-[12] text-white font-bold text-lg'>
          BOOK NOW
        </button>
      </div>
      
      <div className='relative w-full max-w-[80%] mx-auto z-[27] mt-8 px-8 py-4'>
        <div className='w-full h-[60vh] bg-[url(../assets/images/d9bcc876e5c39abb1ba7fcc6e423a14f1c6bc162.png)] bg-cover bg-no-repeat rounded-2xl' />
        <section className="text-[#2c3333] mt-4">
          <h3 className="text-4xl font-bold">ABOUT US</h3>
          <p className="text-lg mt-2 max-w-xl">
            Lorem ipsum dolor sit amet. Hic deleniti mollitia ut illo quisquam sit
            aliquam nihil ut natus eaque ut odit molestiae eum deleniti doloremque
            aut quos voluptas! Id adipisci perferendis qui omnis quidem aut
            nostrum neque aut officia rerum.
          </p>
        </section>
      </div>
      
      <footer className='w-full h-[40vh] bg-[#2c3333] text-white relative z-[28] mt-8 p-8'>
        <p>Footer content here</p>
      </footer>
    </div>
  );
}
