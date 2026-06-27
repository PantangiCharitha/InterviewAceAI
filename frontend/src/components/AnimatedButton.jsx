import { motion } from "framer-motion";

function AnimatedButton({
  children,
  className,
  onClick,
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;