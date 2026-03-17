"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

export const CustomPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) => {
  return (
    <div className="flex flex-row gap-2 items-center text-xs">
      <span>Página</span>
      <Button
        variant={"outline"}
        size={"icon-xs"}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <ArrowLeft />
      </Button>
      <span>
        {totalPages === 0 ? 0 : currentPage} de {totalPages}
      </span>
      <Button
        variant={"outline"}
        size={"icon-xs"}
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};
