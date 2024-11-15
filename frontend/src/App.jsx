import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Feedback } from "./components/Feedback";
import { SignUp } from "./components/SignUp";
import { Profile } from "./components/Profile";
import { Admin } from "./components/Admin";
import CreditFormMain from "./components/Credit_Form_Main";
function App() {
  return (
    <div>
        <Navbar></Navbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/credit" element={<CreditFormMain />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
