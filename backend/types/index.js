import {z} from 'zod'

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

export { LoginSchema, SignupSchema };
