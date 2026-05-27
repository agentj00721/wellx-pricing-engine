"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  Crown,
  Gauge,
  Globe2,
  Heart,
  HeartPulse,
  HelpCircle,
  Layers,
  Minus,
  Plus,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  Users2,
} from "lucide-react";
import { ChoiceTile } from "@/components/ui/ChoiceTile";
import { Eyebrow, RadialScore, StatPill } from "@/components/ui/atoms";
import { GradientButton } from "@/components/ui/GradientButton";
import { Tag } from "@/components/ui/Panel";
import {
  EXPERIENCES,
  GOALS,
  MODELS,
  MODULES,
  PERSONAS,
  calcQuote,
  type CustomerExperience,
  type CustomerGoal,
  type CustomerModel,
  type CustomerPersona,
  type CustomerState,
} from "./flow";
import { useDevice } from "@/components/providers";

const PERSONA_ICON: Record<CustomerPersona, React.ReactNode> = {
  employer: <Building2 size={18} />,
  broker: <Users2 size={18} />,
  tpa: <Layers size={18} />,
  insurer: <Shield size={18} />,
};

const MODULE_ICON: Record<string, React.ReactNode> = {
  "primary-care": <Stethoscope size={16} />,
  "mental-health": <Heart size={16} />,
  "chronic-care": <HeartPulse size={16} />,
  "executive-health": <Crown size={16} />,
  "women-health": <Heart size={16} />,
  musculoskeletal: <Gauge size={16} />,
  occupational: <Shield size={16} />,
  "global-coverage": <Globe2 size={16} />,
};

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  const { device } = useDevice();
  return (
    <div className="flex flex-col items-start gap-6 sm:gap-8">
      <Eyebrow accent="warm">Customer Studio</Eyebrow>
      <h1
        className={`wx-display ${
          device === "desktop"
            ? "text-6xl md:text-7xl"
            : device === "tablet"
              ? "text-5xl"
              : "text-4xl"
        } leading-[1.02] tracking-tight`}
      >
        Build your{" "}
        <span className="wx-gradient-text">Wellx</span>
        <br />
        stack.
      </h1>
      <p className="max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-fg-secondary">
        Compose the precise wellbeing stack your population needs — from
        primary care to executive concierge. We&apos;ll price it as you build.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <GradientButton size="lg" onClick={onStart} iconRight={<ArrowRight size={16} />}>
          Begin configuration
        </GradientButton>
        <button className="wx-focus inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stroke px-5 text-[13.5px] text-fg-secondary hover:text-fg hover:border-wx-purple/40 transition-colors">
          <HelpCircle size={14} /> What is a Wellx stack?
        </button>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl">
        <StatPill label="Modules" value="8" delta="+2 new" />
        <StatPill label="Models" value="4" />
        <StatPill label="Avg lift" value="22%" delta="+claims↓" />
        <StatPill label="Adoption" value="84%" delta="+12%" />
      </div>
    </div>
  );
}

export function PersonaStep({
  state,
  set,
}: {
  state: CustomerState;
  set: (p: Partial<CustomerState>) => void;
}) {
  return (
    <StepBody
      eyebrow="01 · About you"
      title={<>Who&apos;s building?</>}
      description="Wellx adapts the questions and pricing based on who you are."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PERSONAS.map((p) => (
          <ChoiceTile
            key={p.id}
            selected={state.persona === p.id}
            onSelect={() => set({ persona: p.id })}
            icon={PERSONA_ICON[p.id]}
            title={p.title}
            description={p.description}
          />
        ))}
      </div>
    </StepBody>
  );
}

export function GoalStep({
  state,
  set,
}: {
  state: CustomerState;
  set: (p: Partial<CustomerState>) => void;
}) {
  return (
    <StepBody
      eyebrow="02 · Primary goal"
      title={<>What matters most?</>}
      description="Pick the single outcome we should optimise for. We'll rebalance the stack."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((g) => (
          <ChoiceTile
            key={g.id}
            selected={state.goal === g.id}
            onSelect={() => set({ goal: g.id as CustomerGoal })}
            icon={<Target size={18} />}
            title={g.title}
            description={g.description}
            badge={g.accent === "warm" ? "outcomes" : "economics"}
          />
        ))}
      </div>
    </StepBody>
  );
}

export function ModelStep({
  state,
  set,
}: {
  state: CustomerState;
  set: (p: Partial<CustomerState>) => void;
}) {
  return (
    <StepBody
      eyebrow="03 · Stack foundation"
      title={<>Choose a Wellx model.</>}
      description="A starting shape. You'll fine-tune the modules in two steps."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODELS.map((m) => (
          <ChoiceTile
            key={m.id}
            selected={state.model === m.id}
            onSelect={() => set({ model: m.id as CustomerModel })}
            icon={<Sparkles size={18} />}
            title={m.title}
            description={m.description}
            badge={m.badge}
            hint={
              m.basePrice
                ? `from $${m.basePrice} pmpm`
                : "Bespoke commercial model"
            }
          />
        ))}
      </div>
    </StepBody>
  );
}

export function PopulationStep({
  state,
  set,
}: {
  state: CustomerState;
  set: (p: Partial<CustomerState>) => void;
}) {
  const profiles: { id: NonNullable<CustomerState["populationProfile"]>; label: string; desc: string }[] = [
    { id: "executive", label: "Executive", desc: "Leadership, expat, premium expectations" },
    { id: "professional", label: "Professional", desc: "Knowledge workers, hybrid teams" },
    { id: "blue-collar", label: "Frontline", desc: "Field, ops, retail, logistics" },
    { id: "mixed", label: "Mixed", desc: "Multi-segment workforce" },
  ];
  return (
    <StepBody
      eyebrow="04 · Population"
      title={<>Who&apos;s covered?</>}
      description="Size and shape of the population — drives pricing and clinical pathways."
    >
      <div className="flex flex-col gap-6">
        <div className="wx-card-quiet flex flex-col gap-4 p-5">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow accent="warm">Headcount</Eyebrow>
              <div className="wx-display text-4xl text-fg mt-2 wx-mono">
                {(state.populationSize ?? 0).toLocaleString()}
                <span className="text-fg-muted text-[14px] font-medium ml-1">members</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease"
                onClick={() =>
                  set({
                    populationSize: Math.max(
                      25,
                      (state.populationSize ?? 0) - 50,
                    ),
                  })
                }
                className="wx-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg hover:border-wx-purple/40 transition-colors"
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                aria-label="Increase"
                onClick={() =>
                  set({
                    populationSize: (state.populationSize ?? 0) + 50,
                  })
                }
                className="wx-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg hover:border-wx-purple/40 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <input
            type="range"
            min={25}
            max={10000}
            step={25}
            value={state.populationSize ?? 0}
            onChange={(e) =>
              set({ populationSize: Number(e.target.value) })
            }
            className="wx-range w-full"
            style={{
              accentColor: "var(--wx-purple)",
            }}
            aria-label="Population size"
          />
          <div className="flex items-center justify-between text-[10.5px] text-fg-muted">
            <span>25</span>
            <span>500</span>
            <span>1,500</span>
            <span>5,000</span>
            <span>10,000+</span>
          </div>
        </div>

        <div>
          <Eyebrow accent="warm" className="mb-3">
            Population profile
          </Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profiles.map((p) => (
              <ChoiceTile
                key={p.id}
                selected={state.populationProfile === p.id}
                onSelect={() => set({ populationProfile: p.id })}
                title={p.label}
                description={p.desc}
              />
            ))}
          </div>
        </div>
      </div>
    </StepBody>
  );
}

export function ExperienceStep({
  state,
  set,
}: {
  state: CustomerState;
  set: (p: Partial<CustomerState>) => void;
}) {
  return (
    <StepBody
      eyebrow="05 · Experience design"
      title={<>How should care feel?</>}
      description="Concierge, blended, or self-serve. Each shifts both cost and adoption."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EXPERIENCES.map((e) => (
          <ChoiceTile
            key={e.id}
            selected={state.experience === e.id}
            onSelect={() => set({ experience: e.id as CustomerExperience })}
            title={e.title}
            description={e.description}
            badge={
              e.id === "concierge" ? "premium" : e.id === "self-serve" ? "lean" : "balanced"
            }
          />
        ))}
      </div>
    </StepBody>
  );
}

export function ModulesStep({
  state,
  set,
}: {
  state: CustomerState;
  set: (p: Partial<CustomerState>) => void;
}) {
  const toggle = (id: string) => {
    const has = state.modules.includes(id);
    set({
      modules: has
        ? state.modules.filter((m) => m !== id)
        : [...state.modules, id],
    });
  };
  return (
    <StepBody
      eyebrow="06 · Module mix"
      title={<>Compose your stack.</>}
      description="Toggle modules on or off — pricing updates instantly on the right."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODULES.map((m) => (
          <ChoiceTile
            key={m.id}
            selected={state.modules.includes(m.id)}
            onSelect={() => toggle(m.id)}
            icon={MODULE_ICON[m.id] ?? <Layers size={16} />}
            title={m.label}
            description={m.description}
            badge={m.tier}
            hint={`+$${m.delta} pmpm`}
          />
        ))}
      </div>
    </StepBody>
  );
}

export function QuoteStep({ state }: { state: CustomerState }) {
  const quote = calcQuote(state);
  return (
    <StepBody
      eyebrow="07 · Stack quote"
      title={<>Your Wellx stack.</>}
      description="A clean snapshot. Share this with finance, your broker, or your team."
    >
      <div className="relative flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="wx-card wx-card-glow flex flex-col gap-6 p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow accent="warm">Indicative quote</Eyebrow>
              <div className="wx-display mt-3 text-5xl sm:text-6xl">
                <span className="wx-mono">${quote.perMember}</span>
                <span className="text-fg-muted text-base font-medium ml-2">
                  per member / month
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag tone="warm">
                  {MODELS.find((m) => m.id === state.model)?.title ?? "Stack"}
                </Tag>
                <Tag tone="neutral">
                  {(state.populationSize ?? 0).toLocaleString()} members
                </Tag>
                <Tag tone="cool">
                  {EXPERIENCES.find((e) => e.id === state.experience)?.title ??
                    "Experience"}
                </Tag>
              </div>
            </div>
            <RadialScore value={Math.min(100, state.modules.length * 12 + 22)} label="Stack" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill label="Monthly" value={`$${quote.monthly.toLocaleString()}`} />
            <StatPill label="Annual" value={`$${quote.annual.toLocaleString()}`} />
            <StatPill label="Modules" value={`${state.modules.length}`} delta="+core" />
            <StatPill label="Adoption proj." value="78%" delta="+12%" />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <GradientButton size="md" iconRight={<ArrowRight size={14} />}>
              Send to my team
            </GradientButton>
            <button className="wx-focus inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg hover:border-wx-purple/40">
              Export PDF
            </button>
            <button className="wx-focus inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg hover:border-wx-purple/40">
              Schedule walkthrough
            </button>
          </div>
        </motion.div>

        <div className="wx-card-quiet p-5">
          <Eyebrow accent="cool" className="mb-3">Why this price</Eyebrow>
          <div className="flex flex-col gap-3 text-[13px]">
            <Row label="Base model" value={`$${quote.base}`} />
            <Row label="Module additions" value={`+$${quote.moduleDelta}`} />
            <Row label="Experience uplift" value={state.experience === "concierge" ? "+18%" : state.experience === "blended" ? "+6%" : "−6%"} />
            <Row label="Population profile" value={state.populationProfile ?? "—"} />
          </div>
        </div>
      </div>
    </StepBody>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-rule pb-2 last:border-0">
      <span className="text-fg-secondary">{label}</span>
      <span className="text-fg wx-mono">{value}</span>
    </div>
  );
}

function StepBody({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Eyebrow accent="warm">{eyebrow}</Eyebrow>
        <h2 className="wx-display text-2xl sm:text-3xl text-fg">{title}</h2>
        {description ? (
          <p className="text-[14px] text-fg-secondary max-w-xl">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
