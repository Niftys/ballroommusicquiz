'use client'; // Ensure this is a client component
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AnimationWrapper({ children }) {
  const pathname = usePathname(); // Get current route for keying transitions

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // Ensure animations are triggered for page changes
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
