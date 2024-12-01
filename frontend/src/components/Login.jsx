import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
          password: formData.password,
        },
      );

      if (response.data.success) {
        localStorage.setItem("token", `Bearer ${response.data.data.token}`);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CBE4DE]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-white/20">
        <div className="box">
          <div className="form-value">
            <form onSubmit={handleSubmit}>
              <h2 className="text-center text-2xl font-bold mb-8 text-[#2C3333]">
                Login
              </h2>

              <div className="inputbox">
                <ion-icon name="mail-outline" class="text-[#0E8388]"></ion-icon>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:border-[#0E8388]"
                />
                <label>Email</label>
              </div>

              <div className="inputbox">
                <ion-icon
                  name="lock-closed-outline"
                  class="text-[#0E8388]"
                ></ion-icon>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:border-[#0E8388]"
                />
                <label>Password</label>
              </div>

              <div className="forget">
                <label className="flex items-center gap-2 text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-[#0E8388] text-[#0E8388] focus:ring-[#0E8388]"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[var(--text-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2C3333] hover:bg-[#2E4F4F] text-white w-full py-2 rounded-md transition-colors duration-300 mt-4"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>

              <div className="register text-center mt-4">
                <p className="text-[#2C3333]">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#0E8388] hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
