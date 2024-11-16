import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string(),
  phone: z.string().optional(),
});

const ReservationSchema = z.object({
  reservationDate: z.string(),
  reservationTime: z.string(),
  rservationDuration: z.number().max(5),
  vehicleNumberPlate: z.string(),
});

const FeedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  rating: z.number().min(1).max(5),
  message: z.string().min(2),
});

export { LoginSchema, SignupSchema, ReservationSchema, FeedbackSchema };
