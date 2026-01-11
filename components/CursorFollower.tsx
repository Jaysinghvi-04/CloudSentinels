
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorFollower: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const dotX = useSpring(cursorX, { damping: 40, stiffness: 800 });
  const dotY = useSpring(cursorY, { damping: 40, stiffness: 800 });
  
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsHovering(
        target.closest('button') !== null || 
        target.closest('a') !== null || 
        target.closest('[role="button"]') !== null
      );
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-brand-navy/30 dark:border-blue-400/30 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-navy dark:bg-blue-400 rounded-full pointer-events-none z-[9999] hidden md:block shadow-[0_0_10px_rgba(10,36,99,0.5)] dark:shadow-[0_0_10px_rgba(96,165,250,0.5)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 0.5 : 1,
        }}
      />
    </>
  );
};

export default CursorFollower;
