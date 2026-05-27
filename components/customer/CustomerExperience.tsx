"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useDevice } from "@/components/providers";
import { GradientButton } from "@/components/ui/GradientButton";
import {
  HorizontalStepper,
  VerticalStepper,
} from "@/components/ui/Stepper";
import {
  calcQuote,
  initialState,
  STEPS,
  type CustomerState,
} from "./flow";
import { LiveStack } from "./LiveStack";
import {
  ExperienceStep,
  GoalStep,
  ModelStep,
  ModulesStep,
  PersonaStep,
  PopulationStep,
  QuoteStep,
  WelcomeStep,
} from "./steps";

export function CustomerExperience() {
  const { device } = useDevice();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CustomerState>(initialState);

  const set = useCallback(
    (p: Partial<CustomerState>) => setState((s) => ({ ...s, ...p })),
    [],
  );

  const next = useCallback(
    () => setStep((s) => Math.min(STEPS.length - 1, s + 1)),
    [],
  );
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const stepContent = useMemo(() => {
    const id = STEPS[step].id;
    switch (id) {
      case "welcome":
        return <WelcomeStep onStart={next} />;
      case "persona":
        return <PersonaStep state={state} set={set} />;
      case "goal":
        return <GoalStep state={state} set={set} />;
      case "model":
        return <ModelStep state={state} set={set} />;
      case "population":
        return <PopulationStep state={state} set={set} />;
      case "experience":
        return <ExperienceStep state={state} set={set} />;
      case "modules":
        return <ModulesStep state={state} set={set} />;
      case "quote":
        return <QuoteStep state={state} />;
      default:
        return null;
    }
  }, [step, state, set, next]);

  const props = {
    step,
    setStep,
    next,
    prev,
    state,
    stepContent,
  };

  if (device === "phone") return <CustomerPhone {...props} />;
  if (device === "tablet") return <CustomerTablet {...props} />;
  return <CustomerDesktop {...props} />;
}

type LayoutProps = {
  step: number;
  setStep: (i: number) => void;
  next: () => void;
  prev: () => void;
  state: CustomerState;
  stepContent: React.ReactNode;
};

/* ────────────── PHONE ────────────── */

function CustomerPhone({ step, next, prev, state, stepContent }: LayoutProps) {
  const isWelcome = step === 0;
  const isLast = step === STEPS.length - 1;
  return (
    <div className="flex flex-col pb-28">
      {!isWelcome && (
        <div className="sticky top-14 z-30 bg-page/80 backdrop-blur-xl border-b border-stroke px-4 py-3">
          <HorizontalStepper steps={STEPS} current={step} />
        </div>
      )}
      <div className="px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky pricing summary on flow steps */}
      {!isWelcome && !isLast && (
        <div className="px-4 mt-6">
          <PhoneStackSummary state={state} />
        </div>
      )}

      {/* Bottom action bar */}
      {!isWelcome && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-page/95 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 py-3">
            <button
              type="button"
              onClick={prev}
              className="wx-focus inline-flex h-11 w-11 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg"
              aria-label="Previous"
            >
              <ArrowLeft size={15} />
            </button>
            <GradientButton
              size="md"
              onClick={next}
              fullWidth
              iconRight={<ArrowRight size={14} />}
              disabled={isLast}
            >
              {isLast ? "Stack ready" : "Continue"}
            </GradientButton>
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneStackSummary({ state }: { state: CustomerState }) {
  const quote = useMemo(() => calcQuote(state), [state]);
  return (
    <div className="wx-card-quiet flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex flex-col">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-fg-muted">
          Live stack
        </span>
        <span className="wx-display wx-mono text-xl text-fg mt-0.5">
          ${quote.perMember}
          <span className="text-[12px] text-fg-muted ml-1">pmpm</span>
        </span>
      </div>
      <div className="flex flex-col items-end text-right">
        <span className="text-[11px] text-fg-muted">
          {state.modules.length} modules
        </span>
        <span className="text-[12px] text-fg-secondary wx-mono">
          ${quote.monthly.toLocaleString()}/mo
        </span>
      </div>
      <Sparkles size={14} className="text-wx-orange" />
    </div>
  );
}

/* ────────────── TABLET ────────────── */

function CustomerTablet({ step, setStep, next, prev, state, stepContent }: LayoutProps) {
  const isWelcome = step === 0;
  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-[260px_1fr_320px] gap-5 px-5 py-6">
      <aside className="sticky top-20 self-start">
        <div className="wx-card-quiet p-4">
          <div className="wx-eyebrow mb-3">Studio · steps</div>
          <VerticalStepper
            steps={STEPS}
            current={step}
            onStepClick={(i) => i <= step && setStep(i)}
          />
        </div>
      </aside>

      <main className="min-w-0">
        <div className="wx-card p-6 min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {stepContent}
            </motion.div>
          </AnimatePresence>

          {!isWelcome && (
            <div className="mt-6 flex items-center justify-between border-t border-rule pt-5">
              <button
                type="button"
                onClick={prev}
                className="wx-focus inline-flex h-10 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg"
              >
                <ArrowLeft size={13} /> Back
              </button>
              <GradientButton
                size="md"
                onClick={next}
                iconRight={<ArrowRight size={14} />}
                disabled={step === STEPS.length - 1}
              >
                {step === STEPS.length - 1 ? "Done" : "Continue"}
              </GradientButton>
            </div>
          )}
        </div>
      </main>

      <aside className="sticky top-20 self-start">
        <LiveStack state={state} variant="rail" />
      </aside>
    </div>
  );
}

/* ────────────── DESKTOP ────────────── */

function CustomerDesktop({ step, setStep, next, prev, state, stepContent }: LayoutProps) {
  const isWelcome = step === 0;
  return (
    <div className="mx-auto grid max-w-[1600px] grid-cols-[300px_1fr_360px] gap-6 px-8 py-8">
      <aside className="sticky top-24 self-start">
        <div className="wx-card-quiet p-5">
          <div className="wx-eyebrow mb-4">Customer Studio</div>
          <VerticalStepper
            steps={STEPS}
            current={step}
            onStepClick={(i) => i <= step && setStep(i)}
          />
        </div>
        <DesktopArchitectureMap />
      </aside>

      <main className="min-w-0">
        <div className="wx-card p-8 min-h-[640px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {stepContent}
            </motion.div>
          </AnimatePresence>

          {!isWelcome && (
            <div className="mt-8 flex items-center justify-between border-t border-rule pt-6">
              <button
                type="button"
                onClick={prev}
                className="wx-focus inline-flex h-10 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg"
              >
                <ArrowLeft size={13} /> Back
              </button>
              <GradientButton
                size="md"
                onClick={next}
                iconRight={<ArrowRight size={14} />}
                disabled={step === STEPS.length - 1}
              >
                {step === STEPS.length - 1 ? "Done" : "Continue"}
              </GradientButton>
            </div>
          )}
        </div>
      </main>

      <aside className="sticky top-24 self-start">
        <LiveStack state={state} variant="rail" />
      </aside>
    </div>
  );
}

function DesktopArchitectureMap() {
  return (
    <div className="wx-card-quiet mt-5 p-5">
      <div className="wx-eyebrow mb-3">Wellx architecture</div>
      <div className="space-y-2 text-[12px]">
        {[
          { label: "Member experience", tone: "var(--wx-orange)" },
          { label: "Care pathways", tone: "var(--wx-pink)" },
          { label: "Clinical engine", tone: "var(--wx-purple-pink)" },
          { label: "Data + insights", tone: "var(--wx-purple)" },
          { label: "Cover + commercial", tone: "var(--wx-sky)" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2.5 py-1.5"
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: row.tone, boxShadow: `0 0 12px ${row.tone}` }}
            />
            <span className="text-fg-secondary">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
