import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { PlanExecutionState } from "./state";
import {
  decomposePlan,
  evaluateTask,
  executeTask,
  finalizePlan,
  routeAfterSelect,
  selectNextTask,
} from "./nodes";

const builder = new StateGraph(PlanExecutionState)
  .addNode("decomposePlan", decomposePlan)
  .addNode("selectNextTask", selectNextTask)
  .addNode("executeTask", executeTask)
  .addNode("evaluateTask", evaluateTask)
  .addNode("finalizePlan", finalizePlan)
  .addEdge(START, "decomposePlan")
  .addEdge("decomposePlan", "selectNextTask")
  .addConditionalEdges("selectNextTask", routeAfterSelect, {
    executeTask: "executeTask",
    finalizePlan: "finalizePlan",
  })
  .addEdge("executeTask", "evaluateTask")
  .addEdge("evaluateTask", "selectNextTask")
  .addEdge("finalizePlan", END);

// In-memory checkpointer for now. Swap for a Postgres-backed BaseCheckpointSaver
// once plan runs need to survive a server restart / resume across requests.
const checkpointer = new MemorySaver();

export const planExecutionGraph = builder.compile({ checkpointer });

/** Kicks off (or resumes, given the same `planId`) a plan-execution run. */
export async function runPlanExecution(input: { planId: string; goal: string }) {
  return planExecutionGraph.invoke(
    { planId: input.planId, goal: input.goal },
    { configurable: { thread_id: input.planId } }
  );
}
