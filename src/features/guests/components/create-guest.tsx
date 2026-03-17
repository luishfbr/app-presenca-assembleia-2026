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
import { useCreateGuest } from "../hooks";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGuestSchema, type CreateGuestType } from "../validations";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export const CreateGuest = ({ eventSlug }: { eventSlug: string }) => {
  const { mutateAsync } = useCreateGuest();

  const form = useForm<CreateGuestType>({
    resolver: zodResolver(createGuestSchema),
    defaultValues: { name: "", document: "", type: "" },
  });

  async function onSubmit(data: CreateGuestType) {
    await mutateAsync({ ...data, eventSlug });
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusCircle /> Novo convidado
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo convidado</DialogTitle>
          <DialogDescription>
            Preencha os dados do convidado para adicionar à lista de presença.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-guest"
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="p-6 gap-6 pt-2 grid grid-cols-2"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2 col-span-2">
                <FieldLabel htmlFor="guest-name">Nome</FieldLabel>
                <Input id="guest-name" placeholder="Nome completo" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="document"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="guest-document">Documento</FieldLabel>
                <Input id="guest-document" placeholder="CPF / RG" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="guest-type">Tipo</FieldLabel>
                <Input
                  id="guest-type"
                  placeholder="Tipo de convidado"
                  {...field}
                />
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
              form="form-guest"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Criar convidado"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
