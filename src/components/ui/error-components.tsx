export const ErrorComponent = ({
  message = "Erro ao carregar dados",
}: {
  message?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-red-500">{message}</p>
    </div>
  );
};
