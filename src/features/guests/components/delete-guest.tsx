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
import { useDeleteGuest } from "../hooks";
import { Trash } from "lucide-react";

export const DeleteGuest = ({ guestId }: { guestId: string }) => {
  const { mutate, isPending } = useDeleteGuest();

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
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao clicar em continuar, o convidado será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Field>
            <Button onClick={() => mutate(guestId)} disabled={isPending}>
              Continuar
            </Button>
          </Field>
          <AlertDialogClose
            render={<Button variant={"outline"}>Cancelar</Button>}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
