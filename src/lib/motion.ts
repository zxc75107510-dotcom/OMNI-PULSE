import type { Transition } from "framer-motion";

/** Shared spring physics for list reflow — new items must physically push old ones aside. */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
};

export const listItemVariants = {
  initial: { opacity: 0, y: -12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};
