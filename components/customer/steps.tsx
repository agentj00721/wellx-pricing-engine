"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Globe2,
  Heart,
  Info,
  Mail,
  Repeat,
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
  COUNTRIES,
  GOALS,
  hasBrokerArrangements,
  hasInsurerArrangements,
  INSURERS,
  isValidEmail,
  isValidPhone,
  KSA_BROKERS,
  type Country,
  type CustomerLead,
  type InsurerId,
  type KsaBrokerId,
  type SourcingMethod,
} from "./flow";
import { useDevice } from "@/components/providers";
import {
  calcIndicativeMonthly,
  DEFAULT_PRICING,
  fmtPrice,
  priceForAddOn,
  type PricingConfig,
} from "@/lib/pricing";

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

/* ────────────── Self path — contact capture ────────────── */

export function SelfContactStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  return (
    <StepBody
      eyebrow="About you"
      title={<>Let&rsquo;s get you on the list.</>}
      description="A few quick details so we can keep you posted — and help your HR team bring Wellx to your company in the meantime."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Your name"
          value={lead.contactName ?? ""}
          onChange={(v) => set({ contactName: v })}
          placeholder="First Last"
          required
        />
        <TextField
          label="Where you work"
          value={lead.companyName ?? ""}
          onChange={(v) => set({ companyName: v })}
          placeholder="Your company"
          required
        />
        <EmailField
          label="Your email"
          value={lead.contactEmail ?? ""}
          onChange={(v) => set({ contactEmail: v })}
          placeholder="you@example.com"
          required
        />
        <PhoneField
          label="Your phone (optional)"
          value={lead.contactPhone ?? ""}
          onChange={(v) => set({ contactPhone: v })}
          placeholder="+971 50 123 4567"
        />
        <EmailField
          label="Your HR contact's email (optional)"
          value={lead.hrContactEmail ?? ""}
          onChange={(v) => set({ hrContactEmail: v })}
          placeholder="hr@yourcompany.com"
        />
      </div>
      <p className="text-[12px] text-fg-muted">
        If you share your HR contact, we&rsquo;ll pre-fill an email you can
        forward on the next screen.
      </p>
    </StepBody>
  );
}

/* ────────────── Self path — terminal with mailto + copy ────────────── */

export function SelfEndStep({ lead }: { lead: CustomerLead }) {
  const firstName = (lead.contactName ?? "").trim().split(/\s+/)[0] ?? "";
  const company = lead.companyName?.trim() ?? "our company";
  const personal = firstName ? `, ${firstName}` : "";

  const templateText = `Hi,

I came across Wellx — it's a wellbeing platform that companies bring in for their teams. There's an app for people, an HR portal for the benefits team, and a behavioural layer that ties it together.

I'd love for us to consider it for ${company}. Could you reach out to them at hello@wellxai.com to explore what it would look like for us?

Thanks${personal}`;

  const subject = `Bringing Wellx to ${company}`;
  const to = lead.hrContactEmail?.trim() ?? "";
  const cc = "hello@wellxai.com";
  const mailtoHref =
    `mailto:${encodeURIComponent(to)}` +
    `?cc=${encodeURIComponent(cc)}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(templateText)}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Eyebrow accent="warm">Wellx for individuals</Eyebrow>
        <h2 className="wx-display text-3xl sm:text-4xl text-fg leading-[1.05]">
          Thanks{firstName ? `, ${firstName}` : ""} &mdash; you&rsquo;re on
          our list.
        </h2>
        <p className="text-[14.5px] leading-relaxed text-fg-secondary max-w-xl">
          We&rsquo;re not selling Wellx to individuals just yet &mdash; right
          now we work through companies. As soon as Wellx is available for
          individuals, we&rsquo;ll be in touch. In the meantime, the fastest
          way to bring Wellx to you is to forward a quick note to your HR
          team.
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
            <Eyebrow>For your HR team</Eyebrow>
            <p className="text-[13.5px] text-fg leading-relaxed">
              Send this to your HR or People team
              {lead.hrContactEmail ? ` (we'll pre-fill ${lead.hrContactEmail})` : ""}
              .
            </p>
          </div>
        </div>

        <CopyableTemplate text={templateText} />

        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={mailtoHref}
            className="wx-focus inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13.5px] font-medium text-white"
            style={{
              background: "var(--wx-gradient-warm)",
              boxShadow: "0 10px 30px var(--wx-glow-shadow-warm)",
            }}
          >
            <Mail size={14} /> Open in email
          </a>
        </div>
      </div>
    </div>
  );
}

function CopyableTemplate({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative rounded-xl border border-rule bg-card-elev p-4">
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy template"
        className="wx-focus absolute top-2.5 right-2.5 inline-flex h-7 items-center gap-1 rounded-full border border-stroke bg-card/90 px-2.5 text-[11px] font-medium text-fg-secondary hover:text-fg hover:border-wx-purple/40 transition-colors"
      >
        {copied ? (
          <>
            <Check size={11} className="text-[color:var(--wx-success)]" />
            Copied
          </>
        ) : (
          <>
            <Copy size={11} /> Copy
          </>
        )}
      </button>
      <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-fg-secondary font-sans m-0 pr-16">
        {text}
      </pre>
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
      eyebrow="01 · Your goals"
      title={<>What matters most?</>}
      description="Pick everything that resonates — we use this to shape what we recommend. Multi-select."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((g) => {
          const selected = lead.goals.includes(g.id);
          return (
            <ChoiceTile
              key={g.id}
              selected={selected}
              onSelect={() =>
                set({
                  goals: selected
                    ? lead.goals.filter((id) => id !== g.id)
                    : [...lead.goals, g.id],
                })
              }
              icon={
                g.id === "know-team" ? (
                  <Heart size={18} />
                ) : g.id === "change-provider" ? (
                  <Repeat size={18} />
                ) : (
                  <Sparkles size={18} />
                )
              }
              title={g.title}
              description={g.description}
              badge={g.badge}
              badgeTone={g.featured ? "warm" : "neutral"}
            />
          );
        })}
      </div>
    </StepBody>
  );
}

/* ────────────── Sourcing (country + channel + conditional partners) ────────────── */

export function SourcingStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  return (
    <StepBody
      eyebrow="02 · Sourcing"
      title={<>How would you bring Wellx in?</>}
      description="Where you are decides what's available. Pick a country first, then pick the channel that fits."
    >
      <div className="flex flex-col gap-6">
        {/* Country picker */}
        <div className="flex flex-col gap-3">
          <Eyebrow accent="warm">
            <Globe2 size={11} /> Where are you based?
          </Eyebrow>
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.map((c) => {
              const active = lead.country === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    // Reset sourcing-specific selections if the country changes
                    if (lead.country !== c.id) {
                      set({
                        country: c.id as Country,
                        insurer: undefined,
                        ksaBroker: undefined,
                        insurerOtherName: undefined,
                      });
                    }
                  }}
                  className={`wx-focus rounded-xl border px-3 py-3 text-left transition-colors ${
                    active
                      ? "border-transparent text-white"
                      : "border-stroke bg-card text-fg-secondary hover:text-fg hover:border-wx-purple/40"
                  }`}
                  style={
                    active
                      ? {
                          background: "var(--wx-gradient-warm)",
                          boxShadow: "0 8px 24px var(--wx-glow-shadow-warm)",
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="text-[12.5px] font-semibold leading-tight">
                      {c.id === "uae"
                        ? "UAE"
                        : c.id === "ksa"
                          ? "Saudi"
                          : "Philippines"}
                    </span>
                  </div>
                  <div
                    className={`text-[10.5px] mt-1 ${
                      active ? "text-white/80" : "text-fg-muted"
                    }`}
                  >
                    {c.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Channel picker */}
        {lead.country && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <Eyebrow accent="warm">Which channel?</Eyebrow>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ChoiceTile
                selected={lead.sourcing === "insurer"}
                onSelect={() =>
                  set({ sourcing: "insurer" as SourcingMethod })
                }
                icon={<ShieldCheck size={16} />}
                title="Through my insurer"
                description="Embed Wellx alongside your existing health plan."
              />
              <ChoiceTile
                selected={lead.sourcing === "broker"}
                onSelect={() =>
                  set({ sourcing: "broker" as SourcingMethod })
                }
                icon={<Users2 size={16} />}
                title="Through a broker"
                description="Your broker handles plan design — they bring Wellx in."
              />
              <ChoiceTile
                selected={lead.sourcing === "direct"}
                onSelect={() => set({ sourcing: "direct" as SourcingMethod })}
                icon={<Sparkles size={16} />}
                title="Buy direct from Wellx"
                description="We work with you straight — no one else in the middle."
              />
            </div>
          </motion.div>
        )}

        {/* Conditional details: insurer channel */}
        {lead.country && lead.sourcing === "insurer" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {hasInsurerArrangements(lead.country) ? (
              <InsurerPicker lead={lead} set={set} />
            ) : (
              <FreeEntryInsurer lead={lead} set={set} country={lead.country} />
            )}
          </motion.div>
        )}

        {/* Conditional details: broker channel */}
        {lead.country && lead.sourcing === "broker" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {hasBrokerArrangements(lead.country) ? (
              <KsaBrokerPicker lead={lead} set={set} />
            ) : (
              <FreeEntryBroker lead={lead} set={set} country={lead.country} />
            )}
          </motion.div>
        )}

        {/* Direct: just the standard message */}
        {lead.country && lead.sourcing === "direct" && (
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

/** UAE insurer picker (QIC, Liva, DNI, Salama, ADNT, Other). */
function InsurerPicker({
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
    <>
      <div className="flex flex-col gap-2">
        <Eyebrow accent="cool">Which insurer?</Eyebrow>
        <p className="text-[12.5px] text-fg-muted">
          Pick yours &mdash; or &ldquo;Other&rdquo; if it&rsquo;s not on
          the list.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INSURERS.map((i) => {
          const active = lead.insurer === i.id;
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => set({ insurer: i.id as InsurerId })}
              className={`wx-focus rounded-xl border px-3 py-3 text-left transition-colors ${
                active
                  ? "border-transparent text-white"
                  : "border-stroke bg-card text-fg-secondary hover:text-fg hover:border-wx-purple/40"
              }`}
              style={
                active
                  ? {
                      background: "var(--wx-gradient-warm)",
                      boxShadow: "0 8px 24px var(--wx-glow-shadow-warm)",
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
                {i.label === i.short
                  ? i.id === "other"
                    ? "Not in the list"
                    : ""
                  : i.label}
              </div>
            </button>
          );
        })}
      </div>

      {insurer && insurer.arranged && (
        <>
          <InfoBlock
            tone="success"
            title={`We're partnered with ${insurer.short}.`}
            body={
              <>
                You can ask your broker to embed Wellx in your renewal, or
                click <strong className="text-fg">Next</strong> to continue
                your journey directly with us.
              </>
            }
          />
          <BrokerFields lead={lead} set={set} requireAll={false} />
          <Checkbox
            checked={!!lead.authorizeWellxContact}
            onChange={(v) => set({ authorizeWellxContact: v })}
            label={
              <>
                Please connect with my insurer / broker to see if they can
                embed Wellx in our plans &mdash; I authorise Wellx to speak
                on our behalf.
              </>
            }
          />
        </>
      )}

      {insurer?.id === "other" && (
        <>
          <InfoBlock
            tone="warning"
            title="We don't have an arrangement with them yet."
            body={
              <>
                Share a few details and we&rsquo;ll work with your broker
                or insurer to make it happen. Or click{" "}
                <strong className="text-fg">Next</strong> to buy direct.
              </>
            }
          />
          <TextField
            label="Insurer name"
            value={lead.insurerOtherName ?? ""}
            onChange={(v) => set({ insurerOtherName: v })}
            placeholder="e.g. Sukoon"
            required
          />
          <BrokerFields lead={lead} set={set} requireAll />
        </>
      )}
    </>
  );
}

/** Insurer channel, country without a partner network. */
function FreeEntryInsurer({
  lead,
  set,
  country,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
  country: Country;
}) {
  const label = country === "ksa" ? "Saudi Arabia" : "the Philippines";
  return (
    <>
      <InfoBlock
        tone="warning"
        title={`We don't have insurer arrangements in ${label} yet.`}
        body="Share their details and we'll work with them to see if we can embed Wellx."
      />
      <TextField
        label="Insurer name"
        value={lead.insurerOtherName ?? ""}
        onChange={(v) => set({ insurerOtherName: v })}
        placeholder="Your insurer"
        required
      />
      <BrokerFields lead={lead} set={set} requireAll={false} />
    </>
  );
}

/** KSA broker picker (Elite, Marsh, Other). */
function KsaBrokerPicker({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  const broker = lead.ksaBroker
    ? KSA_BROKERS.find((b) => b.id === lead.ksaBroker)
    : undefined;
  return (
    <>
      <div className="flex flex-col gap-2">
        <Eyebrow accent="cool">Which broker?</Eyebrow>
        <p className="text-[12.5px] text-fg-muted">
          Pick yours &mdash; or &ldquo;Other&rdquo; if it&rsquo;s not on
          the list.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {KSA_BROKERS.map((b) => {
          const active = lead.ksaBroker === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => set({ ksaBroker: b.id as KsaBrokerId })}
              className={`wx-focus rounded-xl border px-3 py-3 text-left transition-colors ${
                active
                  ? "border-transparent text-white"
                  : "border-stroke bg-card text-fg-secondary hover:text-fg hover:border-wx-purple/40"
              }`}
              style={
                active
                  ? {
                      background: "var(--wx-gradient-warm)",
                      boxShadow: "0 8px 24px var(--wx-glow-shadow-warm)",
                    }
                  : undefined
              }
            >
              <div className="text-[12.5px] font-semibold leading-tight">
                {b.short}
              </div>
              <div
                className={`text-[10.5px] mt-0.5 ${
                  active ? "text-white/80" : "text-fg-muted"
                }`}
              >
                {b.id === "other" ? "Not in the list" : ""}
              </div>
            </button>
          );
        })}
      </div>
      {broker?.arranged && (
        <>
          <InfoBlock
            tone="success"
            title={`We're partnered with ${broker.short} in Saudi.`}
            body={
              <>
                Ask {broker.short} to embed Wellx in your plan &mdash; or
                click <strong className="text-fg">Next</strong> to continue
                directly with us. Share your specific contact at{" "}
                {broker.short} so we know who to talk to.
              </>
            }
          />
          <BrokerFields lead={lead} set={set} requireAll />
          <Checkbox
            checked={!!lead.authorizeWellxContact}
            onChange={(v) => set({ authorizeWellxContact: v })}
            label={
              <>
                Please connect with my broker to see if they can embed
                Wellx in our plans &mdash; I authorise Wellx to speak on
                our behalf.
              </>
            }
          />
        </>
      )}
      {broker?.id === "other" && (
        <>
          <InfoBlock
            tone="warning"
            title="We don't have an arrangement with them yet."
            body="Share their details and we'll see if we can embed Wellx via your broker."
          />
          <BrokerFields lead={lead} set={set} requireAll />
        </>
      )}
    </>
  );
}

/** Broker channel, country without a partner network. */
function FreeEntryBroker({
  lead,
  set,
  country,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
  country: Country;
}) {
  const label = country === "uae" ? "the UAE" : "the Philippines";
  return (
    <>
      <InfoBlock
        tone="warning"
        title={`We don't have broker arrangements in ${label} yet.`}
        body="Share your broker's details and we'll see if we can embed Wellx via them."
      />
      <BrokerFields lead={lead} set={set} requireAll />
    </>
  );
}

/* ────────────── Modules ────────────── */

export function ModulesStep({
  lead,
  set,
  pricing = DEFAULT_PRICING,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
  pricing?: PricingConfig;
}) {
  const toggle = (id: string) => {
    const has = lead.addOnModules.includes(id);
    set({
      addOnModules: has
        ? lead.addOnModules.filter((m) => m !== id)
        : [...lead.addOnModules, id],
    });
  };

  const indicative = calcIndicativeMonthly(
    lead.totalPeople,
    lead.addOnModules,
    pricing,
  );
  const billing =
    pricing.billingPeriod === "annual" ? "billed annually" : "billed monthly";

  return (
    <StepBody
      eyebrow="03 · Wellx Core + add-ons"
      title={<>Your Wellx.</>}
      description={`Every engagement starts with Wellx Core. Add anything else you want on top — prices are ${billing}.`}
    >
      <div className="flex flex-col gap-6">
        {/* Wellx Core — always included */}
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
            <Check size={16} strokeWidth={3} className="text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-semibold text-fg">
                Wellx Core
              </span>
              <Tag tone="warm">Included</Tag>
              <span className="wx-mono text-[12px] text-fg-secondary">
                {fmtPrice(pricing.corePmpm, pricing)} per member / month
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-fg-secondary leading-relaxed">
              The Wellx app for your people, the HR portal for your benefits
              team, and the behavioural engine that ties them together.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Eyebrow accent="warm">Add-ons</Eyebrow>
            <span className="text-[11px] text-fg-muted">
              {lead.addOnModules.filter((id) =>
                ADD_ON_MODULES.find((m) => m.id === id && m.available),
              ).length}{" "}
              selected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADD_ON_MODULES.filter((m) => m.available).map((m) => {
              const price = priceForAddOn(m.id, pricing);
              const priceLabel = price
                ? price.kind === "pmpm"
                  ? `+${fmtPrice(price.amount, pricing)} per member / mo`
                  : `+${fmtPrice(price.amount, pricing)} one-time`
                : undefined;
              return (
                <ChoiceTile
                  key={m.id}
                  selected={lead.addOnModules.includes(m.id)}
                  onSelect={() => toggle(m.id)}
                  title={m.label}
                  description={m.description}
                  hint={priceLabel}
                />
              );
            })}
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

        {/* Indicative cost — the customer's intuition check */}
        <div className="wx-card-quiet p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Eyebrow accent="warm">Indicative cost</Eyebrow>
            <span className="text-[10.5px] text-fg-muted">
              {billing} · the Wellx team will confirm
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="wx-display wx-mono text-2xl text-fg">
              {fmtPrice(indicative.monthlyPmpm, pricing)}
              <span className="text-[12px] text-fg-muted font-medium ml-1">
                per member / month
              </span>
            </span>
            {indicative.oneTime > 0 && (
              <span className="wx-mono text-[13px] text-fg-secondary">
                + {fmtPrice(indicative.oneTime, pricing)} one-time
              </span>
            )}
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
  // Split is a percentage of total — defaults to 50/50, can't go out of
  // range, so there's no error state to recover from.
  const pct = lead.employeePct ?? 50;
  const empCount = Math.round((lead.totalPeople * pct) / 100);
  const depCount = lead.totalPeople - empCount;

  return (
    <StepBody
      eyebrow="04 · Your people"
      title={<>Who&rsquo;s covered by your organisation&rsquo;s health insurance plan?</>}
      description="Everyone under your plan — employees and their dependants. We use the total to size the work."
    >
      <div className="flex flex-col gap-5">
        <div className="wx-card-quiet p-5 flex flex-col gap-4">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <Eyebrow accent="warm">Total people on the plan</Eyebrow>
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

        {/* Compact split as a percentage — drag instead of typing. */}
        <div className="flex flex-col gap-2 px-1">
          <div className="flex items-baseline justify-between text-[11.5px]">
            <span className="text-fg-muted">Roughly the split</span>
            {pct !== 50 && (
              <button
                type="button"
                onClick={() => set({ employeePct: 50 })}
                className="wx-focus text-[11px] text-fg-muted underline-offset-2 hover:underline"
              >
                reset to 50/50
              </button>
            )}
          </div>
          <SplitSlider
            pct={pct}
            onChange={(v) => set({ employeePct: v })}
          />
          <div className="flex items-baseline justify-between text-[11.5px] text-fg-secondary">
            <span>
              <span className="wx-mono text-fg">{pct}%</span> employees{" "}
              <span className="text-fg-muted">
                · {empCount.toLocaleString()}
              </span>
            </span>
            <span>
              <span className="wx-mono text-fg">{100 - pct}%</span> dependants{" "}
              <span className="text-fg-muted">
                · {depCount.toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </div>
    </StepBody>
  );
}

function SplitSlider({
  pct,
  onChange,
}: {
  pct: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative h-6 select-none">
      {/* Visual gradient bar — employees on the left, dependants on the right. */}
      <div
        className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full overflow-hidden"
        style={{ background: "var(--wx-text-faint)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            background: "var(--wx-gradient-warm)",
            transition: "width 120ms var(--wx-ease)",
          }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Share of employees vs dependants"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {/* Custom handle visualisation */}
      <div
        aria-hidden
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-card"
        style={{
          left: `${pct}%`,
          background: "var(--wx-gradient-warm)",
          boxShadow: "0 4px 12px var(--wx-glow-shadow-warm)",
          transition: "left 120ms var(--wx-ease)",
        }}
      />
    </div>
  );
}

/* ────────────── Review ────────────── */

function sourcingLabel(lead: CustomerLead): string {
  if (!lead.sourcing) return "—";
  if (lead.sourcing === "direct") return "Buy direct from Wellx";
  if (lead.sourcing === "insurer") {
    if (hasInsurerArrangements(lead.country)) {
      const ins = lead.insurer
        ? INSURERS.find((i) => i.id === lead.insurer)
        : null;
      if (!ins) return "Through an insurer";
      if (ins.id === "other" && lead.insurerOtherName) {
        return `Through ${lead.insurerOtherName}`;
      }
      return `Through ${ins.short}`;
    }
    return lead.insurerOtherName
      ? `Through ${lead.insurerOtherName}`
      : "Through an insurer";
  }
  // broker
  if (hasBrokerArrangements(lead.country)) {
    const b = lead.ksaBroker
      ? KSA_BROKERS.find((x) => x.id === lead.ksaBroker)
      : null;
    if (b?.id === "other" && lead.brokerName) return `Through ${lead.brokerName}`;
    if (b) return `Through ${b.short}`;
  }
  return lead.brokerName
    ? `Through ${lead.brokerName}`
    : "Through a broker";
}

export function ReviewStep({
  lead,
  set,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
}) {
  const selectedGoals = GOALS.filter((g) => lead.goals.includes(g.id));
  const reviewPct = lead.employeePct ?? 50;
  const employees = Math.round((lead.totalPeople * reviewPct) / 100);
  const dependants = lead.totalPeople - employees;
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
            <ReviewRow
              label={`Goals (${selectedGoals.length})`}
              value={
                selectedGoals.length
                  ? selectedGoals.map((g) => g.title).join(", ")
                  : "—"
              }
              wide
            />
            <ReviewRow
              label="Country"
              value={
                lead.country
                  ? COUNTRIES.find((c) => c.id === lead.country)?.label ?? "—"
                  : "—"
              }
            />
            <ReviewRow label="Sourcing" value={sourcingLabel(lead)} />
            <ReviewRow
              label="Authorise Wellx"
              value={lead.authorizeWellxContact ? "Yes — to speak with broker/insurer" : "No"}
            />
            <ReviewRow
              label="Company"
              value={lead.companyName ?? "—"}
            />
            <ReviewRow label="Broker" value={lead.brokerName ?? "—"} />
            <ReviewRow label="Broker email" value={lead.brokerEmail ?? "—"} />
            <ReviewRow label="Broker phone" value={lead.brokerPhone ?? "—"} />
            <ReviewRow
              label="Total people"
              value={lead.totalPeople.toLocaleString()}
            />
            <ReviewRow
              label="Employees / Dependants"
              value={`${employees.toLocaleString()} / ${dependants.toLocaleString()}`}
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
              label="Company"
              value={lead.companyName ?? ""}
              onChange={(v) => set({ companyName: v })}
              placeholder="Your company"
              required
            />
            <EmailField
              label="Work email"
              value={lead.contactEmail ?? ""}
              onChange={(v) => set({ contactEmail: v })}
              placeholder="you@company.com"
              required
            />
            <TextField
              label="Your role"
              value={lead.contactRole ?? ""}
              onChange={(v) => set({ contactRole: v })}
              placeholder="e.g. Head of People"
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
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Eyebrow>
        {label}
        {required ? <span className="text-wx-orange ml-0.5">*</span> : null}
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

function BrokerFields({
  lead,
  set,
  requireAll,
}: {
  lead: CustomerLead;
  set: (p: Partial<CustomerLead>) => void;
  requireAll: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <TextField
        label="Broker name"
        value={lead.brokerName ?? ""}
        onChange={(v) => set({ brokerName: v })}
        placeholder="Broker firm + person"
        required={requireAll}
        className="sm:col-span-2"
      />
      <EmailField
        label="Broker email"
        value={lead.brokerEmail ?? ""}
        onChange={(v) => set({ brokerEmail: v })}
        placeholder="broker@firm.com"
        required={requireAll}
      />
      <PhoneField
        label="Broker phone"
        value={lead.brokerPhone ?? ""}
        onChange={(v) => set({ brokerPhone: v })}
        placeholder="+971 50 123 4567"
        required={requireAll}
      />
    </div>
  );
}

function EmailField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const showError = value.length > 0 && !isValidEmail(value);
  return (
    <ValidatedField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type="email"
      inputMode="email"
      error={showError ? "Doesn't look like a valid email." : undefined}
    />
  );
}

function PhoneField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const showError = value.length > 0 && !isValidPhone(value);
  return (
    <ValidatedField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type="tel"
      inputMode="tel"
      error={showError ? "Use 7–15 digits, e.g. +971 50 123 4567." : undefined}
    />
  );
}

function ValidatedField({
  label,
  value,
  onChange,
  placeholder,
  type,
  inputMode,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "email" | "tel" | "text";
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>
        {label}
        {required ? <span className="text-wx-orange ml-0.5">*</span> : null}
      </Eyebrow>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="wx-focus w-full rounded-xl border bg-card-elev px-3 py-2.5 text-[13.5px] text-fg outline-none placeholder:text-fg-muted"
        style={{
          borderColor: error ? "rgba(224,52,91,0.5)" : "var(--wx-section-stroke)",
        }}
      />
      {error && (
        <span className="text-[11px] text-[color:var(--wx-danger)] mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="wx-focus flex items-start gap-3 rounded-xl border border-stroke bg-card-elev p-3 cursor-pointer hover:border-wx-purple/40 transition-colors">
      <span
        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all"
        style={
          checked
            ? {
                background: "var(--wx-gradient-warm)",
                borderColor: "transparent",
                boxShadow: "0 4px 12px var(--wx-glow-shadow-warm)",
              }
            : { borderColor: "var(--wx-section-stroke)" }
        }
      >
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
            <path
              d="M1.5 5.2L4 7.5L8.5 2.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[12.5px] leading-relaxed text-fg-secondary">
        {label}
      </span>
    </label>
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
