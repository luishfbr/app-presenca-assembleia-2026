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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAdmin } from "../hooks";
import type { User } from "@/server/auth";
import { updateUserSchema, type UpdateUserType } from "../validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

export function UpdateUser({
  loggedUser,
  user,
}: {
  user: User;
  loggedUser: string;
}) {
  const { updateUser } = useAdmin();

  const form = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      username: user.username as string,
      role: user.role as "user" | "admin",
    },
  });

  async function onSubmit(data: UpdateUserType) {
    await updateUser({
      edit: data,
      userId: user.id,
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={"outline"}
            size={"icon-sm"}
            disabled={loggedUser === user.id}
          >
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edição de Usuário</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias. Clique em salvar quando você
            terminar de editar.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-form"
          autoComplete="off"
          className="grid gap-6 p-6 pt-2"
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
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Field>
            <Button
              form="update-form"
              type="submit"
              disabled={form.formState.isSubmitting || form.formState.disabled}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Salvar Mudanças"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
