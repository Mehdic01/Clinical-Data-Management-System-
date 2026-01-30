import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className = "", error, ...props }, ref) => {
    const base =
      "w-full rounded-md border px-3 py-2 text-sm outline-none transition";
    const borderStyle = error
      ? "border-red-500 focus:border-red-500"
      : "border-zinc-300 focus:border-black";

    return (
      <input
        ref={ref}
        className={`${base} ${borderStyle} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
