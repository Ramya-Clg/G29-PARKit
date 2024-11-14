import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Button } from "./components/ui/button";
import { Feedback } from "./components/Feedback";
import { Register } from "./components/Register";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </BrowserRouter>
      <Feedback />
    </div>
  );
}

export default App;
