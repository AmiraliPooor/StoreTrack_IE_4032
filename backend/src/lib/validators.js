import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1),
  stock: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  category: z.string().min(1),
  minStock: z.number().int().nonnegative()
});

export const productUpdateSchema = z.object({
  name: z.string().min(1),
  stock: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  category: z.string().min(1),
  minStock: z.number().int().nonnegative()
});

export const orderCreateSchema = z.object({
  customerName: z.string().min(1),
  createdAtStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // "YYYY-MM-DD"
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive()
  })).min(1)
});

export const orderStatusSchema = z.object({
  status: z.enum(['Pending', 'Shipped', 'Cancelled'])
});
