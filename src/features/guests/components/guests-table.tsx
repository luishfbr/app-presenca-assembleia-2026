"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Guest } from "@/db/schema/presence/guests";
import { DeleteGuest } from "./delete-guest";
import { UpdateGuest } from "./update-guest";

export const GuestsTable = ({ guests }: { guests: Guest[] }) => {
  return (
    <Table>
      {guests.length === 0 && (
        <TableCaption>Nenhum convidado encontrado.</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell>{guest.name}</TableCell>
            <TableCell>{guest.document}</TableCell>
            <TableCell>
              <Badge variant="outline">{guest.type}</Badge>
            </TableCell>
            <TableCell>
              {new Date(guest.createdAt).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell className="flex items-center justify-end gap-2">
              <UpdateGuest guest={guest} />
              <DeleteGuest guestId={guest.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
