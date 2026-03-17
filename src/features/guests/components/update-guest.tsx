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
import { Spinner } from "@/components/ui/spinner";
import type { Guest } from "@/db/schema/presence/guests";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateGuest } from "../hooks";
import { updateGuestSchema, type UpdateGuestType } from "../validations";

export const UpdateGuest = ({ guest }: { guest: Guest }) => {
  const { mutateAsync } = useUpdateGuest();

  const form = useForm<UpdateGuestType>({
    resolver: zodResolver(updateGuestSchema),
    defaultValues: {
      name: guest.name,
      document: guest.document,
      type: guest.type,
    },
  });

  async function onSubmit(data: UpdateGuestType) {
    await mutateAsync({ id: guest.id, body: data });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar convidado</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-guest-form"
          autoComplete="off"
          className="grid grid-cols-2 gap-6 pt-2 p-6"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="col-span-2">
                <FieldLabel htmlFor="edit-guest-name">Nome</FieldLabel>
                <Input id="edit-guest-name" {...field} />
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
              <Field>
                <FieldLabel htmlFor="edit-guest-document">Documento</FieldLabel>
                <Input id="edit-guest-document" {...field} />
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
              <Field>
                <FieldLabel htmlFor="edit-guest-type">Tipo</FieldLabel>
                <Input id="edit-guest-type" {...field} />
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
              form="update-guest-form"
              type="submit"
              disabled={form.formState.isSubmitting || form.formState.disabled}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Salvar alterações"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
