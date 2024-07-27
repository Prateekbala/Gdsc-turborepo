import { z } from 'zod';

export const verifySchema = z.object({
  verifyTokenEncoded: z.string()
});
