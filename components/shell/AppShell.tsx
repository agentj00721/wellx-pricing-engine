"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMode } from "@/components/providers";
import { TopBar } from "./TopBar";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { CustomerExperience } from "@/components/customer/CustomerExperience";
import { TeamExperience } from "@/components/team/TeamExperience";
import { FoundersExperience } from "@/components/founders/FoundersExperience";

export function AppShell() {
  const { mode } = useMode();

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <AmbientBackdrop />
      <TopBar />
      <main className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-transform"
          >
            {mode === "customer" && <CustomerExperience />}
            {mode === "team" && <TeamExperience />}
            {mode === "founders" && <FoundersExperience />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
