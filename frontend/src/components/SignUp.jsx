import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .optional(),
    agreeToTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agreeToTerms === true, {
    message: "You must accept the terms and conditions",
    path: ["agreeToTerms"],
  });

export const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmitInitial = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup/initiate`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          phone: data.phone,
          agreeToTerms: data.agreeToTerms,
        },
      );

      if (response.data.success) {
        setEmail(data.email);
        setStep(2);
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async () => {
    if (!otp) {
      console.error("Verification code is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup/verify`,
        { email, otp },
      );

      if (response.data.success) {
        localStorage.setItem("token", `Bearer ${response.data.data.token}`);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#CBE4DE]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-white/20">
        <div className="box">
          <div className="form-value">
            <form onSubmit={handleSubmit(onSubmitInitial)}>
              <h2 className="text-center text-2xl font-bold mb-8 text-[#2C3333]">
                {step === 1 ? "Sign Up" : "Verify Email"}
              </h2>

              {step === 1 ? (
                <>
                  <div className="inputbox">
                    <ion-icon
                      name="person-outline"
                      class="text-[#0E8388]"
                    ></ion-icon>
                    <input
                      type="text"
                      {...register("name")}
                      required
                      className="focus:border-[#0E8388]"
                    />
                    <label>Name</label>
                    {errors.name && (
                      <p className="text-[#800000] text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="inputbox">
                    <ion-icon
                      name="mail-outline"
                      class="text-[#0E8388]"
                    ></ion-icon>
                    <input
                      type="email"
                      {...register("email")}
                      required
                      className="focus:border-[#0E8388]"
                    />
                    <label>Email</label>
                    {errors.email && (
                      <p className="text-[#800000] text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="inputbox">
                    <ion-icon
                      name="lock-closed-outline"
                      class="text-[#0E8388]"
                    ></ion-icon>
                    <input
                      type="password"
                      {...register("password")}
                      required
                      className="focus:border-[#0E8388]"
                    />
                    <label>Password</label>
                    {errors.password && (
                      <p className="text-[#800000] text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="inputbox">
                    <ion-icon
                      name="lock-closed-outline"
                      class="text-[#0E8388]"
                    ></ion-icon>
                    <input
                      type="password"
                      {...register("confirmPassword")}
                      required
                      className="focus:border-[#0E8388]"
                    />
                    <label>Confirm Password</label>
                    {errors.confirmPassword && (
                      <p className="text-[#800000] text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="inputbox">
                    <ion-icon
                      name="call-outline"
                      class="text-[#0E8388]"
                    ></ion-icon>
                    <input
                      type="tel"
                      {...register("phone")}
                      required
                      className="focus:border-[#0E8388]"
                    />
                    <label>Phone Number</label>
                    {errors.phone && (
                      <p className="text-[#800000] text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="forget flex flex-col">
                    <label className="flex items-center gap-2 text-[#2C3333]">
                      <input
                        type="checkbox"
                        {...register("agreeToTerms")}
                        className="rounded border-[#0E8388] text-[#0E8388] focus:ring-[#0E8388]"
                      />
                      <span>I agree to the Terms & Conditions</span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-[#800000] text-sm mt-2">
                        {errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>

                  <button
                    disabled={isLoading}
                    className="bg-[#2C3333] hover:bg-[#2E4F4F] text-white w-full py-2 rounded-md transition-colors duration-300 mt-4"
                  >
                    {isLoading ? "Sending otp..." : "Sign Up"}
                  </button>

                  <div className="register text-center mt-4">
                    <p className="text-[#2C3333]">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-[#0E8388] hover:underline"
                      >
                        Login
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="inputbox">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="focus:border-[#0E8388]"
                    />
                    <label>Enter OTP</label>
                  </div>

                  <button
                    onClick={onSubmitOTP}
                    disabled={isLoading}
                    className="bg-[#2C3333] hover:bg-[#2E4F4F] text-white w-full py-2 rounded-md transition-colors duration-300 mt-4"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
