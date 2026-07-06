import { prisma } from "@/lib/prisma";

/** Formats a human-readable summary of a finished plan run, for pushing back to the user. */
export async function summarizePlanOutcome(planId: string, goal: string): Promise<string> {
  const [plan, tasks] = await Promise.all([
    prisma.plan.findUnique({ where: { id: planId } }),
    prisma.task.findMany({ where: { planId }, orderBy: { position: "asc" } }),
  ]);

  const taskLines = tasks.map((task, index) => `${index + 1}. ${task.title}`).join("\n");
  return `「${goal}」已拆解成 ${tasks.length} 個任務並執行完成(狀態:${plan?.status ?? "UNKNOWN"}):\n${taskLines}`;
}
