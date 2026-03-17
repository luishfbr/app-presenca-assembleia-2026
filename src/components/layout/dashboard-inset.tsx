export const DashboardInset = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 min-h-0 overflow-auto p-6">
      <div className="h-full w-full mx-auto max-w-5xl">{children}</div>
    </div>
  );
};
