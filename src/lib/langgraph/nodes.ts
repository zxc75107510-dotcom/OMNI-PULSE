import type { PlanExecutionStateType, PlanExecutionUpdateType } from "./state";

/**
 * Phase 2 skeleton node — decomposes `state.goal` into a `TaskNode[]` tree.
 *
 * TODO (later phase): call the planning LLM, persist the resulting rows via
 * `prisma.task.createMany(...)`, and emit `PLAN_CREATED` / `TASK_CREATED`
 * rows to `event_streams` so the live UI picks up the new tree.
 */
export async function decomposePlan(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  return {
    planStatus: "ACTIVE",
    log: [`[decomposePlan] goal="${state.goal}" — decomposition not yet implemented`],
  };
}

/**
 * Picks the next pending task to run. Skeleton logic only: first-pending-wins,
 * no dependency/priority resolution yet.
 */
export function selectNextTask(state: PlanExecutionStateType): PlanExecutionUpdateType {
  const next = state.tasks.find((task) => task.status === "PENDING");
  return {
    currentTaskId: next?.id ?? null,
    log: [
      next
        ? `[selectNextTask] selected task ${next.id}`
        : "[selectNextTask] no pending tasks remain",
    ],
  };
}

/**
 * TODO (later phase): dispatch `state.currentTaskId` to its tool/agent
 * executor, stream progress into `event_streams`, and update `Task.status`
 * via prisma as work happens.
 */
export async function executeTask(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  return {
    log: [`[executeTask] executing task ${state.currentTaskId ?? "unknown"} (stub)`],
  };
}

/**
 * TODO (later phase): read the real outcome of `executeTask` (success,
 * failure, needs human-in-the-loop) instead of unconditionally completing.
 */
export function evaluateTask(state: PlanExecutionStateType): PlanExecutionUpdateType {
  const { currentTaskId } = state;
  return {
    tasks: state.tasks.map((task) =>
      task.id === currentTaskId ? { ...task, status: "COMPLETED" as const } : task
    ),
    log: [`[evaluateTask] marked task ${currentTaskId ?? "unknown"} complete (stub)`],
  };
}

export function finalizePlan(state: PlanExecutionStateType): PlanExecutionUpdateType {
  return {
    planStatus: "COMPLETED",
    log: [`[finalizePlan] plan ${state.planId} — all tasks resolved`],
  };
}

/** Conditional-edge router used after `selectNextTask`. */
export function routeAfterSelect(
  state: PlanExecutionStateType
): "executeTask" | "finalizePlan" {
  return state.currentTaskId ? "executeTask" : "finalizePlan";
}
