import { z } from 'zod';


export const signUpSchema = z.object({
  name:z.string(),
  email: z.string().email({
    message: "Email must be valid",
  }).refine(email => email.endsWith('@lnmiit.ac.in'), {
    message: "Email must end with @lnmiit.ac.in",
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
  conformPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
}).refine((data) => data.password === data.conformPassword, {
  message: "Passwords don't match",
  path: ['conformPassword'], // Points to where the error should appear
});
