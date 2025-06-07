import {z} from 'zod';

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("email is required"),
  password: z.string().min(6, "password must be at least 6 characters long").nonempty("Password is required"),
})

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("email is required"),
  password: z.string().min(6, "password must be at least 6 characters long").nonempty("Password is required"),
})
