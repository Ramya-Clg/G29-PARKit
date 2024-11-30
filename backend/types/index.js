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

export { LoginSchema, SignupSchema, ReservationSchema, FeedbackSchema };
