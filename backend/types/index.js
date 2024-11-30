import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  agreeToTerms: z.boolean(),
});

const ReservationSchema = z.object({
  reservationDate: z.string(),
  reservationTime: z.string(),
  duration: z.string(),
  vehicleNumberPlate: z
    .string()
    .min(1, "Number plate is required")
    .max(10, "Number plate cannot exceed 10 characters")
    .regex(
      /^[A-Z0-9 ]+$/,
      "Only uppercase letters, numbers and spaces are allowed",
    ),
});

const FeedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  rating: z.string(),
  message: z.string().min(10),
});

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password cannot exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export {
  LoginSchema,
  SignupSchema,
  ReservationSchema,
  FeedbackSchema,
  ResetPasswordSchema,
};
