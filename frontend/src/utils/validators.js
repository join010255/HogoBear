import {z} from "zod";


const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(100, { message: 'Password cannot exceed 100 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

export const password = z.object({
    password : passwordSchema
})

export const usernameSchema = z.object({
    username : z.string().min(2, { message: 'Username must be at least 2 characters long' }).max(100, { message: 'Username cannot exceed 100 characters' }),
})
