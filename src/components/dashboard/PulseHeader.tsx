"use client";

import { motion, useReducedMotion } from "framer-motion";

const PERIOD = 240;
const REPEATS = 2;

/** One "life-sign" blip per period: flat → spike down → spike up → flat, twice per period. */
const BASE_MOTIF: Array<[number, number]> = [
  [0, 20],
  [0.2, 20],
  [0.24, 4],
  [0.28, 34],
  [0.32, 20],
  [0.6, 20],
  [0.64, 10],
  [0.68, 30],
  [0.72, 20],
  [1, 20],
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
    <div className="relative h-6 w-full overflow-hidden">
      <motion.svg
        className="absolute inset-y-0 left-0 h-full"
        style={{ width: PERIOD * REPEATS }}
        viewBox={`0 0 ${PERIOD * REPEATS} 40`}
        preserveAspectRatio="none"
        animate={reduceMotion ? undefined : { x: [0, -PERIOD] }}
        transition={
          reduceMotion ? undefined : { duration: 4, ease: "linear", repeat: Infinity }
        }
      >
        <path
          d={PULSE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-pulse/70"
        />
      </motion.svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="font-display text-sm text-ink">{value}</span>
      <span className="uppercase tracking-[0.15em] text-ink-dim">{label}</span>
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
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            OMNI <span className="text-pulse">·</span> PULSE
          </span>
          <span className="hidden font-data text-[11px] uppercase tracking-[0.25em] text-ink-dim sm:inline">
            command deck
          </span>
        </div>
        <div className="flex items-center gap-5 font-data text-xs">
          <Stat label="active plans" value={activePlanCount} />
          <Stat label="in progress" value={inProgressTaskCount} />
          <span className="hidden text-ink-dim sm:inline">last event {lastEventLabel}</span>
        </div>
      </div>
      <PulseTrace />
    </header>
  );
}
