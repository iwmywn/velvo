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

export const changePasswordWithIdScheme = basePasswordScheme
  .extend({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters."),
    userId: z.string().min(1, "User ID is required."),
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: "New password must be different from current password.",
    path: ["password"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const baseChangeEmailScheme = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
  email: z.string().email("Invalid email address."),
  confirmEmail: z.string(),
});

export const changeEmailScheme = baseChangeEmailScheme.refine(
  (data) => data.email === data.confirmEmail,
  {
    message: "Email do not match.",
    path: ["confirmEmail"],
  },
);

export const changeEmailWithIdScheme = baseChangeEmailScheme.extend({
  userId: z.string().min(1, "User ID is required."),
});

export const deleteAccountScheme = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const deleteAccountWithIdScheme = deleteAccountScheme.extend({
  userId: z.string().min(1, "User ID is required."),
});
