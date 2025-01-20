import { z } from "zod";

export const basePasswordScheme = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
});

export const emailScheme = z.object({
  email: z.string().email("Invalid email address."),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(4, "First name must be at least 4 characters."),
    lastName: z.string().min(4, "Last name must be at least 4 characters."),
    email: z.string().email("Invalid email address."),
  })
  .merge(basePasswordScheme)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const resetPasswordScheme = basePasswordScheme.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  },
);

export const changePasswordScheme = basePasswordScheme
  .extend({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters."),
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: "New password must be different from current password.",
    path: ["password"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changeEmailScheme = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    email: z.string().email("Invalid email address."),
    confirmEmail: z.string(),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match.",
    path: ["confirmEmail"],
  });

export const deleteAccountScheme = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const placeOrderSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phone: z
    .string()
    .min(10, "Phone must have at least 10 digits")
    .max(11, "Phone must have at most 11 digits")
    .regex(/^(0)[1-9][0-9]{8,9}$/, "Phone must be a valid number"),
  city: z.string().nonempty("City is required"),
  district: z.string().nonempty("District is required"),
  ward: z.string().nonempty("Ward is required"),
  address: z.string().min(1, "Please provide address"),
});

export const placeOrderWithProductSchema = placeOrderSchema.extend({
  products: z
    .object({
      _id: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      color: z.string().min(1, "Color is required"),
      size: z.string().min(1, "Size is required"),
      priceCents: z.number().min(1, "PriceCents must be at least 1"),
      saleOff: z.number().min(1, "SaleOff must be at least 1"),
    })
    .array(),
  totalPriceCents: z.string().min(1, "Total price is required"),
});
