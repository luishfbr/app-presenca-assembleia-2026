"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UserPlus } from "lucide-react";
import { useAddUserToEvent } from "../hooks";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/server/auth";

export const AddUserToEvent = ({ eventSlug }: { eventSlug: string }) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { mutateAsync, isPending } = useAddUserToEvent(eventSlug);

  const { data, isFetching } = useQuery({
    queryKey: ["all-users-for-event"],
    queryFn: () =>
      authClient.admin.listUsers({ query: { limit: 100, offset: 0 } }),
  });

  const allUsers = ((data?.data?.users ?? []) as User[]).filter(
    (u) => u.role !== "admin",
  );
  const filtered = search
    ? allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          (u.username ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : allUsers;

  async function handleAdd() {
    if (!selectedUser) return;
    await mutateAsync(selectedUser.id);
    setSelectedUser(null);
    setSearch("");
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <UserPlus /> Adicionar usuário
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar usuário ao evento</DialogTitle>
          <DialogDescription>
            Selecione o usuário que poderá realizar check-ins neste evento.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-2 flex flex-col gap-4">
          <Field className="flex flex-col gap-2">
            <FieldLabel>Buscar usuário</FieldLabel>
            <Input
              placeholder="Nome ou usuário..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedUser(null);
              }}
            />
          </Field>

          {isFetching && (
            <div className="flex justify-center py-2">
              <Spinner />
            </div>
          )}

          {!isFetching && filtered.length > 0 && (
            <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
              {filtered.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setSearch(user.name);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                    selectedUser?.id === user.id ? "bg-muted font-medium" : ""
                  }`}
                >
                  <span>{user.name}</span>
                  {user.username && (
                    <span className="ml-2 text-muted-foreground">@{user.username}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedUser && (
            <p className="text-sm text-muted-foreground">
              Selecionado: <strong>{selectedUser.name}</strong>
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Field>
            <Button
              onClick={handleAdd}
              disabled={!selectedUser || isPending}
            >
              {isPending ? <Spinner /> : "Adicionar"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
