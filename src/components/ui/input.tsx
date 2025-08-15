import { cn } from "~/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input ref={ref} className={cn("w-full rounded-md border px-3 py-2 bg-transparent", className)} {...props} />
  );
});


