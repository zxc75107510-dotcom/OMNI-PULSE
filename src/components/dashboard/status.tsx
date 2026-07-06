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
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="motion-safe:absolute motion-safe:inline-flex motion-safe:h-full motion-safe:w-full motion-safe:animate-ping motion-safe:rounded-full motion-safe:bg-teal-200 motion-safe:opacity-60" />
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)] ${className}`}
      />
    </span>
  );
}

const TASK_STATUS_STYLE: Record<TaskStatus, { icon: LucideIcon; className: string }> = {
  PENDING: { icon: Circle, className: "text-slate-500" },
  IN_PROGRESS: { icon: Circle, className: "text-teal-200" },
  BLOCKED: { icon: AlertTriangle, className: "text-amber drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" },
  COMPLETED: { icon: CheckCircle2, className: "text-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" },
  FAILED: { icon: XCircle, className: "text-danger drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]" },
  CANCELLED: { icon: MinusCircle, className: "text-slate-600" },
  SKIPPED: { icon: MinusCircle, className: "text-slate-600" },
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
  PENDING: "STAGED",
  ACTIVE: "RUNNING",
  PAUSED: "PAUSED",
  COMPLETED: "SEALED",
  FAILED: "FAULT",
  CANCELLED: "DROPPED",
};

const PLAN_STATUS_STYLE: Record<PlanStatus, string> = {
  PENDING: "text-slate-400",
  ACTIVE: "text-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]",
  PAUSED: "text-amber drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]",
  COMPLETED: "text-cyan-300 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]",
  FAILED: "text-danger drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]",
  CANCELLED: "text-slate-500",
};

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-700/50 bg-[rgba(15,23,42,0.6)] px-3 py-1 font-data text-[10px] uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md ${PLAN_STATUS_STYLE[status]}`}
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
  DEBUG: "text-slate-500",
  INFO: "text-teal-200",
  WARNING: "text-amber",
  ERROR: "text-danger",
  CRITICAL: "text-danger",
};

const EVENT_TEXT_STYLE: Record<EventLevel, string> = {
  DEBUG: "text-slate-500",
  INFO: "text-slate-100",
  WARNING: "text-amber drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]",
  ERROR: "text-danger drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]",
  CRITICAL: "text-danger drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]",
};

export function EventTypeIcon({ type, level }: { type: EventType; level: EventLevel }) {
  const Icon = EVENT_TYPE_ICON[type];
  return (
    <Icon
      className={`h-3.5 w-3.5 shrink-0 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)] ${EVENT_LEVEL_STYLE[level]}`}
      strokeWidth={2}
    />
  );
}

export function eventLevelTextClass(level: EventLevel): string {
  return EVENT_TEXT_STYLE[level];
}
