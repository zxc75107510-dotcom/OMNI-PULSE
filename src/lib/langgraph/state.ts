import { Annotation } from "@langchain/langgraph";
import type { PlanStatus, TaskStatus } from "@/generated/prisma/enums";

// Lightweight in-graph mirror of a `Task` row — enough for the state
// machine to route on, without round-tripping the full Prisma model.
export interface TaskNode {
  id: string;
  title: string;
  status: TaskStatus;
  parentId: string | null;
  position: number;
}

/**
 * Root state for the Plan → Task-tree execution graph (Module A).
 * One graph run corresponds to one `Plan` row; `thread_id` on invoke
 * should be the `planId` so the checkpointer can resume a paused plan.
 */
export const PlanExecutionState = Annotation.Root({
  planId: Annotation<string>(),
  goal: Annotation<string>(),

  planStatus: Annotation<PlanStatus>({
    reducer: (_current, update) => update,
    default: () => "PENDING",
  }),

  tasks: Annotation<TaskNode[]>({
    reducer: (_current, update) => update,
    default: () => [],
  }),

  currentTaskId: Annotation<string | null>({
    reducer: (_current, update) => update,
    default: () => null,
  }),

  // Transient run log for this invocation — the durable timeline lives in
  // the `event_streams` table, written to by the node implementations.
  log: Annotation<string[]>({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),
});

export type PlanExecutionStateType = typeof PlanExecutionState.State;
export type PlanExecutionUpdateType = typeof PlanExecutionState.Update;
