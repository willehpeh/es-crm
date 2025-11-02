import * as z from 'zod';

export const registerNewContactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  source: z.string(),
});
