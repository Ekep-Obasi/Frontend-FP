"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function AiGeneratingOverlay({
  visible,
  label = "We're building your perfect itinerary…",
}: {
  visible: boolean;
  label?: string;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm">
      <div className="relative rounded-2xl border border-border bg-background shadow-xl p-8 max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          {label}
        </motion.div>
        <div className="mt-6">
          <motion.div
            className="mx-auto h-1 w-56 overflow-hidden rounded-full bg-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full w-1/3 rounded-full bg-primary"
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "150%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <motion.p
            className="mt-3 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Crafting the timeline, picking spots, checking weather…
          </motion.p>
        </div>
      </div>
    </div>
  );
}
