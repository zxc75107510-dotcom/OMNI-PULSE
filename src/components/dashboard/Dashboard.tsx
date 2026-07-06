"use client";

import { motion } from "framer-motion";
import { mockEvents, mockPlans, mockTasks } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/format-time";
import { staggerContainer, listItemVariants, springTransition } from "@/lib/motion";
import { PulseHeader } from "./PulseHeader";
import { PlanCard } from "./PlanCard";
import { EventStreamPanel } from "./EventStreamPanel";

// Fixed reference "now" so relative timestamps render identically on server
// and client — this is a mock snapshot, not a live clock, so there's no
// reason to read the real wall clock (and every reason not to: it would
// cause a hydration mismatch and drift on every reload).
const MOCK_NOW = new Date("2026-07-06T10:42:10Z");

export function Dashboard() {
  const activePlanCount = mockPlans.filter((p) => p.status === "ACTIVE").length;
  const inProgressTaskCount = mockTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const latestEvent = mockEvents[0];
  const lastEventLabel = latestEvent
    ? formatRelativeTime(latestEvent.createdAt, MOCK_NOW)
    : "—";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PulseHeader
        activePlanCount={activePlanCount}
        inProgressTaskCount={inProgressTaskCount}
        lastEventLabel={lastEventLabel}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <motion.section
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-5"
          >
            <h2 className="font-data text-xs uppercase tracking-[0.2em] text-ink-dim">
              plans
            </h2>
            {mockPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={listItemVariants}
                transition={springTransition}
              >
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
