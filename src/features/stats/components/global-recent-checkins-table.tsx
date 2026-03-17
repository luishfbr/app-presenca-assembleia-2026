"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardPanel } from "@/components/ui/card";
import { maskDocument } from "@/lib/utils";
import { RECENT_CHECKINS_LIMIT } from "../types";
import type { GlobalRecentCheckinItem } from "../types";

interface GlobalRecentCheckinsTableProps {
  data: GlobalRecentCheckinItem[];
}

export function GlobalRecentCheckinsTable({ data }: GlobalRecentCheckinsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkins Recentes — Global (últimos {RECENT_CHECKINS_LIMIT})</CardTitle>
      </CardHeader>
      <CardPanel className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Convidado</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead className="text-right">Data / Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum checkin registrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.guestName}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {maskDocument(item.guestDocument)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.guestType}</Badge>
                  </TableCell>
                  <TableCell>{item.userName ?? "—"}</TableCell>
                  <TableCell>
                    {item.eventSlug ? (
                      <Link
                        href={`/dashboard/events/${item.eventSlug}`}
                        className="text-xs hover:underline text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.eventName}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">{item.eventName}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardPanel>
    </Card>
  );
}
