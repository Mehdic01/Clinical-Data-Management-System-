type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

export function LoadingSpinner({ label = "Loading...", size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-zinc-600 border-t-transparent`}
      />
      {label && <span>{label}</span>}
    </div>
  );
}
