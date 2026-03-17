"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Trash } from "lucide-react";

export const DeleteUser = ({
  onDelete,
  isDeleting,
  isUser,
}: {
  onDelete: () => void;
  isDeleting: boolean;
  isUser: boolean;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={isUser}
        children={
          <div
            className={`p-1.5 rounded-md bg-destructive shadow-md hover:bg-destructive/80 transition-colors ${isUser ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Trash className="w-4 h-4" />
          </div>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao clicar em continuar, o usuário será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Field>
            <Button onClick={onDelete} disabled={isDeleting}>
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
