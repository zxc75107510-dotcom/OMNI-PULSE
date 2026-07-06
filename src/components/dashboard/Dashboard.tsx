"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, Layers3, RadioTower } from "lucide-react";
import { mockEvents, mockPlans, mockTasks } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/format-time";
import { listItemVariants, springTransition, staggerContainer } from "@/lib/motion";
import { EventStreamPanel } from "./EventStreamPanel";
import { PlanCard } from "./PlanCard";
import { PulseHeader } from "./PulseHeader";

const MOCK_NOW = new Date("2026-07-06T10:42:10Z");

function DeckMetric({
  icon: Icon,
  label,
  value,
  tone = "cyan",
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  tone?: "cyan" | "blue" | "teal";
}) {
  const toneClass = {
    cyan: "text-cyan-300",
    blue: "text-blue-400",
    teal: "text-teal-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-[rgba(15,23,42,0.6)] px-4 py-3 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl border border-slate-700/50 bg-slate-900/70 shadow-[0_0_15px_rgba(56,189,248,0.3)] drop-shadow-[0_0_8px_rgba(167,243,208,0.7)] ${toneClass}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="font-data text-[10px] uppercase tracking-[0.28em] text-slate-400">
            {label}
          </p>
          <p className="font-data text-base text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const reduceMotion = useReducedMotion();
  const activePlanCount = mockPlans.filter((p) => p.status === "ACTIVE").length;
  const inProgressTaskCount = mockTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const latestEvent = mockEvents[0];
  const lastEventLabel = latestEvent ? formatRelativeTime(latestEvent.createdAt, MOCK_NOW) : "--";

  return (
    <div className="relative z-10 flex min-h-screen flex-1 flex-col">
      <PulseHeader
        activePlanCount={activePlanCount}
        inProgressTaskCount={inProgressTaskCount}
        lastEventLabel={lastEventLabel}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <DeckMetric icon={Layers3} label="active plans" value={activePlanCount} />
          <DeckMetric icon={Activity} label="tasks in motion" value={inProgressTaskCount} tone="blue" />
          <DeckMetric icon={RadioTower} label="last signal" value={lastEventLabel} tone="teal" />
        </motion.div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
          <motion.section
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-data text-[10px] uppercase tracking-[0.34em] text-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
                  command queue
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
                  Agent plans
                </h2>
              </div>
              <div className="hidden h-px flex-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)] sm:ml-5 sm:block" />
            </div>

            {mockPlans.map((plan) => (
              <motion.div key={plan.id} variants={listItemVariants} transition={springTransition}>
                <PlanCard plan={plan} tasks={mockTasks.filter((t) => t.planId === plan.id)} />
              </motion.div>
            ))}
          </motion.section>

          <EventStreamPanel events={mockEvents} now={MOCK_NOW} />
        </div>
      </main>
    </div>
  );
}
