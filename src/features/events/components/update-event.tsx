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
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateEvent } from "../hooks";
import { updateEventSchema, type UpdateEventType } from "../validations";
import type { EventWithStats } from "../types";

function toDatetimeLocal(date: Date | string) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export const UpdateEvent = ({ event }: { event: EventWithStats }) => {
  const { mutateAsync } = useUpdateEvent();

  const form = useForm<UpdateEventType>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      name: event.name,
      startDate: toDatetimeLocal(event.startDate),
      endDate: toDatetimeLocal(event.endDate),
    },
  });

  async function onSubmit(data: UpdateEventType) {
    await mutateAsync({ slug: event.slug, body: data });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar evento</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form
          id="update-event-form"
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="p-6 pt-2 flex flex-col gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="edit-event-name">Nome</FieldLabel>
                <Input id="edit-event-name" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="edit-event-start">Início</FieldLabel>
                <Input id="edit-event-start" type="datetime-local" {...field} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="edit-event-end">Término</FieldLabel>
                <Input id="edit-event-end" type="datetime-local" {...field} />
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
              form="update-event-form"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Salvar alterações"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
