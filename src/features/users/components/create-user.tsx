"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useCreateUser } from "../hooks";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { createUserSchema, type CreateUserType } from "../validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreateUser = () => {
  const { mutateAsync, isPending } = useCreateUser();

  const form = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "user" as "user" | "admin",
      password: "",
    },
  });

  async function handleSubmit(data: CreateUserType) {
    await mutateAsync(data);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusCircle /> Novo usuário
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para cadastrar um novo usuário no
            sistema.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-user-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          autoComplete="off"
          className="grid grid-cols-2 gap-6 p-6 pt-2"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input id="name" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="username">Usuário</FieldLabel>
                <Input id="username" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2 col-span-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="form-role">Permissão</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-role"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Selecione uma permissão">
                      {field.value === "admin"
                        ? "Administrador"
                        : field.value === "user"
                          ? "Usuário"
                          : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { role: "admin", label: "Administrador" },
                      { role: "user", label: "Usuário" },
                    ].map((role) => (
                      <SelectItem key={role.role} value={role.role}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" {...field} type="password" />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Field>
            <Button form="create-user-form" type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Criar usuário"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
