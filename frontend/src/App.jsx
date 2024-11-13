import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Button } from "./components/ui/button";
import { Feedback } from "./components/Feedback";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Feedback />
    </div>
  );
}

export default App;
