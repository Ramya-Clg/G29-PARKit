import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';

export const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
  const [email, setEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmitInitial = async (data) => {
    setIsLoading(true);
    try {
        console.log("here");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup/initiate`,
        data
      );
      setEmail(data.email);
      setStep(2);
      toast({
        title: "Success",
        description: "OTP sent to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup/verify`,
        { email, otp }
      );
      
      if (response.data.success) {
        localStorage.setItem('token', `Bearer ${response.data.data.token}`);
        toast({
          title: "Success",
          description: "Signup successful!",
        });
        navigate('/profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CBE4DE]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-sm border border-white/20">
        <div className="form-value">
          {step === 1 ? (
            <form onSubmit={handleSubmit(onSubmitInitial)}>
              <h2 className="text-[#2C3333] text-center mb-6 text-2xl font-semibold">
                SignUp
              </h2>

              <div className="relative mb-6">
                <ion-icon
                  name="person-add-outline"
                  className="absolute left-0 top-1/2 transform -translate-y-[80%] text-[#0E8388]"
                ></ion-icon>
                <input
                  type="text"
                  name="name"
                  {...register('name')}
                  required
                  className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
                />
                <label className="absolute left-8 top-1/2 transform -translate-y-[65%] text-black opacity-50 pointer-events-none transition-all duration-300">
                  Full Name
                </label>
              </div>

              <div className="relative mb-6">
                <ion-icon
                  name="mail-outline"
                  className="absolute left-0 top-1/2 transform -translate-y-[80%] text-[#0E8388]"
                ></ion-icon>
                <input
                  type="email"
                  name="email"
                  {...register('email')}
                  required
                  className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
                />
                <label className="absolute left-8 top-1/2 transform -translate-y-[65%] text-black opacity-50 pointer-events-none transition-all duration-300">
                  Email
                </label>
              </div>

              <div className="relative mb-6">
                <ion-icon
                  name="call-outline"
                  className="absolute left-0 top-1/2 transform -translate-y-[80%] text-[#0E8388]"
                ></ion-icon>
                <input
                  type="tel"
                  name="phone"
                  {...register('phone')}
                  required
                  className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
                  pattern="[\+]?[0-9]{1,4}?[ ]?[\(]?[0-9]{1,3}[\)]?[ ]?[\-]?[0-9]{1,4}?[ ]?[\-]?[0-9]{1,4}"
                />
                <label className="absolute left-8 top-1/2 transform -translate-y-[65%] text-black opacity-50 pointer-events-none transition-all duration-300">
                  Phone Number
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
                  {...register('password')}
                  required
                  className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
                />
                <label className="absolute left-8 top-1/2 transform -translate-y-[57%] text-black opacity-50 pointer-events-none transition-all duration-300">
                  Password
                </label>
              </div>

              <div className="relative pt-1 mb-6">
                <ion-icon
                  name="lock-closed-outline"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 text-[#0E8388]"
                ></ion-icon>
                <input
                  type="password"
                  name="confirmPassword"
                  {...register('confirmPassword')}
                  required
                  className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
                />
                <label className="absolute left-8 top-1/2 transform -translate-y-[57%] text-black opacity-50 pointer-events-none transition-all duration-300">
                  Confirm Password
                </label>
              </div>

              <div className="flex justify-between items-center mb-6 text-[#CBE4DE]">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    {...register('agreeToTerms')}
                    className="form-checkbox"
                  />
                  <span>I agree to the Terms and Conditions</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-[#0E8388] text-[#CBE4DE] font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F] disabled:opacity-50"
              >
                {isLoading ? "Sending OTP..." : "Register"}
              </button>

              <div className="text-center mt-6">
                <p className="text-[#CBE4DE]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#0E8388] font-bold hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onSubmitOTP(); }}>
              <h2 className="text-[#2C3333] text-center mb-6 text-2xl font-semibold">
                Verify OTP
              </h2>
              
              <div className="space-y-4">
                <div className="relative mb-6">
                  <Label className="block text-sm font-medium text-[#2C3333] mb-2">
                    Enter OTP sent to {email}
                  </Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-2 bg-[#0E8388] text-[#CBE4DE] font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F] disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <p className="text-sm text-center text-[#2C3333] mt-4">
                  Didn't receive OTP? {" "}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#0E8388] hover:underline"
                  >
                    Go back
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
