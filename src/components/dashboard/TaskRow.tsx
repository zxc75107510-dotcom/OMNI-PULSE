import type { MockTask } from "@/lib/mock-data";
import { TaskStatusIcon } from "./status";

const DIMMED_STATUSES = new Set(["COMPLETED", "CANCELLED", "SKIPPED"]);

export function TaskRow({ task }: { task: MockTask }) {
  const dimmed = DIMMED_STATUSES.has(task.status);

  return (
    <div
      className="flex items-start gap-2.5 py-1.5"
      style={{ paddingLeft: task.depth * 20 }}
    >
      {task.depth > 0 ? (
        <span className="mt-0.5 font-data text-xs text-ink-dim/40">↳</span>
      ) : null}
      <span className="mt-0.5">
        <TaskStatusIcon status={task.status} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${dimmed ? "text-ink-dim" : "text-ink"}`}>
          {task.title}
        </p>
        {task.status === "IN_PROGRESS" || task.status === "BLOCKED" ? (
          <div className="mt-1 h-1 w-full max-w-40 overflow-hidden rounded-full bg-panel-raised">
            <div
              className={`h-full rounded-full ${
                task.status === "BLOCKED" ? "bg-amber" : "bg-pulse"
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
