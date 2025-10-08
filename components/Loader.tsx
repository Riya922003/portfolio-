"use client";

import React from "react";
import { motion } from "framer-motion";
import FallingText from './FallingText'; 

interface LoaderProps {
  onComplete?: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [animationComplete, setAnimationComplete] = React.useState(false);

  React.useEffect(() => {
    if (animationComplete && onComplete) {
      // Wait 2 seconds after animation completes, then proceed to main page
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animationComplete, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* Centered text that appears first */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="text-center cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -20 : 0 }}
            transition={{ duration: 0.5 }}
          >
            Building robust and scalable backend systems
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-400 hover:text-cyan-400 transition-colors mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Hover Me
          </motion.p>
        </div>
      </div>

      {/* Falling text animation that starts when hovered */}
      {isHovered && (
        <div className="absolute inset-0">
          <FallingText
            text="Building robust and scalable backend systems..."
            highlightWords={["Building", "robust", "scalable", "backend", "systems"]}
            gravity={0.8}
            fontSize="2.5rem"
            mouseConstraintStiffness={0.1}
            trigger="auto"
            onAnimationComplete={() => setAnimationComplete(true)}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Loader;