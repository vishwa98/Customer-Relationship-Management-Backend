import { z } from 'zod';

export const updateCustomerSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  email: z.string().email('Invalid email format').max(255).optional(),
  phoneNumber: z.string().max(20).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

export type UpdateCustomerDTO = z.infer<typeof updateCustomerSchema>;
