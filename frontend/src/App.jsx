import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Login } from "./components/Login";
import { Feedback } from "./components/Feedback";
import { SignUp } from "./components/SignUp";
import { Profile } from "./components/Profile";
import { Admin } from "./components/Admin";
import CreditFormMain from "./components/Credit_Form_Main";
import { Navbar } from "./components/Navbar";
import Home from "./components/Home";
import Booking from "./components/Booking";
import { Toaster } from "@/components/ui/toaster";

function PrivateRoute({ element }) {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     return <Navigate to="/login" replace />;
  //   }
  return element;
}

function RootApp() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup", "/credit"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/feedback"
          element={<PrivateRoute element={<Feedback />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/credit"
          element={<PrivateRoute element={<CreditFormMain />} />}
        />
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RootApp />
    </BrowserRouter>
  );
}
