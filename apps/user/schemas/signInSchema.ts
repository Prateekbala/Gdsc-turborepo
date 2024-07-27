import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string().email().regex(/@lnmiit\.ac\.in$/, {
    message: "Email must be an institute email ending with @lnmiit.ac.in",
  }),
  password: z.string(),
});

