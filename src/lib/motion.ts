import type { Transition } from "framer-motion";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 20,
  mass: 0.72,
};

export const listItemVariants = {
  initial: { opacity: 0, y: 22, scale: 0.965, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    filter: "blur(6px)",
    transition: { duration: 0.18 },
  },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.11, delayChildren: 0.08 },
  },
};
