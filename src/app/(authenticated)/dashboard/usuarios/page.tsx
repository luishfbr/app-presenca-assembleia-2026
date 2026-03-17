"use client";

import { CreateUser } from "@/features/users/components/create-user";
import { UsersTable } from "@/features/users/components/users-table";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { DefaultLoadingComponent } from "@/components/ui/loading-comp";
import { useAdmin } from "@/features/users/hooks";
import { useEffect } from "react";

export default function Page() {
  const {
    isPending,
    isFetching,
    totalUsers,
    currentPage,
    setCurrentPage,
    totalPages,
    users,
  } = useAdmin();

  useEffect(() => {
    if (currentPage > 1 && users?.length === 0 && !isPending) {
      setCurrentPage(currentPage - 1);
    }
  }, [users?.length, currentPage, isPending]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <CreateUser />
      </header>
      <div className={`flex-1 min-h-0 overflow-auto transition-opacity duration-200${isFetching && !isPending ? " opacity-50" : ""}`}>
        {isPending ? <DefaultLoadingComponent /> : <UsersTable />}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="text-xs flex flex-row gap-2 items-center">
          <p>Total de usuários:</p>
          <span className="font-bold">{totalUsers}</span>
        </div>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
