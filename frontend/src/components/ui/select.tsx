import { forwardRef, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className = "", error, children, ...props }, ref) => {
    const base =
      "w-full rounded-md border px-3 py-2 text-sm outline-none transition bg-white";
    const borderStyle = error
      ? "border-red-500 focus:border-red-500"
      : "border-zinc-300 focus:border-black";

    return (
      <select
        ref={ref}
        className={`${base} ${borderStyle} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
