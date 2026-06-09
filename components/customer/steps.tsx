"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Heart,
  Info,
  Mail,
  ShieldCheck,
  Sparkles,
  User2,
  Users2,
} from "lucide-react";
import { ChoiceTile } from "@/components/ui/ChoiceTile";
import { Eyebrow, StatPill } from "@/components/ui/atoms";
import { Tag } from "@/components/ui/Panel";
import { GradientButton } from "@/components/ui/GradientButton";
import {
  ADD_ON_MODULES,
  GOALS,
  INSURERS,
  type CustomerLead,
  type InsurerId,
  type SourcingMethod,
} from "./flow";
import { useDevice } from "@/components/providers";

/* ────────────── Welcome (persona) ────────────── */

export function WelcomeStep({
  lead,
  set,
  onNext,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
  onNext: () => void;
}) {
  const { device } = useDevice();
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <Eyebrow accent="warm">Customer Studio</Eyebrow>
        <h1
          className={`wx-display ${
            device === "desktop"
              ? "text-5xl md:text-6xl"
              : device === "tablet"
                ? "text-5xl"
                : "text-4xl"
          } leading-[1.02] tracking-tight`}
        >
          Get started with{" "}
          <span className="wx-gradient-text">Wellx</span>.
        </h1>
        <p className="max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-fg-secondary">
          A two-question start. Tell us who Wellx is for, and we&rsquo;ll
          shape the rest around that.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ChoiceTile
          selected={lead.forWho === "self"}
          onSelect={() => set({ forWho: "self" })}
          icon={<User2 size={18} />}
          title="I want Wellx for myself"
          description="I'm exploring Wellx for me as an individual."
        />
        <ChoiceTile
          selected={lead.forWho === "team"}
          onSelect={() => set({ forWho: "team" })}
          icon={<Users2 size={18} />}
          title="I want Wellx for my team"
          description="I'm building or refreshing wellbeing for the people I work with."
          badge="B2B"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <GradientButton
          size="lg"
          onClick={onNext}
          iconRight={<ArrowRight size={16} />}
          disabled={!lead.forWho}
        >
          {lead.forWho === "self"
            ? "Continue"
            : lead.forWho === "team"
              ? "Begin the brief"
              : "Choose a path"}
        </GradientButton>
      </div>
    </div>
  );
}

/* ────────────── Self path — terminal ────────────── */

export function SelfEndStep({ lead }: { lead: CustomerLead }) {
  void lead;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Eyebrow accent="warm">Wellx for individuals</Eyebrow>
        <h2 className="wx-display text-3xl sm:text-4xl text-fg leading-[1.05]">
          We don&rsquo;t sell{" "}
          <span className="wx-gradient-text-warm">Wellx</span> direct to you
          &mdash; yet.
        </h2>
        <p className="text-[14.5px] leading-relaxed text-fg-secondary max-w-xl">
          Wellx is currently delivered through employers and insurers, not
          individual subscriptions. The fastest way for you to get it is to
          point your HR or benefits team to us.
        </p>
      </div>

      <div className="wx-card-quiet p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{
              background: "var(--wx-gradient-warm)",
              boxShadow: "0 6px 22px var(--wx-glow-shadow-warm)",
            }}
          >
            <Mail size={15} className="text-white" />
          </span>
          <div className="flex flex-col gap-1">
            <Eyebrow>Ask your HR to get in touch</Eyebrow>
            <p className="text-[13.5px] text-fg leading-relaxed">
              Forward this short note to your HR or People team and we&rsquo;ll
              take it from there.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-rule bg-card-elev p-4">
          <p className="text-[13px] text-fg-secondary leading-relaxed">
            &ldquo;Hi &mdash; I&rsquo;ve been looking at{" "}
            <span className="text-fg font-medium">Wellx</span> as a wellbeing
            layer for our team. Could you reach out to them at{" "}
            <span className="text-fg font-medium wx-mono">
              hello@wellx.ai
            </span>{" "}
            to explore what it would look like for us?&rdquo;
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="mailto:hello@wellx.ai?subject=Wellx%20for%20our%20team"
          className="wx-focus inline-flex h-11 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg hover:border-wx-purple/40"
        >
          <Mail size={14} /> Email Wellx
        </a>
      </div>
    </div>
  );
}

/* ────────────── Goal ────────────── */

export function GoalStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  return (
    <StepBody
      eyebrow="01 · Your goal"
      title={<>What matters most?</>}
      description="Pick the single outcome we should optimise for. We use this to shape what we recommend."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((g) => (
          <ChoiceTile
            key={g.id}
            selected={lead.goal === g.id}
            onSelect={() => set({ goal: g.id })}
            icon={g.id === "know-team" ? <Heart size={18} /> : <Sparkles size={18} />}
            title={g.title}
            description={g.description}
            badge={g.id === "know-team" ? "Behavioural" : undefined}
          />
        ))}
      </div>
    </StepBody>
  );
}

/* ────────────── Sourcing (insurer vs direct + insurer picker) ────────────── */

export function SourcingStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  const insurer = lead.insurer
    ? INSURERS.find((i) => i.id === lead.insurer)
    : undefined;

  return (
    <StepBody
      eyebrow="02 · Sourcing"
      title={<>How would you bring Wellx in?</>}
      description="Either embed it into your existing insurance with one of our partners, or buy it from us directly."
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ChoiceTile
            selected={lead.sourcing === "insurer"}
            onSelect={() =>
              set({ sourcing: "insurer" as SourcingMethod })
            }
            icon={<ShieldCheck size={18} />}
            title="Through my insurer"
            description="We have arrangements with several regional insurers — Wellx embeds into your renewal."
          />
          <ChoiceTile
            selected={lead.sourcing === "direct"}
            onSelect={() => set({ sourcing: "direct" as SourcingMethod })}
            icon={<Sparkles size={18} />}
            title="Buy direct from Wellx"
            description="We work with you straight — no insurer needed in the middle."
          />
        </div>

        {lead.sourcing === "insurer" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Eyebrow accent="cool">Which insurer?</Eyebrow>
              <p className="text-[12.5px] text-fg-muted">
                Pick yours — or &ldquo;Other&rdquo; if it&rsquo;s not on the
                list.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INSURERS.map((i) => {
                const active = lead.insurer === i.id;
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() =>
                      set({ insurer: i.id as InsurerId })
                    }
                    className={`wx-focus rounded-xl border px-3 py-3 text-left transition-colors ${
                      active
                        ? "border-transparent text-white"
                        : "border-stroke bg-card text-fg-secondary hover:text-fg hover:border-wx-purple/40"
                    }`}
                    style={
                      active
                        ? {
                            background: "var(--wx-gradient-warm)",
                            boxShadow:
                              "0 8px 24px var(--wx-glow-shadow-warm)",
                          }
                        : undefined
                    }
                  >
                    <div className="text-[12.5px] font-semibold leading-tight">
                      {i.short}
                    </div>
                    <div
                      className={`text-[10.5px] mt-0.5 ${
                        active ? "text-white/80" : "text-fg-muted"
                      }`}
                    >
                      {i.label === i.short ? i.id === "other" ? "Not in the list" : "" : i.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Conditional message for arranged insurers */}
            {insurer && insurer.arranged && (
              <InfoBlock
                tone="success"
                title={`We're partnered with ${insurer.short}.`}
                body={
                  <>
                    Ask your broker to embed Wellx in your renewal &mdash;
                    or you can also buy from us directly. Click{" "}
                    <strong className="text-fg">Continue</strong> when
                    ready.
                  </>
                }
              />
            )}

            {/* Other insurer flow */}
            {insurer?.id === "other" && (
              <div className="flex flex-col gap-4">
                <InfoBlock
                  tone="warning"
                  title="We don't have an arrangement with them yet."
                  body={
                    <>
                      Share a few details and we&rsquo;ll work with your
                      broker or insurer to make it happen. Or click{" "}
                      <strong className="text-fg">Continue</strong> to buy
                      direct.
                    </>
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextField
                    label="Insurer name"
                    value={lead.insurerOtherName ?? ""}
                    onChange={(v) => set({ insurerOtherName: v })}
                    placeholder="e.g. Sukoon"
                  />
                  <TextField
                    label="Company name"
                    value={lead.companyName ?? ""}
                    onChange={(v) => set({ companyName: v })}
                    placeholder="Your company"
                  />
                  <TextField
                    label="Broker name"
                    value={lead.brokerName ?? ""}
                    onChange={(v) => set({ brokerName: v })}
                    placeholder="Broker firm + person"
                  />
                  <TextField
                    label="Broker contact"
                    value={lead.brokerContact ?? ""}
                    onChange={(v) => set({ brokerContact: v })}
                    placeholder="Email or phone"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {lead.sourcing === "direct" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InfoBlock
              tone="info"
              title="You'll work with Wellx directly."
              body="No middlemen. We'll shape your stack with you and price it directly."
            />
          </motion.div>
        )}
      </div>
    </StepBody>
  );
}

/* ────────────── Modules ────────────── */

export function ModulesStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  const toggle = (id: string) => {
    const has = lead.addOnModules.includes(id);
    set({
      addOnModules: has
        ? lead.addOnModules.filter((m) => m !== id)
        : [...lead.addOnModules, id],
    });
  };

  return (
    <StepBody
      eyebrow="03 · Wellx for business"
      title={<>The standard stack &mdash; plus anything else?</>}
      description="Every Wellx for Business engagement comes with our standard offering. Pick any add-on modules you want on top — multi-select."
    >
      <div className="flex flex-col gap-6">
        <div
          className="wx-card-quiet p-4 flex items-start gap-3"
          style={{
            borderColor: "transparent",
            backgroundImage:
              "linear-gradient(135deg, rgba(251,155,53,0.06), rgba(132,49,203,0.06))",
          }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{
              background: "var(--wx-gradient-warm)",
              boxShadow: "0 4px 18px var(--wx-glow-shadow-warm)",
            }}
          >
            <Sparkles size={15} className="text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-fg">
                Standard Wellx for Business
              </span>
              <Tag tone="warm">Included</Tag>
            </div>
            <p className="mt-1 text-[12.5px] text-fg-secondary leading-relaxed">
              The full Wellx wellbeing app, behavioural engine, and the
              insights layer your HR team needs &mdash; included with every
              business engagement.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Eyebrow accent="warm">Add-on modules</Eyebrow>
            <span className="text-[11px] text-fg-muted">
              {lead.addOnModules.length} selected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADD_ON_MODULES.filter((m) => m.available).map((m) => (
              <ChoiceTile
                key={m.id}
                selected={lead.addOnModules.includes(m.id)}
                onSelect={() => toggle(m.id)}
                title={m.label}
                description={m.description}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Eyebrow accent="cool">Coming soon</Eyebrow>
            <Tag tone="neutral">Tell us if you&rsquo;d want these</Tag>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADD_ON_MODULES.filter((m) => !m.available).map((m) => (
              <ComingSoonTile
                key={m.id}
                title={m.label}
                description={m.description}
                interested={lead.addOnModules.includes(m.id)}
                onToggle={() => toggle(m.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </StepBody>
  );
}

function ComingSoonTile({
  title,
  description,
  interested,
  onToggle,
}: {
  title: string;
  description: string;
  interested?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`wx-focus group relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-colors ${
        interested
          ? "border-wx-purple/50"
          : "border-dashed border-stroke hover:border-wx-purple/40"
      }`}
      style={
        interested
          ? {
              background:
                "linear-gradient(135deg, rgba(132,49,203,0.06), transparent)",
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-[13.5px] font-semibold text-fg">{title}</span>
        <Tag tone="neutral">Soon</Tag>
      </div>
      <p className="text-[12px] leading-relaxed text-fg-secondary">
        {description}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-[11.5px] text-fg-muted">
        {interested ? (
          <>
            <CheckCircle2 size={12} className="text-wx-purple" /> You&rsquo;re
            on the list
          </>
        ) : (
          <>Tap to register interest</>
        )}
      </div>
    </button>
  );
}

/* ────────────── People ────────────── */

export function PeopleStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  const missingInsurer =
    lead.sourcing === "insurer" &&
    (!lead.insurer ||
      (lead.insurer === "other" && !lead.brokerName?.trim()));
  return (
    <StepBody
      eyebrow="04 · Your people"
      title={<>Who&rsquo;s in your population?</>}
      description="We match the census of the covered population. Include employees and dependants — Wellx covers the whole household."
    >
      <div className="flex flex-col gap-6">
        <div className="wx-card-quiet p-5 flex flex-col gap-4">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <Eyebrow accent="warm">Total people (incl. dependants)</Eyebrow>
              <div className="wx-display text-4xl text-fg mt-2 wx-mono">
                {(lead.totalPeople ?? 0).toLocaleString()}
                <span className="text-fg-muted text-[14px] font-medium ml-1">
                  people
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NumberStepper
                value={lead.totalPeople}
                onChange={(v) => set({ totalPeople: clamp(v, 10, 10000) })}
                step={10}
              />
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={10000}
            step={10}
            value={lead.totalPeople}
            onChange={(e) =>
              set({ totalPeople: clamp(Number(e.target.value), 10, 10000) })
            }
            className="w-full"
            style={{ accentColor: "var(--wx-purple)" }}
            aria-label="Total people"
          />
          <div className="flex items-center justify-between text-[10.5px] text-fg-muted">
            <span>10</span>
            <span>500</span>
            <span>1,500</span>
            <span>5,000</span>
            <span>10,000</span>
          </div>
        </div>

        <div>
          <Eyebrow accent="warm" className="mb-3">
            Rough split (optional)
          </Eyebrow>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Employees"
              icon={<Briefcase size={14} className="text-fg-muted" />}
              value={lead.employeeCount}
              onChange={(v) => set({ employeeCount: v })}
              placeholder="—"
            />
            <NumberField
              label="Dependants"
              icon={<Heart size={14} className="text-fg-muted" />}
              value={lead.dependantCount}
              onChange={(v) => set({ dependantCount: v })}
              placeholder="—"
            />
          </div>
          {(lead.employeeCount ?? 0) + (lead.dependantCount ?? 0) > 0 &&
            (lead.employeeCount ?? 0) + (lead.dependantCount ?? 0) !==
              lead.totalPeople && (
              <p className="mt-2 text-[11.5px] text-[color:var(--wx-orange)]">
                Heads-up: employees + dependants ={" "}
                {(
                  (lead.employeeCount ?? 0) + (lead.dependantCount ?? 0)
                ).toLocaleString()}{" "}
                — doesn&rsquo;t match {lead.totalPeople.toLocaleString()}.
                You can leave them as ranges; the Wellx team will reconcile.
              </p>
            )}
        </div>

        {/* Capture insurer/broker if missed at sourcing step */}
        {missingInsurer && (
          <div className="wx-card-quiet p-5 flex flex-col gap-3">
            <Eyebrow accent="cool">One more thing</Eyebrow>
            <p className="text-[12.5px] text-fg-secondary">
              We didn&rsquo;t capture your insurer or broker earlier &mdash;
              please add them here so we can route your request properly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Company name"
                value={lead.companyName ?? ""}
                onChange={(v) => set({ companyName: v })}
                placeholder="Your company"
              />
              <TextField
                label="Insurer"
                value={lead.insurerOtherName ?? ""}
                onChange={(v) => set({ insurerOtherName: v })}
                placeholder="If you have one"
              />
              <TextField
                label="Broker name"
                value={lead.brokerName ?? ""}
                onChange={(v) => set({ brokerName: v })}
                placeholder="Broker firm + person"
              />
              <TextField
                label="Broker contact"
                value={lead.brokerContact ?? ""}
                onChange={(v) => set({ brokerContact: v })}
                placeholder="Email or phone"
              />
            </div>
          </div>
        )}
      </div>
    </StepBody>
  );
}

/* ────────────── Review ────────────── */

export function ReviewStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  const goal = GOALS.find((g) => g.id === lead.goal);
  const insurer = lead.insurer
    ? INSURERS.find((i) => i.id === lead.insurer)
    : null;
  return (
    <StepBody
      eyebrow="05 · Review &amp; submit"
      title={<>Almost done.</>}
      description="Review what you've shared. The Wellx team will pick this up and come back with pricing and a tailored proposal."
    >
      <div className="flex flex-col gap-5">
        <div className="wx-card-quiet p-5">
          <Eyebrow accent="warm" className="mb-3">Your brief</Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            <ReviewRow label="Goal" value={goal?.title ?? "—"} />
            <ReviewRow
              label="Sourcing"
              value={
                lead.sourcing === "direct"
                  ? "Buy direct from Wellx"
                  : insurer
                    ? `Through ${insurer.short}`
                    : "—"
              }
            />
            <ReviewRow
              label="Company"
              value={lead.companyName ?? "—"}
            />
            <ReviewRow
              label="Broker"
              value={lead.brokerName ?? "—"}
            />
            <ReviewRow
              label="Total people"
              value={lead.totalPeople.toLocaleString()}
            />
            <ReviewRow
              label="Employees / Dependants"
              value={`${lead.employeeCount ?? "—"} / ${lead.dependantCount ?? "—"}`}
            />
            <ReviewRow
              label="Add-on modules"
              value={
                lead.addOnModules.length
                  ? `${lead.addOnModules.length} selected`
                  : "None"
              }
              wide
            />
          </div>
        </div>

        <div className="wx-card-quiet p-5 flex flex-col gap-4">
          <Eyebrow accent="warm">Where should we send the proposal?</Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Your name"
              value={lead.contactName ?? ""}
              onChange={(v) => set({ contactName: v })}
              placeholder="First Last"
              required
            />
            <TextField
              label="Work email"
              value={lead.contactEmail ?? ""}
              onChange={(v) => set({ contactEmail: v })}
              placeholder="you@company.com"
              type="email"
              required
            />
            <TextField
              label="Your role"
              value={lead.contactRole ?? ""}
              onChange={(v) => set({ contactRole: v })}
              placeholder="e.g. Head of People"
            />
            <TextField
              label="Company (if different)"
              value={lead.companyName ?? ""}
              onChange={(v) => set({ companyName: v })}
              placeholder="Your company"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Eyebrow>Anything else?</Eyebrow>
            <textarea
              value={lead.notes ?? ""}
              onChange={(e) => set({ notes: e.target.value })}
              placeholder="Optional — context, timing, anything we should know."
              rows={3}
              className="wx-focus w-full resize-none rounded-xl border border-stroke bg-card-elev px-3 py-2.5 text-[13.5px] text-fg outline-none placeholder:text-fg-muted"
            />
          </div>
        </div>
      </div>
    </StepBody>
  );
}

/* ────────────── Submitted (success) ────────────── */

export function SubmittedView({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 max-w-xl">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          background: "var(--wx-gradient-warm)",
          boxShadow: "0 12px 36px var(--wx-glow-shadow-warm)",
        }}
      >
        <CheckCircle2 size={24} className="text-white" />
      </div>
      <Eyebrow accent="warm">Brief received</Eyebrow>
      <h2 className="wx-display text-3xl sm:text-4xl text-fg leading-[1.05]">
        Thanks &mdash; the{" "}
        <span className="wx-gradient-text">Wellx team</span> is on it.
      </h2>
      <p className="text-[15px] leading-relaxed text-fg-secondary">
        We&rsquo;ve logged your brief. A Wellx team member will apply
        pricing from our preset grid and come back to you with a tailored
        proposal within two working days.
      </p>
      <div className="grid grid-cols-2 gap-2 w-full max-w-md">
        <StatPill label="Typical response" value="< 2 days" />
        <StatPill label="Next step" value="Pricing review" delta="+team" />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="wx-focus inline-flex h-10 items-center gap-2 rounded-full border border-stroke px-4 text-[13px] text-fg-secondary hover:text-fg hover:border-wx-purple/40"
      >
        Submit another brief
      </button>
    </div>
  );
}

/* ────────────── Shared bits ────────────── */

export function StepBody({
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
        <h2 className="wx-display text-2xl sm:text-3xl text-fg leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-[14px] text-fg-secondary max-w-2xl leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  wide,
}: {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-b border-rule py-2 last:border-0 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <span className="text-[12px] text-fg-muted">{label}</span>
      <span className="text-[13px] text-fg text-right">{value}</span>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>
        {label}
        {required ? <span className="text-wx-orange">*</span> : null}
      </Eyebrow>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="wx-focus w-full rounded-xl border border-stroke bg-card-elev px-3 py-2.5 text-[13.5px] text-fg outline-none placeholder:text-fg-muted"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>{label}</Eyebrow>
      <div className="flex items-center gap-2 rounded-xl border border-stroke bg-card-elev px-3 py-2.5">
        {icon}
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? undefined : Math.max(0, Number(v)));
          }}
          placeholder={placeholder}
          className="wx-focus flex-1 bg-transparent text-[13.5px] text-fg outline-none placeholder:text-fg-muted wx-mono"
        />
      </div>
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  step = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(value - step)}
        className="wx-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg hover:border-wx-purple/40"
      >
        −
      </button>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + step)}
        className="wx-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-fg-secondary hover:text-fg hover:border-wx-purple/40"
      >
        +
      </button>
    </div>
  );
}

function InfoBlock({
  tone,
  title,
  body,
}: {
  tone: "info" | "warning" | "success";
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  const toneStyle: Record<typeof tone, { border: string; bg: string; color: string }> = {
    info: {
      border: "rgba(53,197,252,0.4)",
      bg: "rgba(53,197,252,0.06)",
      color: "var(--wx-sky)",
    },
    warning: {
      border: "rgba(251,155,53,0.4)",
      bg: "rgba(251,155,53,0.06)",
      color: "var(--wx-orange)",
    },
    success: {
      border: "rgba(132,49,203,0.35)",
      bg: "rgba(132,49,203,0.06)",
      color: "var(--wx-purple)",
    },
  } as const;
  const s = toneStyle[tone];
  return (
    <div
      className="flex gap-3 rounded-xl border p-4"
      style={{ borderColor: s.border, background: s.bg }}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${s.color}22`, color: s.color }}
      >
        {tone === "success" ? (
          <ShieldCheck size={14} />
        ) : tone === "warning" ? (
          <Building2 size={14} />
        ) : (
          <Info size={14} />
        )}
      </span>
      <div className="flex flex-col gap-1">
        <div className="text-[13.5px] font-semibold text-fg">{title}</div>
        <div className="text-[12.5px] text-fg-secondary leading-relaxed">
          {body}
        </div>
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
