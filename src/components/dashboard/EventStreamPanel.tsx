"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MockEvent } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/format-time";
import { listItemVariants, springTransition } from "@/lib/motion";
import { EventTypeIcon, PulseDot, eventLevelTextClass } from "./status";

export function EventStreamPanel({ events, now }: { events: MockEvent[]; now: Date }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 130, damping: 20, delay: 0.12 }}
      className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-[rgba(15,23,42,0.6)] shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md lg:sticky lg:top-28"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#1d4ed8] opacity-20 blur-[90px]" />

      <div className="relative flex items-center justify-between border-b border-slate-700/50 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <PulseDot />
          <h2 className="font-data text-[11px] uppercase tracking-[0.28em] text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
            live event stream
          </h2>
        </div>
        <span className="rounded-full border border-slate-700/50 bg-slate-900/70 px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.2em] text-teal-200 shadow-[0_0_15px_rgba(56,189,248,0.3)] drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
          {events.length} signals
        </span>
      </div>

      <div className="thin-scrollbar relative max-h-[590px] overflow-y-auto p-3 lg:max-h-[calc(100vh-14rem)]">
        <div className="absolute bottom-0 left-7 top-3 w-px bg-gradient-to-b from-blue-500 via-cyan-400 to-teal-400 opacity-50 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
        <AnimatePresence initial={false} mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              variants={listItemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springTransition}
              className="group relative mb-2 flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3.5 transition-colors last:mb-0 hover:border-slate-700/50 hover:bg-slate-900/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <span className="relative z-10 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-slate-700/50 bg-slate-950/70 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-transform group-hover:scale-105">
                <EventTypeIcon type={event.type} level={event.level} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-data text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-slate-700/70 to-transparent" />
                </div>
                <p className={`text-sm leading-6 ${eventLevelTextClass(event.level)}`}>
                  {event.message}
                </p>
                <div className="mt-2 flex min-w-0 items-center gap-2 font-data text-[11px] text-slate-500">
                  <span className="truncate">{event.planTitle}</span>
                  <span aria-hidden className="text-teal-300">
                    /
                  </span>
                  <span className="shrink-0 text-cyan-300 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
                    {formatRelativeTime(event.createdAt, now)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
