"use client";

import { motion, useReducedMotion } from "framer-motion";

const PERIOD = 260;
const REPEATS = 3;

const BASE_MOTIF: Array<[number, number]> = [
  [0, 22],
  [0.12, 22],
  [0.16, 14],
  [0.19, 22],
  [0.24, 22],
  [0.28, 3],
  [0.33, 38],
  [0.38, 22],
  [0.58, 22],
  [0.62, 10],
  [0.66, 30],
  [0.7, 22],
  [1, 22],
];

function buildPulsePath(period: number, repeats: number): string {
  const points: Array<[number, number]> = [];
  for (let r = 0; r < repeats; r++) {
    for (const [fx, y] of BASE_MOTIF) {
      points.push([r * period + fx * period, y]);
    }
  }

  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y}`).join(" ");
}

const PULSE_PATH = buildPulsePath(PERIOD, REPEATS);

function PulseTrace() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-8 w-full overflow-hidden border-t border-slate-700/50">
      <motion.svg
        className="absolute inset-y-0 left-0 h-full text-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]"
        style={{ width: PERIOD * REPEATS }}
        viewBox={`0 0 ${PERIOD * REPEATS} 44`}
        preserveAspectRatio="none"
        animate={reduceMotion ? undefined : { x: [0, -PERIOD] }}
        transition={reduceMotion ? undefined : { duration: 4.8, ease: "linear", repeat: Infinity }}
      >
        <path
          d={PULSE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.45}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <path
          d={PULSE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.12}
        />
      </motion.svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#010510] via-transparent to-[#010510]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="group flex items-center gap-2 rounded-full border border-slate-700/50 bg-[rgba(15,23,42,0.6)] px-3 py-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
      <span className="font-data text-sm text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
        {value}
      </span>
      <span className="font-data text-[10px] uppercase tracking-[0.22em] text-slate-400 group-hover:text-teal-200">
        {label}
      </span>
    </span>
  );
}

export function PulseHeader({
  activePlanCount,
  inProgressTaskCount,
  lastEventLabel,
}: {
  activePlanCount: number;
  inProgressTaskCount: number;
  lastEventLabel: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/50 bg-[rgba(1,5,16,0.74)] shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 130, damping: 18 }}
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-4">
          <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-slate-700/50 bg-[rgba(15,23,42,0.6)] shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
            <div className="h-3 w-3 rounded-full bg-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]" />
            <div className="absolute inset-1.5 rounded-xl border border-slate-700/50" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold tracking-[0.02em] text-slate-100 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
                OMNI<span className="px-1 text-teal-200">/</span>PULSE
              </span>
              <span className="hidden font-data text-[10px] uppercase tracking-[0.36em] text-slate-500 sm:inline">
                command deck
              </span>
            </div>
            <p className="mt-0.5 font-data text-[10px] uppercase tracking-[0.28em] text-teal-200 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
              autonomous agent telemetry
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 font-data text-xs">
          <Stat label="active plans" value={activePlanCount} />
          <Stat label="in progress" value={inProgressTaskCount} />
          <span className="rounded-full border border-slate-700/50 bg-[rgba(15,23,42,0.6)] px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.2em] text-slate-400 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md">
            last event{" "}
            <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(167,243,208,0.7)]">
              {lastEventLabel}
            </span>
          </span>
        </div>
      </motion.div>
      <PulseTrace />
    </header>
  );
}
