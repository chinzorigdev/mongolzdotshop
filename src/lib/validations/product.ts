import { z } from "zod";

// Product validation schema
export const productSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  price_on_sale: z.coerce.number().nullable(),
  image: z.string().url("Image must be a valid URL"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  category: z.string().optional(),
  inStock: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
