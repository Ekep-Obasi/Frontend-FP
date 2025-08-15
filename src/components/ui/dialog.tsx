"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "~/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <DialogPrimitive.Content className={cn("fixed inset-x-0 top-[10%] mx-auto max-w-3xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4", className)} {...props} />
    </DialogPrimitive.Portal>
  );
}


