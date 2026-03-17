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
import { useAdmin } from "../hooks";
import { DeleteUser } from "./delete-user";
import { UpdateUser } from "./update-user";

export const UsersTable = () => {
  const {
    users,
    isDeletingUser,
    isPending,
    deleteUser,
    user,
    isUpdatingUser,
  } = useAdmin();

  const loggedUser = user?.id as string;
  return (
    <Table>
      {!users ||
        (users.length < 1 && (
          <TableCaption>Nenhum usuário encontrado.</TableCaption>
        ))}
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Permissão</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!isUpdatingUser &&
          !isDeletingUser &&
          !isPending &&
          users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username ?? "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === "admin" ? "Administrador" : "Usuário"}
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <UpdateUser loggedUser={loggedUser} user={user} />
                <DeleteUser
                  onDelete={() => deleteUser(user.id)}
                  isDeleting={isDeletingUser}
                  isUser={loggedUser === user.id}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
