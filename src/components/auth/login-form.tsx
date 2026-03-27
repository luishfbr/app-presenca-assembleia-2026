"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { loginSchema, type LoginType } from "@/validations/auth";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginType) => {
    await authClient.signIn.username(
      {
        ...data,
      },
      {
        onError(context) {
          if (context.error.status === 401) {
            toast.error("Credenciais inválidas!");
          } else {
            toast.error(context.error.message || "Falha ao realizar login.");
          }
        },
        onSuccess(ctx) {
          if (ctx.data.user.role === "admin") {
            toast.error(
              "Você não tem permissão para acessar a tela de checkin!",
            );
            router.push("/dashboard");
          } else {
            toast.success("Login realizado com sucesso");
            router.push("/checkin");
          }
        },
      },
    );
  };

  return (
    <>
      <CardContent>
        <form
          id="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="grid gap-4"
        >
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field aria-disabled={fieldState.isDirty}>
                <FieldLabel className="text-xl" htmlFor="username-form">
                  Usuário
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Digite seu usuário"
                  id="username-form"
                />
                {fieldState.error && (
                  <FieldError>
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field aria-disabled={fieldState.isDirty}>
                <FieldLabel className="text-md" htmlFor="password-form">
                  Senha
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Digite sua senha"
                  type="password"
                  id="password-form"
                />
                {fieldState.error && (
                  <FieldError>
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="w-full">
        <Button
          className="w-full"
          type="submit"
          form="login-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : "Entrar"}
        </Button>
      </CardFooter>
    </>
  );
};
