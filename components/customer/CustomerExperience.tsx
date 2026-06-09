"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useDevice } from "@/components/providers";
import { GradientButton } from "@/components/ui/GradientButton";
import {
  HorizontalStepper,
  VerticalStepper,
} from "@/components/ui/Stepper";
import {
  canAdvance,
  getSteps,
  initialLead,
  leadToPayload,
  type CustomerLead,
  type StepId,
} from "./flow";
import {
  GoalStep,
  ModulesStep,
  PeopleStep,
  ReviewStep,
  SelfEndStep,
  SourcingStep,
  SubmittedView,
  WelcomeStep,
} from "./steps";

type SubmitState =
  | { phase: "idle" }
  | { phase: "submitting" }
  | { phase: "submitted"; id?: string }
  | { phase: "error"; message: string };

export function CustomerExperience() {
  const { device } = useDevice();
  const [stepIndex, setStepIndex] = useState(0);
  const [lead, setLead] = useState<CustomerLead>(initialLead);
  const [submit, setSubmit] = useState<SubmitState>({ phase: "idle" });

  const steps = useMemo(() => getSteps(lead), [lead]);
  const safeIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeIndex];

  const set = useCallback(
    (p: Partial<CustomerLead>) => setLead((l) => ({ ...l, ...p })),
    [],
  );

  const goTo = useCallback(
    (i: number) => setStepIndex(Math.max(0, Math.min(i, steps.length - 1))),
    [steps.length],
  );

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);

  const onSubmit = useCallback(async () => {
    setSubmit({ phase: "submitting" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(leadToPayload(lead)),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? `Submission failed (${res.status})`);
      }
      setSubmit({ phase: "submitted", id: data.id });
    } catch (err) {
      setSubmit({
        phase: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }, [lead]);

  const reset = useCallback(() => {
    setLead(initialLead);
    setStepIndex(0);
    setSubmit({ phase: "idle" });
  }, []);

  // Build the step content
  const stepContent = useMemo(() => {
    if (submit.phase === "submitted") {
      return <SubmittedView onReset={reset} />;
    }
    switch (currentStep?.id) {
      case "welcome":
        return <WelcomeStep lead={lead} set={set} onNext={next} />;
      case "self-end":
        return <SelfEndStep lead={lead} />;
      case "goal":
        return <GoalStep lead={lead} set={set} />;
      case "sourcing":
        return <SourcingStep lead={lead} set={set} />;
      case "modules":
        return <ModulesStep lead={lead} set={set} />;
      case "people":
        return <PeopleStep lead={lead} set={set} />;
      case "review":
        return <ReviewStep lead={lead} set={set} />;
      default:
        return null;
    }
  }, [currentStep, lead, set, next, reset, submit.phase]);

  const layoutProps: LayoutProps = {
    steps,
    stepIndex: safeIndex,
    currentStep: currentStep?.id,
    lead,
    next,
    prev,
    goTo,
    stepContent,
    submit,
    onSubmit,
    onReset: reset,
  };

  if (device === "phone") return <CustomerPhone {...layoutProps} />;
  if (device === "tablet") return <CustomerTablet {...layoutProps} />;
  return <CustomerDesktop {...layoutProps} />;
}

type LayoutProps = {
  steps: ReturnType<typeof getSteps>;
  stepIndex: number;
  currentStep: StepId | undefined;
  lead: CustomerLead;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  stepContent: React.ReactNode;
  submit: SubmitState;
  onSubmit: () => void;
  onReset: () => void;
};

/* ────────────── Helpers ────────────── */

function ActionBar({
  steps,
  stepIndex,
  currentStep,
  lead,
  next,
  prev,
  submit,
  onSubmit,
}: {
  steps: LayoutProps["steps"];
  stepIndex: number;
  currentStep: StepId | undefined;
  lead: CustomerLead;
  next: () => void;
  prev: () => void;
  submit: SubmitState;
  onSubmit: () => void;
}) {
  const isReview = currentStep === "review";
  const isWelcome = currentStep === "welcome";
  const isSelfEnd = currentStep === "self-end";
  const isLast = stepIndex >= steps.length - 1;
  const canGo = currentStep ? canAdvance(currentStep, lead) : false;

  // self-end has only a back button
  if (isSelfEnd) {
    return (
      <button
        type="button"
        onClick={prev}
        className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg"
      >
        <ArrowLeft size={13} /> Back
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <button
        type="button"
        onClick={prev}
        disabled={isWelcome}
        className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg disabled:opacity-40 disabled:pointer-events-none"
      >
        <ArrowLeft size={13} /> Back
      </button>

      {isReview ? (
        <GradientButton
          size="md"
          onClick={onSubmit}
          disabled={!canGo || submit.phase === "submitting"}
          iconRight={<Send size={14} />}
        >
          {submit.phase === "submitting"
            ? "Sending…"
            : submit.phase === "error"
              ? "Retry"
              : "Request quote"}
        </GradientButton>
      ) : (
        <GradientButton
          size="md"
          onClick={next}
          disabled={!canGo || isLast}
          iconRight={<ArrowRight size={14} />}
        >
          Continue
        </GradientButton>
      )}
    </div>
  );
}

function ErrorBanner({ submit }: { submit: SubmitState }) {
  if (submit.phase !== "error") return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 text-[12.5px]"
      style={{
        borderColor: "rgba(224,52,91,0.4)",
        background: "rgba(224,52,91,0.06)",
        color: "var(--wx-danger)",
      }}
    >
      {submit.message}
    </div>
  );
}

/* ────────────── PHONE ────────────── */

function CustomerPhone({
  steps,
  stepIndex,
  currentStep,
  lead,
  next,
  prev,
  stepContent,
  submit,
  onSubmit,
}: LayoutProps) {
  const isWelcome = currentStep === "welcome";
  const showActions =
    currentStep !== "welcome" && submit.phase !== "submitted";

  return (
    <div className="flex flex-col pb-24">
      {!isWelcome && submit.phase !== "submitted" && (
        <div className="sticky top-14 z-30 bg-page/80 backdrop-blur-xl border-b border-stroke px-4 py-3">
          <HorizontalStepper
            steps={steps.map((s) => ({ id: s.id, label: s.label }))}
            current={stepIndex}
          />
        </div>
      )}
      <div className="px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${submit.phase}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {showActions && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke bg-page/95 backdrop-blur-xl">
          <div className="flex flex-col gap-2 px-4 py-3">
            <ErrorBanner submit={submit} />
            <ActionBar
              steps={steps}
              stepIndex={stepIndex}
              currentStep={currentStep}
              lead={lead}
              next={next}
              prev={prev}
              submit={submit}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────── TABLET ────────────── */

function CustomerTablet({
  steps,
  stepIndex,
  currentStep,
  lead,
  next,
  prev,
  goTo,
  stepContent,
  submit,
  onSubmit,
}: LayoutProps) {
  const isSubmitted = submit.phase === "submitted";
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-[260px_1fr] gap-5 px-5 py-6">
      <aside className="sticky top-20 self-start">
        <div className="wx-card-quiet p-4">
          <div className="wx-eyebrow mb-3">Customer Studio</div>
          <VerticalStepper
            steps={steps.map((s) => ({
              id: s.id,
              label: s.label,
              description: s.description,
            }))}
            current={stepIndex}
            onStepClick={(i) => i <= stepIndex && goTo(i)}
          />
        </div>
      </aside>

      <main className="min-w-0">
        <div className="wx-card p-6 min-h-[520px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${submit.phase}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {!isSubmitted && currentStep !== "welcome" && (
            <div className="mt-6 flex flex-col gap-2 border-t border-rule pt-5">
              <ErrorBanner submit={submit} />
              <ActionBar
                steps={steps}
                stepIndex={stepIndex}
                currentStep={currentStep}
                lead={lead}
                next={next}
                prev={prev}
                submit={submit}
                onSubmit={onSubmit}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ────────────── DESKTOP ────────────── */

function CustomerDesktop({
  steps,
  stepIndex,
  currentStep,
  lead,
  next,
  prev,
  goTo,
  stepContent,
  submit,
  onSubmit,
}: LayoutProps) {
  const isSubmitted = submit.phase === "submitted";
  return (
    <div className="mx-auto grid max-w-[1300px] grid-cols-[300px_1fr] gap-6 px-8 py-8">
      <aside className="sticky top-24 self-start">
        <div className="wx-card-quiet p-5">
          <div className="wx-eyebrow mb-4">Customer Studio</div>
          <VerticalStepper
            steps={steps.map((s) => ({
              id: s.id,
              label: s.label,
              description: s.description,
            }))}
            current={stepIndex}
            onStepClick={(i) => i <= stepIndex && goTo(i)}
          />
        </div>
      </aside>

      <main className="min-w-0">
        <div className="wx-card p-8 min-h-[640px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${submit.phase}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {!isSubmitted && currentStep !== "welcome" && (
            <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-6">
              <ErrorBanner submit={submit} />
              <ActionBar
                steps={steps}
                stepIndex={stepIndex}
                currentStep={currentStep}
                lead={lead}
                next={next}
                prev={prev}
                submit={submit}
                onSubmit={onSubmit}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
