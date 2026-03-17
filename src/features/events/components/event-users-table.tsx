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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRemoveUserFromEvent } from "../hooks";
import type { EventUserWithUser } from "../types";

export const EventUsersTable = ({
  eventSlug,
  eventUsers,
}: {
  eventSlug: string;
  eventUsers: EventUserWithUser[];
}) => {
  const { mutate, isPending } = useRemoveUserFromEvent(eventSlug);

  return (
    <Table>
      {eventUsers.length === 0 && (
        <TableCaption>Nenhum usuário atribuído a este evento.</TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Adicionado em</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {eventUsers.map((eu) => (
          <TableRow key={eu.id}>
            <TableCell>{eu.user?.name ?? "—"}</TableCell>
            <TableCell>{eu.user?.username ?? eu.user?.email ?? "—"}</TableCell>
            <TableCell>
              <Badge variant="outline">{eu.user?.role ?? "—"}</Badge>
            </TableCell>
            <TableCell>
              {new Date(eu.createdAt).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell className="flex justify-end">
              <div
                className="p-1.5 rounded-md bg-destructive shadow-md hover:bg-destructive/80 transition-colors cursor-pointer"
                onClick={() => !isPending && mutate(eu.userId)}
              >
                <Trash className="w-4 h-4" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
