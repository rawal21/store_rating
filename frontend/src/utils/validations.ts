import { z } from "zod";

// ── Reusable field schemas ────────────────────────────────────────────────────
const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

const emailSchema = z
  .string()
  .email("Must be a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

const addressSchema = z
  .string()
  .min(1, "Address is required")
  .max(400, "Address must be at most 400 characters");

// ── Auth schemas ──────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Admin create user schema ──────────────────────────────────────────────────
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(["ADMIN", "NORMAL_USER", "STORE_OWNER"]),
});

// ── Store schema ──────────────────────────────────────────────────────────────
export const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().uuid("Must be a valid UUID").optional().or(z.literal("")),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
