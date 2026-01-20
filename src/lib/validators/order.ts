import { z } from 'zod';

export const orderItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().positive(),
  image: z.string(),
  price: z.number().nonnegative(),
  product: z.string(), // ObjectID as string
});

export const shippingAddressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const guestInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const orderCreateSchema = z.object({
  orderItems: z.array(orderItemSchema).min(1, 'No order items'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  itemsPrice: z.number().nonnegative(),
  taxPrice: z.number().nonnegative(),
  shippingPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  guestInfo: guestInfoSchema.optional(),
});
