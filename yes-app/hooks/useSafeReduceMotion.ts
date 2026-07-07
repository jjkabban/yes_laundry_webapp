import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

export function useSafeReducedMotion() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? prefersReduced : false;
}
