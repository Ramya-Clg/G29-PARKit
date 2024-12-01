import "../components/Home.css";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* <Navbar/> */}
      <div id="home" className="main_container">
        <div class="container1">
          {/* <img id="background_home" src={background} alt="img" /> */}

          {/* <img id="gaddi" src={gaddi} alt="img" /> */}
          <div class="inside_container1">
            <div class="container1_navbar">
              {/* <img id="navimg" src={navimg} alt="P" />
                <a class="navtags" href="">HOME</a>
                <a class="navtags" href="">RESERVE</a>
                <a class="navtags" href="">CONTACT</a>
                <a class="navtags" href="">ABOUT</a>
              <button id="login" >Login</button> */}
            </div>
            <div class="content_home">
              <div class="welcome">WELCOME TO</div>
              <div class="parkit">PARKit</div>
              <div class="des">
                A modern and user-friendly parking experience that saves you
                time and stress.
              </div>
              <button class="booknow" onClick={() => navigate("/booking")}>
                Get Started
              </button>
            </div>
            <img id="gaddi" src="../New_home_page_image.svg" alt="img" />
          </div>
        </div>
      </div>

      <div class="aboutus" id="about">
        {/* <img id="rec" src={rectangle} alt="" /> */}
        <div class="left">
          <img id="cars" src="../about_us_image.jpg" alt="" />
        </div>

        <div class="right">
          <h1> ABOUT US</h1>
          <div class="right_content">
            Parkit is designed to offer a seamless and efficient parking
            experience with a smart approach to managing spaces. Unlike
            traditional systems where users can select a specific parking slot,
            our platform takes a more dynamic approach by automatically
            assigning an available slot to the user upon arrival. This ensures
            quicker parking without the hassle of searching for an open space.
            Our solution focuses on enhancing user experience by providing an
            intelligent, optimized parking system that saves time and reduces
            the stress of finding parking. With a user-friendly interface and a
            reliable, randomized slot allocation system, we bring modern smart
            parking solutions to your fingertips, making parking simpler and
            more efficient.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
