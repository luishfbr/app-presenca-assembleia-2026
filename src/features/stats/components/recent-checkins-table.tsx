"use client";

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
import type { RecentCheckinItem } from "../types";

interface RecentCheckinsTableProps {
  data: RecentCheckinItem[];
}

export function RecentCheckinsTable({ data }: RecentCheckinsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkins Recentes (últimos {RECENT_CHECKINS_LIMIT})</CardTitle>
      </CardHeader>
      <CardPanel className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Convidado</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead className="text-right">Data / Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
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
