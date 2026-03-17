"use client";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useDeleteEvent } from "../hooks";
import { Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const DeleteEvent = ({ eventSlug }: { eventSlug: string }) => {
  const { mutate, isPending } = useDeleteEvent();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        children={
          <div className="p-1.5 rounded-md bg-destructive shadow-md hover:bg-destructive/80 transition-colors cursor-pointer">
            <Trash className="w-4 h-4" />
          </div>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir evento?</AlertDialogTitle>
          <AlertDialogDescription>
            Todos os convidados e check-ins deste evento serão removidos
            permanentemente. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Field>
            <Button onClick={() => mutate(eventSlug)} disabled={isPending}>
              {isPending ? <Spinner /> : "Continuar"}
            </Button>
          </Field>
          <AlertDialogClose
            render={<Button variant="outline">Cancelar</Button>}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
