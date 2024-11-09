const {z} = require("zod");

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    phone: z.string().optional(),
})

module.exports = { LoginSchema }