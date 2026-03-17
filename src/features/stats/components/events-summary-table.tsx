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
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckinsByEventItem } from "../types";

const ATTENDANCE_GOOD_THRESHOLD = 50;

interface EventsSummaryTableProps {
  data: CheckinsByEventItem[];
}

export function EventsSummaryTable({ data }: EventsSummaryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Evento</CardTitle>
      </CardHeader>
      <CardPanel className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead className="text-right">Convidados</TableHead>
              <TableHead className="text-right">Checkins</TableHead>
              <TableHead className="text-right">Taxa</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum evento cadastrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.eventSlug}>
                  <TableCell className="font-medium">{item.eventName}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.totalGuests.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.totalCheckins.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        item.attendanceRate >= ATTENDANCE_GOOD_THRESHOLD
                          ? "border-green-500 text-green-600 dark:text-green-400"
                          : "border-amber-500 text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {item.attendanceRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/events/${item.eventSlug}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Ver <ArrowRight className="size-3" />
                    </Link>
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
