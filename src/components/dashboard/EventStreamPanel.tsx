"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MockEvent } from "@/lib/mock-data";
import { listItemVariants, springTransition } from "@/lib/motion";
import { EventTypeIcon, PulseDot, eventLevelTextClass } from "./status";
import { formatRelativeTime } from "@/lib/format-time";

export function EventStreamPanel({ events, now }: { events: MockEvent[]; now: Date }) {
  return (
    <div className="rounded-2xl border border-line bg-panel/80 backdrop-blur-sm lg:sticky lg:top-28">
      <div className="flex items-center gap-2 border-b border-line px-5 py-4">
        <PulseDot />
        <h2 className="font-data text-xs uppercase tracking-[0.2em] text-ink-dim">
          live event stream
        </h2>
      </div>

      <div className="max-h-[560px] overflow-y-auto p-2 lg:max-h-[calc(100vh-14rem)]">
        <AnimatePresence initial={false} mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              layout
              variants={listItemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springTransition}
              className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 hover:bg-panel-raised/60"
            >
              <span className="mt-0.5">
                <EventTypeIcon type={event.type} level={event.level} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm leading-snug ${eventLevelTextClass(event.level)}`}>
                  {event.message}
                </p>
                <div className="mt-1 flex items-center gap-2 font-data text-[11px] text-ink-dim/70">
                  <span className="truncate">{event.planTitle}</span>
                  <span aria-hidden>·</span>
                  <span className="shrink-0">{formatRelativeTime(event.createdAt, now)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
