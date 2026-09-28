import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { toAuthErrorMessage } from "@/features/auth/auth-errors"
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas"
import { useAuth } from "@/hooks/useAuth"

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  })

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)
    try {
      await login(values.email, values.password, { rememberMe: values.rememberMe })
      navigate(searchParams.get("redirect") ?? "/dashboard", { replace: true })
    } catch (error) {
      setFormError(toAuthErrorMessage(error, "login"))
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-6 pt-15 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <h1 className="text-2xl font-semibold text-primary">Connexion</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
          <FieldGroup className="gap-5">
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
                  autoComplete="current-password"
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
              <FieldError errors={[errors.password]} />
            </Field>

            <div className="flex items-center justify-between">
              <Controller
                control={control}
                name="rememberMe"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                    Se souvenir de moi
                  </label>
                )}
              />
              <Link to="/mot-de-passe-oublie" className="text-sm text-info underline underline-offset-4">
                Mot de passe oublié ?
              </Link>
            </div>

            {formError ? <FieldError>{formError}</FieldError> : null}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion…" : "Se connecter"}
            </Button>
          </FieldGroup>
        </form>

        <p className="text-sm text-muted-foreground">
          Pas encore inscrit ?{" "}
          <Link to="/inscription" className="font-medium text-info underline underline-offset-4">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
