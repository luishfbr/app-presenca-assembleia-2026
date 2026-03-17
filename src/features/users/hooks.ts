"use client";

import type { User } from "@/server/auth";
import { authClient } from "@/lib/auth-client";
import type { CreateUserType, UpdateUserType } from "./validations";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type UsersQueryData = {
  data: {
    total: number;
    users: User[];
  };
};

const USERS_QUERY_KEY = ["usuarios"] as const;
const LIMIT = 10;

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, email, password, role, username }: CreateUserType) =>
      authClient.admin.createUser({
        name,
        email,
        password,
        role,
        data: { username },
      }),
    onError: (context: any) =>
      toast.error(context.error?.message ?? "Erro ao criar usuário"),
    onSuccess: () => {
      toast.success("Usuário criado com sucesso");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useAdmin = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") ?? 1);

  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const queryKey = [...USERS_QUERY_KEY, LIMIT, currentPage] as const;

  const { data: session, isPending: gettingUserSession } =
    authClient.useSession();

  const { data, isPending, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      authClient.admin.listUsers({
        query: {
          limit: LIMIT,
          offset: (currentPage - 1) * LIMIT,
          sortBy: "createdAt",
          sortDirection: "asc",
        },
      }),
    placeholderData: keepPreviousData,
  });

  const totalUsers = data?.data?.total ?? 0;
  const users = (data?.data?.users ?? []) as User[];
  const totalPages = Math.ceil(totalUsers / LIMIT);

  const updateUsersCache = (updater: (old: UsersQueryData) => UsersQueryData) =>
    queryClient.setQueriesData<UsersQueryData>(
      { queryKey: USERS_QUERY_KEY },
      (old) => (old?.data ? updater(old) : old),
    );

  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (userId: string) => authClient.admin.removeUser({ userId }),
    onError: (context: any) =>
      toast.error(context.error?.message ?? "Erro ao remover usuário"),
    onSuccess: (_, userId) => {
      toast.success("Usuário removido com sucesso");
      updateUsersCache((old) => ({
        ...old,
        data: {
          total: old.data.total - 1,
          users: old.data.users.filter((u) => u.id !== userId),
        },
      }));
    },
  });

  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ userId, edit }: { userId: string; edit: UpdateUserType }) =>
      authClient.admin.updateUser({
        userId,
        data: {
          name: edit.name,
          role: edit.role,
          username: edit.username,
        },
      }),
    onError: (context: any) =>
      toast.error(context.error?.message ?? "Erro ao atualizar usuário"),
    onSuccess: (_, { userId, edit }) => {
      toast.success("Usuário atualizado com sucesso");
      updateUsersCache((old) => ({
        ...old,
        data: {
          ...old.data,
          users: old.data.users.map((u) =>
            u.id === userId ? { ...u, ...edit } : u,
          ),
        },
      }));
    },
  });

  return {
    isPending,
    isFetching,
    isUpdatingUser,
    isDeletingUser,
    gettingUserSession,
    updateUser,
    deleteUser,
    setCurrentPage,
    currentPage,
    totalPages,
    users,
    totalUsers,
    user: session?.user,
  };
};
