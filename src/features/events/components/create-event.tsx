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
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useCreateEvent } from "../hooks";
import { createEventSchema, type CreateEventType } from "../validations";

function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export const CreateEvent = () => {
  const { mutateAsync } = useCreateEvent();

  const form = useForm<CreateEventType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      startDate: toDatetimeLocal(new Date()),
      endDate: toDatetimeLocal(new Date()),
    },
  });

  async function onSubmit(data: CreateEventType) {
    await mutateAsync(data);
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusCircle /> Novo evento
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo evento</DialogTitle>
          <DialogDescription>
            Preencha os dados do evento de presença.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-event"
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="p-6 pt-2 flex flex-col gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor="event-name">Nome</FieldLabel>
                <Input
                  id="event-name"
                  placeholder="Nome do evento"
                  {...field}
                />
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
                <FieldLabel htmlFor="event-start">Início</FieldLabel>
                <Input id="event-start" type="datetime-local" {...field} />
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
                <FieldLabel htmlFor="event-end">Término</FieldLabel>
                <Input id="event-end" type="datetime-local" {...field} />
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
              form="form-event"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Criar evento"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
