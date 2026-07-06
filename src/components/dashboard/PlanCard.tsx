import { motion } from "framer-motion";
import { CalendarClock, Gauge, Workflow } from "lucide-react";
import type { MockPlan, MockTask } from "@/lib/mock-data";
import { PlanStatusBadge } from "./status";
import { TaskRow } from "./TaskRow";

export function PlanCard({ plan, tasks }: { plan: MockPlan; tasks: MockTask[] }) {
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const totalCount = tasks.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isActive = plan.status === "ACTIVE";

  return (
    <motion.article
      layout
      whileHover={{ y: -4, scale: 1.008 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`relative rounded-2xl border border-slate-700/50 bg-[rgba(15,23,42,0.6)] p-5 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md ${
        isActive ? "animate-breathe-glow" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#1d4ed8] opacity-20 blur-[90px]" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-slate-700/50 bg-slate-900/70 text-teal-200 shadow-[0_0_15px_rgba(56,189,248,0.3)] drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
              <Workflow className="h-4 w-4" strokeWidth={2} />
            </span>
            <p className="font-data text-[10px] uppercase tracking-[0.28em] text-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
              plan node
            </p>
          </div>
          <h3 className="truncate font-display text-lg font-semibold tracking-tight text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
            {plan.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{plan.goal}</p>
        </div>
        <PlanStatusBadge status={plan.status} />
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.22em] text-slate-300 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
              <Gauge className="h-3.5 w-3.5 text-cyan-300" />
              execution
            </span>
            <span className="font-data text-xs text-slate-400">
              {completedCount}/{totalCount} tasks
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.12 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
          <CalendarClock className="h-3.5 w-3.5 text-cyan-300" />
          <span className="font-data text-[10px] uppercase tracking-[0.2em] text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
            {percent.toString().padStart(2, "0")}%
          </span>
        </div>
      </div>

      {totalCount > 0 ? (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/40 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-blue-500 via-cyan-400 to-teal-400 opacity-70 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 font-data text-xs text-slate-400 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
          No task nodes have been emitted for this plan yet.
        </p>
      )}
    </motion.article>
  );
}
