import { z } from "zod"

// EF-A01 : mot de passe ≥ 12 caractères, majuscule, minuscule, chiffre, caractère spécial.
const passwordPolicy = z
  .string()
  .min(12, "12 caractères minimum")
  .regex(/[a-z]/, "Une minuscule")
  .regex(/[A-Z]/, "Une majuscule")
  .regex(/[0-9]/, "Un chiffre")
  .regex(/[^A-Za-z0-9]/, "Un caractère spécial")

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email requis").email("Email invalide"),
    password: passwordPolicy,
    confirmPassword: z.string().min(1, "Confirmation requise"),
    consent: z.boolean().refine((value) => value === true, {
      message: "Le consentement est requis pour créer un compte",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
