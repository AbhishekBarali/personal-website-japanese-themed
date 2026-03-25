import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Outer aura spring (smooth, floaty trailing effect)
  const cursorXSpring = useSpring(useMotionValue(-100), { damping: 25, stiffness: 120, mass: 0.5 });
  const cursorYSpring = useSpring(useMotionValue(-100), { damping: 25, stiffness: 120, mass: 0.5 });

  // Inner dot (snappy, immediate feel like a hardware cursor)
  const dotXSpring = useSpring(useMotionValue(-100), { damping: 30, stiffness: 400, mass: 0.2 });
  const dotYSpring = useSpring(useMotionValue(-100), { damping: 30, stiffness: 400, mass: 0.2 });

  useEffect(() => {
    // Disable entirely on mobile to save performance
    if (window.innerWidth < 768) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      // Hardware-accelerated transforms don't cause React re-renders!
      cursorXSpring.set(e.clientX);
      cursorYSpring.set(e.clientY);
      
      dotXSpring.set(e.clientX);
      dotYSpring.set(e.clientY);
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorXSpring, cursorYSpring, dotXSpring, dotYSpring, isVisible]);

  return (
    <>
      {/* Hide default cursor only if on a large screen so it doesn't break mobile touch */}
      <style>{`
        @media (min-width: 768px) {
          * { cursor: none !important; }
        }
      `}</style>
      
      {/* Smooth Trailing Glow Aura */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998] hidden md:flex items-center justify-center mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0
        }}
        transition={{ opacity: { duration: 0.5 } }}
      >
        <div className="absolute inset-0 bg-amber-400/20 blur-[12px] rounded-full scale-150"></div>
        <div className="absolute inset-0 bg-amber-300/10 blur-md rounded-full"></div>
      </motion.div>

      {/* Immediate Hardware-Like Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] hidden md:block mix-blend-screen"
        style={{
          x: dotXSpring,
          y: dotYSpring,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0
        }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <div className="w-full h-full bg-white rounded-full shadow-[0_0_8px_rgba(252,211,77,1)]"></div>
      </motion.div>
    </>
  );
}
