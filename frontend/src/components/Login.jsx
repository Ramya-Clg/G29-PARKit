import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import "../App";

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email: formData.email,
          password: formData.password
        }
      );

      const { token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      toast({
        title: "Success!",
        description: "Logged in successfully",
        variant: "default",
      });

      // Redirect to home page
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CBE4DE]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-lg shadow-lg w-full max-w-md border border-white/20">
        <div className="form-value">
          <form onSubmit={handleSubmit}>
            <h2 className="text-[#2C3333] text-center mb-6 text-2xl font-semibold">
              Login
            </h2>

            <div className="relative mb-6">
              <ion-icon
                name="mail-outline"
                className="absolute left-0 top-1/2 transform -translate-y-[80%] text-black"
              ></ion-icon>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
              />
              <label className="absolute left-8 top-1/2 transform -translate-y-[65%] text-black opacity-50 pointer-events-none transition-all duration-300">
                Email
              </label>
            </div>

            <div className="relative pt-1 mb-6">
              <ion-icon
                name="lock-closed-outline"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-[#0E8388]"
              ></ion-icon>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
              />
              <label className="absolute left-8 top-1/2 transform -translate-y-[57%] text-black opacity-50 pointer-events-none transition-all duration-300">
                Password
              </label>
            </div>

            <div className="flex justify-between items-center mb-6 text-[#CBE4DE]">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="form-checkbox" 
                />
                <span>Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-[#0E8388] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[#0E8388] text-[#CBE4DE] font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F] disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>

            <div className="text-center mt-6">
              <p className="text-[#CBE4DE]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#0E8388] font-bold hover:underline"
                >
                  SignUp
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
