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
import { useDeleteAllGuests } from "../hooks";
import { Trash2 } from "lucide-react";

export const DeleteAllGuests = ({
  eventSlug,
  hasGuests,
}: {
  eventSlug: string;
  hasGuests: number;
}) => {
  const { mutate, isPending } = useDeleteAllGuests(eventSlug);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" disabled={hasGuests === 0}>
            <Trash2 className="w-4 h-4" />
            Excluir todos
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir todos os convidados?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação removerá permanentemente todos os convidados e seus
            check-ins deste evento. Não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Field>
            <Button
              variant="destructive"
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending ? "Excluindo..." : "Confirmar exclusão"}
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
