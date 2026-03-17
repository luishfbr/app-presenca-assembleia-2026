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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteCheckin } from "@/features/checkins/hooks";
import type { CheckinWithRelations } from "@/features/checkins/types";
import { Trash2 } from "lucide-react";

function DeleteCheckin({ id }: { id: string }) {
  const { mutate, isPending } = useDeleteCheckin();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon" disabled={isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover checkin?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Field>
            <Button
              variant="destructive"
              onClick={() => mutate(id)}
              disabled={isPending}
            >
              {isPending ? "Removendo..." : "Remover"}
            </Button>
          </Field>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CheckinsTableProps {
  checkins: CheckinWithRelations[];
}

export function CheckinsTable({ checkins }: CheckinsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Convidado</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Registrado por</TableHead>
          <TableHead>Data/hora</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {checkins.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              Nenhum checkin encontrado.
            </TableCell>
          </TableRow>
        ) : (
          checkins.map((checkin) => (
            <TableRow key={checkin.id}>
              <TableCell className="font-medium">{checkin.guest?.name ?? "—"}</TableCell>
              <TableCell>{checkin.guest?.document ?? "—"}</TableCell>
              <TableCell>{checkin.guest?.type ?? "—"}</TableCell>
              <TableCell>{checkin.user?.name ?? "—"}</TableCell>
              <TableCell>
                {new Date(checkin.createdAt).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell>
                <DeleteCheckin id={checkin.id} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
