import { forwardRef, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className = "", error, ...props }, ref) => {
    const base =
      "w-full rounded-md border px-3 py-2 text-sm outline-none transition resize-none";
    const borderStyle = error
      ? "border-red-500 focus:border-red-500"
      : "border-zinc-300 focus:border-black";

    return (
      <textarea
        ref={ref}
        className={`${base} ${borderStyle} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
