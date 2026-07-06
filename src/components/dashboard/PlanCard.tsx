import { motion } from "framer-motion";
import type { MockPlan, MockTask } from "@/lib/mock-data";
import { PlanStatusBadge } from "./status";
import { TaskRow } from "./TaskRow";

export function PlanCard({ plan, tasks }: { plan: MockPlan; tasks: MockTask[] }) {
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const totalCount = tasks.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isActive = plan.status === "ACTIVE";

  return (
    <motion.div
      layout
      className={`rounded-2xl p-px ${isActive ? "marquee-border animate-breathe-glow" : ""}`}
    >
      <div
        className={`rounded-[15px] border border-line p-5 backdrop-blur-sm ${
          isActive ? "bg-panel/95" : "bg-panel/80"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-ink">
              {plan.title}
            </h3>
            <p className="mt-0.5 truncate text-sm text-ink-dim">{plan.goal}</p>
          </div>
          <PlanStatusBadge status={plan.status} />
        </div>

        {totalCount > 0 ? (
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-raised">
              <div
                className="h-full rounded-full bg-pulse transition-[width]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="font-data text-xs text-ink-dim">
              {completedCount}/{totalCount} tasks
            </span>
          </div>
        ) : null}

        {totalCount > 0 ? (
          <div className="mt-3 divide-y divide-line/60 border-t border-line/60 pt-1">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="mt-4 font-data text-xs text-ink-dim/70">
            尚未拆解任務 — 等待 LangGraph 產生 Task 樹
          </p>
        )}
      </div>
    </motion.div>
  );
}
