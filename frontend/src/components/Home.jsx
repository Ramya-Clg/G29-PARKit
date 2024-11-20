import "./Home.css";
import gaddi from "../../public/New_home_page_image.svg";
import cars from "../../public/about_us_image.jpg";
import background from "../../public/new_home_page_bg.jpeg";
import rectangle from "../../public/about_us_bg.svg";
import { Footer } from "./Footer";
import { Feedback } from "./Feedback";

export const Home = () => {
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
              <button class="booknow">Get Started</button>
            </div>
            <img id="gaddi" src={gaddi} alt="img" />
          </div>
        </div>
      </div>

      <div class="aboutus" id="about">
        {/* <img id="rec" src={rectangle} alt="" /> */}
        <div class="left">
          <img id="cars" src={cars} alt="" />
        </div>

        <div class="right">
          <h1> ABOUT US</h1>
          <div class="right_content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
            consequuntur sequi repellendus? Illum facere quod quisquam, quia
            laboriosam voluptatum sit possimus nemo exercitationem asperiores,
            provident ab numquam laborum repellat accusantium vero consectetur,
            perspiciatis esse corrupti rem impedit? Voluptatem enim quae eum
            soluta quam maiores! Sit mollitia tempore quo voluptates in. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Illum quis earum
            sit, qui vero possimus ipsum odit provident minus nobis vel rerum
            tempore excepturi quam nostrum fugiat odio commodi dolor. Libero,
            quis sapiente, odio magnam necessitatibus iure tenetur dolor aperiam
            expedita quos unde commodi explicabo nisi maiores aliquid provident
            culpa. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Labore aut corporis inventore voluptatem? Temporibus vel rem in
            consequuntur harum perferendis maxime voluptas aperiam aut neque
            dignissimos sunt ut eum consectetur dolorum enim eaque ipsum illo
            saepe quod iure et, quidem laborum. Itaque perspiciatis assumenda
            consectetur numquam labore nostrum. Voluptate, molestias.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
