import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { toAuthErrorMessage } from "@/features/auth/auth-errors"
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas"
import { useAuth } from "@/hooks/useAuth"

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", consent: false },
  })

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null)
    try {
      await registerUser(values.email, values.password, values.email.split("@")[0])
      navigate("/dashboard", { replace: true })
    } catch (error) {
      setFormError(toAuthErrorMessage(error, "register"))
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-6 pt-15 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <h1 className="text-2xl font-semibold text-primary">Inscription</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email" className="text-primary">Email</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </InputGroup>
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password" className="text-primary">Mot de passe</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password ? (
                <FieldError errors={[errors.password]} />
              ) : (
                <FieldDescription>Min 12 caractères : majuscule, minuscule, chiffre, spécial.</FieldDescription>
              )}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword" className="text-primary">Confirmer le mot de passe</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <Field data-invalid={!!errors.consent}>
              <label className="flex items-start gap-2 text-sm text-primary">
                <Controller
                  control={control}
                  name="consent"
                  render={({ field }) => (
                    <Checkbox
                      className="mt-0.5"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      aria-invalid={!!errors.consent}
                    />
                  )}
                />
                <span>
                  J'accepte les mentions légales et la{" "}
                  <Link to="/politique-confidentialite" className="underline">
                    politique de confidentialité
                  </Link>
                  .
                </span>
              </label>
              <FieldError errors={[errors.consent]} />
            </Field>

            {formError ? <FieldError>{formError}</FieldError> : null}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Création…" : "Créer mon compte"}
            </Button>
          </FieldGroup>
        </form>

        <p className="text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="font-medium text-info underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
