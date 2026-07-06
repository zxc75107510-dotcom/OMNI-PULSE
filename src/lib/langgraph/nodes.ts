import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { TaskStatus } from "@/generated/prisma/enums";
import type { PlanExecutionStateType, PlanExecutionUpdateType, TaskNode } from "./state";

const TaskDecomposition = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().describe("Short, action-oriented task title (max ~10 words)"),
        description: z
          .string()
          .optional()
          .describe("One or two sentences of extra detail on what this task involves"),
      })
    )
    .min(1)
    .describe("Ordered list of concrete sub-tasks that together accomplish the goal"),
});

function buildDecompositionModel() {
  return new ChatAnthropic({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
    temperature: 0,
  }).withStructuredOutput(TaskDecomposition);
}

type DecompositionModel = ReturnType<typeof buildDecompositionModel>;

// Constructed lazily so importing this module (e.g. transitively, at build
// time) never requires `ANTHROPIC_API_KEY` to be set — only actually calling
// `decomposePlan` does.
let decompositionModel: DecompositionModel | undefined;

function getDecompositionModel(): DecompositionModel {
  decompositionModel ??= buildDecompositionModel();
  return decompositionModel;
}

function toTaskNode(task: {
  id: string;
  title: string;
  status: TaskStatus;
  parentId: string | null;
  position: number;
}): TaskNode {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    parentId: task.parentId,
    position: task.position,
  };
}

/**
 * Calls Claude to break `state.goal` into an ordered task list, persists the
 * result as `Task` rows under the plan, and marks the `Plan` ACTIVE.
 */
export async function decomposePlan(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  const { planId, goal } = state;

  const { tasks } = await getDecompositionModel().invoke([
    {
      role: "system",
      content:
        "You are a meticulous project planner. Break the user's goal into a short, ordered " +
        "list of concrete, actionable sub-tasks. Titles must be terse and action-oriented.",
    },
    { role: "user", content: goal },
  ]);

  const createdTasks = await prisma.$transaction(
    tasks.map((task, index) =>
      prisma.task.create({
        data: {
          planId,
          title: task.title,
          description: task.description,
          position: index,
        },
      })
    )
  );

  await prisma.plan.update({
    where: { id: planId },
    data: { status: "ACTIVE", startedAt: new Date() },
  });

  await prisma.eventStream.create({
    data: {
      planId,
      type: "PLAN_STATUS_CHANGED",
      level: "INFO",
      message: `Plan decomposed into ${createdTasks.length} task(s)`,
      payload: { toStatus: "ACTIVE", taskCount: createdTasks.length },
      actor: "agent",
    },
  });

  await prisma.eventStream.createMany({
    data: createdTasks.map((task) => ({
      planId,
      taskId: task.id,
      type: "TASK_CREATED" as const,
      level: "INFO" as const,
      message: `Task created: ${task.title}`,
      actor: "agent",
    })),
  });

  return {
    planStatus: "ACTIVE",
    tasks: createdTasks.map(toTaskNode),
    log: [`[decomposePlan] created ${createdTasks.length} task(s) for plan ${planId}`],
  };
}

/** Fetches the next PENDING task for this plan straight from Postgres. */
export async function selectNextTask(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  const next = await prisma.task.findFirst({
    where: { planId: state.planId, status: "PENDING" },
    orderBy: { position: "asc" },
  });

  return {
    currentTaskId: next?.id ?? null,
    log: [
      next
        ? `[selectNextTask] selected task ${next.id} (${next.title})`
        : "[selectNextTask] no pending tasks remain",
    ],
  };
}

/**
 * Transitions the selected task to IN_PROGRESS and records the change in
 * `event_streams`.
 *
 * TODO (later phase): dispatch to the real tool/agent executor instead of
 * this stub — `evaluateTask` currently completes every task unconditionally
 * right after.
 */
export async function executeTask(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  const { currentTaskId } = state;
  if (!currentTaskId) {
    return { log: ["[executeTask] no current task to execute"] };
  }

  const task = await prisma.task.update({
    where: { id: currentTaskId },
    data: { status: "IN_PROGRESS", startedAt: new Date() },
  });

  await prisma.eventStream.create({
    data: {
      planId: state.planId,
      taskId: task.id,
      type: "TASK_STATUS_CHANGED",
      level: "INFO",
      message: `Task started: ${task.title}`,
      payload: { fromStatus: "PENDING", toStatus: "IN_PROGRESS" },
      actor: "agent",
    },
  });

  return {
    log: [`[executeTask] task ${task.id} (${task.title}) marked IN_PROGRESS (stub execution)`],
  };
}

/**
 * Marks the current task COMPLETED and records the change.
 *
 * TODO (later phase): read the real outcome of `executeTask` (success,
 * failure, needs human-in-the-loop) instead of unconditionally completing.
 */
export async function evaluateTask(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  const { currentTaskId } = state;
  if (!currentTaskId) {
    return { log: ["[evaluateTask] no current task to evaluate"] };
  }

  const task = await prisma.task.update({
    where: { id: currentTaskId },
    data: { status: "COMPLETED", progress: 100, completedAt: new Date() },
  });

  await prisma.eventStream.create({
    data: {
      planId: state.planId,
      taskId: task.id,
      type: "TASK_STATUS_CHANGED",
      level: "INFO",
      message: `Task completed: ${task.title}`,
      payload: { fromStatus: "IN_PROGRESS", toStatus: "COMPLETED" },
      actor: "agent",
    },
  });

  return {
    log: [`[evaluateTask] task ${task.id} (${task.title}) marked COMPLETED (stub evaluation)`],
  };
}

export async function finalizePlan(
  state: PlanExecutionStateType
): Promise<PlanExecutionUpdateType> {
  await prisma.plan.update({
    where: { id: state.planId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await prisma.eventStream.create({
    data: {
      planId: state.planId,
      type: "PLAN_STATUS_CHANGED",
      level: "INFO",
      message: "All tasks resolved — plan completed",
      payload: { toStatus: "COMPLETED" },
      actor: "agent",
    },
  });

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
