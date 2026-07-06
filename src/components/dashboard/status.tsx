import {
  AlertOctagon,
  AlertTriangle,
  ArrowRightCircle,
  Bot,
  CheckCircle2,
  Circle,
  CircleCheck,
  CircleHelp,
  Cpu,
  ListPlus,
  MinusCircle,
  RefreshCcw,
  Sparkles,
  Terminal,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { EventLevel, EventType, PlanStatus, TaskStatus } from "@/generated/prisma/enums";

export function PulseDot({ className = "" }: { className?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="motion-safe:absolute motion-safe:inline-flex motion-safe:h-full motion-safe:w-full motion-safe:animate-ping motion-safe:rounded-full motion-safe:bg-pulse motion-safe:opacity-60" />
      <span className={`relative inline-flex h-2 w-2 rounded-full bg-pulse ${className}`} />
    </span>
  );
}

const TASK_STATUS_STYLE: Record<TaskStatus, { icon: LucideIcon; className: string }> = {
  PENDING: { icon: Circle, className: "text-ink-dim/70" },
  IN_PROGRESS: { icon: Circle, className: "text-pulse" },
  BLOCKED: { icon: AlertTriangle, className: "text-amber" },
  COMPLETED: { icon: CheckCircle2, className: "text-pulse" },
  FAILED: { icon: XCircle, className: "text-danger" },
  CANCELLED: { icon: MinusCircle, className: "text-ink-dim/50" },
  SKIPPED: { icon: MinusCircle, className: "text-ink-dim/50" },
};

export function TaskStatusIcon({ status }: { status: TaskStatus }) {
  if (status === "IN_PROGRESS") {
    return (
      <span className="flex h-4 w-4 items-center justify-center">
        <PulseDot />
      </span>
    );
  }

  const { icon: Icon, className } = TASK_STATUS_STYLE[status];
  return <Icon className={`h-4 w-4 ${className}`} strokeWidth={2} />;
}

const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  PENDING: "待啟動",
  ACTIVE: "執行中",
  PAUSED: "已暫停",
  COMPLETED: "已完成",
  FAILED: "失敗",
  CANCELLED: "已取消",
};

const PLAN_STATUS_STYLE: Record<PlanStatus, string> = {
  PENDING: "text-ink-dim border-line",
  ACTIVE: "text-pulse border-pulse-dim",
  PAUSED: "text-amber border-amber/40",
  COMPLETED: "text-pulse/80 border-pulse-dim/60",
  FAILED: "text-danger border-danger/40",
  CANCELLED: "text-ink-dim/70 border-line",
};

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-data text-[11px] uppercase tracking-wider ${PLAN_STATUS_STYLE[status]}`}
    >
      {status === "ACTIVE" ? <PulseDot /> : null}
      {PLAN_STATUS_LABEL[status]}
    </span>
  );
}

const EVENT_TYPE_ICON: Record<EventType, LucideIcon> = {
  PLAN_CREATED: Sparkles,
  PLAN_STATUS_CHANGED: RefreshCcw,
  TASK_CREATED: ListPlus,
  TASK_STATUS_CHANGED: ArrowRightCircle,
  TASK_UPDATED: ArrowRightCircle,
  AGENT_MESSAGE: Bot,
  USER_MESSAGE: User,
  LOG: Terminal,
  ERROR: AlertOctagon,
  HUMAN_IN_LOOP_REQUEST: CircleHelp,
  HUMAN_IN_LOOP_RESPONSE: CircleCheck,
  SYSTEM: Cpu,
};

const EVENT_LEVEL_STYLE: Record<EventLevel, string> = {
  DEBUG: "text-ink-dim/60",
  INFO: "text-ink-dim",
  WARNING: "text-amber",
  ERROR: "text-danger",
  CRITICAL: "text-danger",
};

export function EventTypeIcon({ type, level }: { type: EventType; level: EventLevel }) {
  const Icon = EVENT_TYPE_ICON[type];
  return <Icon className={`h-3.5 w-3.5 shrink-0 ${EVENT_LEVEL_STYLE[level]}`} strokeWidth={2} />;
}

export function eventLevelTextClass(level: EventLevel): string {
  return EVENT_LEVEL_STYLE[level];
}
