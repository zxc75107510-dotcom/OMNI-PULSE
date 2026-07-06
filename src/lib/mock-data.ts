import type { EventLevel, EventType, PlanStatus, TaskStatus } from "@/generated/prisma/enums";

export interface MockTask {
  id: string;
  planId: string;
  parentId: string | null;
  depth: number;
  position: number;
  title: string;
  status: TaskStatus;
  progress: number;
}

export interface MockPlan {
  id: string;
  title: string;
  goal: string;
  status: PlanStatus;
  createdAt: string;
}

export interface MockEvent {
  id: string;
  planId: string;
  planTitle: string;
  type: EventType;
  level: EventLevel;
  message: string;
  actor: string;
  createdAt: string;
}

export const mockPlans: MockPlan[] = [
  {
    id: "plan-launch",
    title: "產品發表會規劃",
    goal: "在兩週內辦好一場 80 人規模的產品發表會",
    status: "ACTIVE",
    createdAt: "2026-07-06T02:10:00Z",
  },
  {
    id: "plan-fitness",
    title: "一週運動減脂計畫",
    goal: "幫我規劃一週的運動減脂計畫",
    status: "PENDING",
    createdAt: "2026-07-06T03:02:00Z",
  },
  {
    id: "plan-client-deck",
    title: "客戶提案簡報",
    goal: "整理季度成效並製作給客戶的提案簡報",
    status: "COMPLETED",
    createdAt: "2026-07-04T08:30:00Z",
  },
];

export const mockTasks: MockTask[] = [
  // plan-launch
  {
    id: "t-venue",
    planId: "plan-launch",
    parentId: null,
    depth: 0,
    position: 0,
    title: "確認場地與時間",
    status: "COMPLETED",
    progress: 100,
  },
  {
    id: "t-invite",
    planId: "plan-launch",
    parentId: null,
    depth: 0,
    position: 1,
    title: "建立並寄送邀請名單",
    status: "IN_PROGRESS",
    progress: 60,
  },
  {
    id: "t-invite-followup",
    planId: "plan-launch",
    parentId: "t-invite",
    depth: 1,
    position: 0,
    title: "追蹤未回覆名單",
    status: "PENDING",
    progress: 0,
  },
  {
    id: "t-deck",
    planId: "plan-launch",
    parentId: null,
    depth: 0,
    position: 2,
    title: "設計簡報初稿",
    status: "BLOCKED",
    progress: 20,
  },
  {
    id: "t-catering",
    planId: "plan-launch",
    parentId: null,
    depth: 0,
    position: 3,
    title: "餐飲與茶水安排",
    status: "PENDING",
    progress: 0,
  },
  // plan-client-deck (completed plan — all tasks resolved)
  {
    id: "t-metrics",
    planId: "plan-client-deck",
    parentId: null,
    depth: 0,
    position: 0,
    title: "彙整季度成效數據",
    status: "COMPLETED",
    progress: 100,
  },
  {
    id: "t-slides",
    planId: "plan-client-deck",
    parentId: null,
    depth: 0,
    position: 1,
    title: "製作提案簡報",
    status: "COMPLETED",
    progress: 100,
  },
];

export const mockEvents: MockEvent[] = [
  {
    id: "e-1",
    planId: "plan-launch",
    planTitle: "產品發表會規劃",
    type: "TASK_STATUS_CHANGED",
    level: "INFO",
    message: "任務「建立並寄送邀請名單」已標記為執行中",
    actor: "agent",
    createdAt: "2026-07-06T10:42:03Z",
  },
  {
    id: "e-2",
    planId: "plan-launch",
    planTitle: "產品發表會規劃",
    type: "TASK_STATUS_CHANGED",
    level: "WARNING",
    message: "任務「設計簡報初稿」卡關,等待素材提供",
    actor: "agent",
    createdAt: "2026-07-06T10:41:58Z",
  },
  {
    id: "e-3",
    planId: "plan-fitness",
    planTitle: "一週運動減脂計畫",
    type: "PLAN_CREATED",
    level: "INFO",
    message: "已從 LINE 訊息建立新計畫",
    actor: "user",
    createdAt: "2026-07-06T10:40:12Z",
  },
  {
    id: "e-4",
    planId: "plan-launch",
    planTitle: "產品發表會規劃",
    type: "TASK_STATUS_CHANGED",
    level: "INFO",
    message: "任務「確認場地與時間」已完成",
    actor: "agent",
    createdAt: "2026-07-06T10:38:47Z",
  },
  {
    id: "e-5",
    planId: "plan-fitness",
    planTitle: "一週運動減脂計畫",
    type: "AGENT_MESSAGE",
    level: "INFO",
    message: "正在把目標拆解成具體任務⋯",
    actor: "agent",
    createdAt: "2026-07-06T10:38:20Z",
  },
  {
    id: "e-6",
    planId: "plan-launch",
    planTitle: "產品發表會規劃",
    type: "TASK_CREATED",
    level: "INFO",
    message: "新增任務「追蹤未回覆名單」",
    actor: "agent",
    createdAt: "2026-07-06T09:55:04Z",
  },
  {
    id: "e-7",
    planId: "plan-client-deck",
    planTitle: "客戶提案簡報",
    type: "PLAN_STATUS_CHANGED",
    level: "INFO",
    message: "所有任務已解決,計畫標記為完成",
    actor: "agent",
    createdAt: "2026-07-04T16:20:11Z",
  },
  {
    id: "e-8",
    planId: "plan-launch",
    planTitle: "產品發表會規劃",
    type: "HUMAN_IN_LOOP_REQUEST",
    level: "WARNING",
    message: "需要你確認場地租金是否超出預算",
    actor: "agent",
    createdAt: "2026-07-04T11:02:39Z",
  },
  {
    id: "e-9",
    planId: "plan-client-deck",
    planTitle: "客戶提案簡報",
    type: "TASK_STATUS_CHANGED",
    level: "INFO",
    message: "任務「製作提案簡報」已完成",
    actor: "agent",
    createdAt: "2026-07-04T10:47:02Z",
  },
  {
    id: "e-10",
    planId: "plan-launch",
    planTitle: "產品發表會規劃",
    type: "ERROR",
    level: "ERROR",
    message: "寄送邀請信時發生逾時,已自動重試",
    actor: "system",
    createdAt: "2026-07-04T09:12:55Z",
  },
];
