import { motion } from "framer-motion";

function AnimatedCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        delay,
        duration: 0.5,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;