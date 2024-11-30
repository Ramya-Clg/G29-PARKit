import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(step === 1 ? emailSchema : resetSchema),
  });

  const onSubmitEmail = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login/forgot-password/initiate`,
        { email: data.email },
      );
      setEmail(data.email);
      setStep(2);
      toast({
        title: "Success",
        description: "Verification code sent to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.msg || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async () => {
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First verify the OTP
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login/forgot-password/verify-otp`,
        {
          email,
          otp,
        },
      );

      if (response.data.success) {
        setStep(3);
        toast({
          title: "Success",
          description: "Verification code confirmed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Invalid verification code",
        variant: "destructive",
      });
      setOtp(""); // Clear invalid OTP
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitNewPassword = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login/forgot-password/reset`,
        {
          email,
          otp,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        },
      );
      toast({
        title: "Success",
        description: "Password reset successful",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CBE4DE]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-sm border border-white/20">
        <h2 className="text-[#2C3333] text-center mb-6 text-2xl font-semibold">
          Reset Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmitEmail)}>
            <div className="relative mb-6">
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
              />
              {errors.email && (
                <p className="text-[#800000] text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#0E8388] text-white font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F] disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter verification code"
                className="w-full pl-8 pb-1 bg-transparent border-b border-[#0E8388] text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300"
              />
            </div>

            <button
              onClick={onSubmitOTP}
              disabled={isLoading}
              className="w-full py-2 bg-[#0E8388] text-white font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F] disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmitNewPassword)}>
            <div className="relative mb-6">
              <input
                type="password"
                {...register("password")}
                placeholder="New password"
                className={`w-full pl-8 pb-1 bg-transparent border-b ${
                  errors.password ? "border-[#800000]" : "border-[#0E8388]"
                } text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300`}
              />
              {errors.password && (
                <p className="text-[#800000] text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative mb-6">
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                className={`w-full pl-8 pb-1 bg-transparent border-b ${
                  errors.confirmPassword
                    ? "border-[#800000]"
                    : "border-[#0E8388]"
                } text-black focus:outline-none focus:border-[#2E4F4F] transition-all duration-300`}
              />
              {errors.confirmPassword && (
                <p className="text-[#800000] text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#0E8388] text-white font-bold rounded-md transition duration-300 hover:bg-[#2E4F4F] disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
