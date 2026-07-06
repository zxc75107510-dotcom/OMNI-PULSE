import type { MockTask } from "@/lib/mock-data";
import { TaskStatusIcon } from "./status";

const DIMMED_STATUSES = new Set(["COMPLETED", "CANCELLED", "SKIPPED"]);

export function TaskRow({ task }: { task: MockTask }) {
  const dimmed = DIMMED_STATUSES.has(task.status);

  return (
    <div
      className="group relative flex items-start gap-2.5 border-b border-slate-700/40 px-3 py-3 last:border-b-0 hover:bg-slate-900/50"
      style={{ paddingLeft: 14 + task.depth * 22 }}
    >
      {task.depth > 0 ? (
        <span className="mt-1.5 h-px w-4 shrink-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
      ) : null}
      <span className="relative z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-950/60">
        <TaskStatusIcon status={task.status} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm leading-5 transition-colors ${
            dimmed ? "text-slate-500" : "text-slate-100 group-hover:text-teal-200"
          }`}
        >
          {task.title}
        </p>
        {task.status === "IN_PROGRESS" || task.status === "BLOCKED" ? (
          <div className="mt-2 h-1.5 w-full max-w-48 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full drop-shadow-[0_0_8px_rgba(167,243,208,0.7)] ${
                task.status === "BLOCKED"
                  ? "bg-amber"
                  : "bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
