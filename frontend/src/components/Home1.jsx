import "./Home.css";
import navimg from '../../public/Group2.svg'
import gaddi from '../../public/gaddi.svg'
import cars from '../../public/cars.jpeg'
import background from '../../public/Frame-1.jpeg'
import rectangle from '../../public/Rectangle2.svg'


const Home1 = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <div class="main_container">
        <div class="container1">
          <img id="background_home" src={background} alt="img" />
          <img id="gaddi" src={gaddi} alt="img" />
          
          <div class="inside_container1">

            <div class="container1_navbar">
                <img id="navimg" src={navimg} alt="P" />
                <a class="navtags" href="">HOME</a>
                <a class="navtags" href="">RESERVE</a>
                <a class="navtags" href="">CONTACT</a>
                <a class="navtags" href="">ABOUT</a>
                <button id="login" >Login</button>
            </div>
            <div class="content_home">
                <div class="welcome">WELCOME TO</div>
                <div class="parkit">PARKiT</div>
                <div class="des">A modern and user-friendly parking experiencethat saves you time and stress.</div>
                <button class="booknow">BOOK NOW</button>
            </div>
          </div>
        </div>

        <div class="aboutus">
            <img id="rec" src={rectangle} alt="" />
              <div class="left">
                   <img id="cars"src={cars} alt="" />
              </div>

              <div class="right">
                <h1> ABOUT US</h1>
                <div class="right_content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel consequuntur sequi repellendus? Illum facere quod quisquam, quia laboriosam voluptatum sit possimus nemo exercitationem asperiores, provident ab numquam laborum repellat accusantium vero consectetur, perspiciatis esse corrupti rem impedit? Voluptatem enim quae eum soluta quam maiores! Sit mollitia tempore quo voluptates in.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum quis earum sit, qui vero possimus ipsum odit provident minus nobis vel rerum tempore excepturi quam nostrum fugiat odio commodi dolor. Libero, quis sapiente, odio magnam necessitatibus iure tenetur dolor aperiam expedita quos unde commodi explicabo nisi maiores aliquid provident culpa.  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore aut corporis inventore voluptatem? Temporibus vel rem in consequuntur harum perferendis maxime voluptas aperiam aut neque dignissimos sunt ut eum consectetur dolorum enim eaque ipsum illo saepe quod iure et, quidem laborum. Itaque perspiciatis assumenda consectetur numquam labore nostrum. Voluptate, molestias.
                </div>
                </div>
        </div>
      </div>
    </div>
  );
};

export default Home1;
