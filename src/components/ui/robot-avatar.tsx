import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RobotAvatarProps {
  size?: number;
  className?: string;
}

type Expression = 'neutral' | 'happy' | 'sleepy' | 'surprised' | 'impressed';

export function RobotAvatar({ size = 96, className = '' }: RobotAvatarProps) {
  const [expression, setExpression] = useState<Expression>('neutral');
  const [blinking, setBlinking] = useState(false);
  const [lookPos, setLookPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const impressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Use ref instead of state to avoid re-renders on every mouse move
  const lastMouseTimeRef = useRef(Date.now());
  const rafIdRef = useRef(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Just store the timestamp — no state update, no re-render
      lastMouseTimeRef.current = Date.now();

      // Throttle the actual processing to one RAF per frame
      if (rafIdRef.current) return;
      
      const clientX = e.clientX;
      const clientY = e.clientY;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = 0;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        
        const isOutsideBox = Math.abs(clientX - cx) > 320 || Math.abs(clientY - cy) > 240;

        setExpression(prev => {
          if (prev === 'happy') return 'happy';
          
          if (isOutsideBox) {
            if (impressTimeoutRef.current) clearTimeout(impressTimeoutRef.current);
            impressTimeoutRef.current = setTimeout(() => {
              setExpression(curr => curr === 'impressed' ? 'neutral' : curr);
            }, 800);
            return 'impressed';
          } else {
            return (prev === 'impressed' || prev === 'sleepy') ? 'neutral' : prev;
          }
        });

        const dx = (clientX - cx) / cx;
        const dy = (clientY - cy) / cy;

        setLookPos({ x: dx * 4, y: dy * 3 });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const idleCheck = setInterval(() => {
      if (Date.now() - lastMouseTimeRef.current > 6000 && !isHovered) {
        setExpression(prev => (prev !== 'happy' && prev !== 'impressed') ? 'sleepy' : prev);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(idleCheck);
      if (impressTimeoutRef.current) clearTimeout(impressTimeoutRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isHovered]);

  useEffect(() => {
    if (expression === 'sleepy' || expression === 'happy' || expression === 'surprised' || expression === 'impressed') return;
    
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };
    
    const triggerBlink = () => {
      blink();
      if (Math.random() > 0.4) setTimeout(blink, 200);
    };
    
    const interval = setInterval(triggerBlink, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [expression]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleInteraction = useCallback(() => {
    setExpression('happy');
    setTimeout(() => {
      setExpression(prev => prev === 'happy' ? 'neutral' : prev);
    }, 2500);
  }, []);

  const isSleeping = expression === 'sleepy';
  const isHappy = expression === 'happy';
  const isSurprised = expression === 'surprised';
  const isImpressed = expression === 'impressed';

  const springTransition = { type: "spring", stiffness: 200, damping: 20 };

  const eyeHeight = blinking ? 1 : isSleeping ? 2 : (isSurprised || isImpressed) ? 16 : isHappy ? 8 : 10;
  const eyeWidth = (isSurprised || isImpressed) ? 14 : 8;
  const eyeColor = "#0f172a";

  const mouthPaths = {
    neutral: "M 44 60 Q 46 63 48 63 Q 50 63 52 60",
    happy:   "M 42 59 Q 45 66 48 66 Q 51 66 54 59",
    sleepy:  "M 44 61 Q 46 61 48 61 Q 50 61 52 61",
    surprised: "M 46 60 Q 48 55 50 60 Q 48 65 46 60",
    impressed: "M 44 60 Q 48 52 52 60 Q 48 68 44 60" 
  };

  return (
    <motion.div 
      ref={containerRef}
      className={`relative cursor-pointer group select-none ${className}`} 
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleInteraction}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <radialGradient id="foxWhite" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
          <filter id="blushGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          animate={{
            y: isSleeping ? [0, 2, 0] : isSurprised ? -4 : isImpressed ? -2 : isHappy ? [0, -4, 0] : [0, -1, 0],
            scale: isSurprised ? 1.05 : isImpressed ? 1.02 : 1
          }}
          transition={{
            duration: isSleeping ? 4 : isSurprised ? 0.4 : isImpressed ? 0.3 : isHappy ? 1.5 : 3,
            repeat: (isSleeping || isHappy || expression === 'neutral') ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Head Base */}
          <rect x="16" y="24" width="64" height="60" rx="30" fill="url(#foxWhite)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

          {/* Face Elements - Track Mouse */}
          <motion.g animate={{ x: lookPos.x, y: lookPos.y }} transition={springTransition}>
            
            {/* Left Cheek */}
            <motion.ellipse 
              cx="28" cy="62" rx="6" ry="3" fill="#f43f5e" filter="url(#blushGlow)"
              animate={{ opacity: isHappy ? 0.6 : 0, y: isHappy ? -1 : 0 }} transition={springTransition} 
            />
            {/* Right Cheek */}
            <motion.ellipse 
              cx="68" cy="62" rx="6" ry="3" fill="#f43f5e" filter="url(#blushGlow)"
              animate={{ opacity: isHappy ? 0.6 : 0, y: isHappy ? -1 : 0 }} transition={springTransition} 
            />

            {/* Left Eye */}
            <motion.g>
              <motion.rect
                animate={{ x: 34 - eyeWidth / 2, y: 56 - eyeHeight / 2, width: eyeWidth, height: eyeHeight, rx: eyeWidth / 2 }}
                fill={eyeColor} transition={springTransition}
              />
              <motion.circle
                animate={{ 
                  x: 34 - 1.5, 
                  y: 56 - eyeHeight / 2 - Math.max(0, eyeHeight / 4) + (isImpressed ? 2 : 0), 
                  opacity: eyeHeight > 4 ? 0.9 : 0,
                  r: isImpressed ? 2.5 : 1.5
                }}
                fill="#ffffff" transition={springTransition}
              />
            </motion.g>
            
            {/* Right Eye */}
            <motion.g>
              <motion.rect
                animate={{ x: 62 - eyeWidth / 2, y: 56 - eyeHeight / 2, width: eyeWidth, height: eyeHeight, rx: eyeWidth / 2 }}
                fill={eyeColor} transition={springTransition}
              />
              <motion.circle
                animate={{ 
                  x: 62 - 1.5, 
                  y: 56 - eyeHeight / 2 - Math.max(0, eyeHeight / 4) + (isImpressed ? 2 : 0), 
                  opacity: eyeHeight > 4 ? 0.9 : 0,
                  r: isImpressed ? 2.5 : 1.5
                }}
                fill="#ffffff" transition={springTransition}
              />
            </motion.g>

            {/* Mouth */}
            <motion.path
              animate={{ 
                d: mouthPaths[expression],
                fill: (isSurprised || isImpressed) ? eyeColor : "none" 
              }}
              stroke={eyeColor} strokeWidth="2" strokeLinecap="round" transition={springTransition}
            />
          </motion.g>
        </motion.g>
        
        {/* Floating shadow at bottom */}
        <motion.ellipse
          cx="48" cy="94" rx="20" ry="3" fill="rgba(0,0,0,0.15)" filter="blur(2px)"
          animate={{
            rx: isSleeping ? 24 : isSurprised ? 16 : isHappy ? 18 : 20,
            opacity: isSleeping ? 0.3 : isSurprised ? 0.1 : 0.2
          }}
          transition={{
            duration: isSleeping ? 4 : isSurprised ? 0.4 : isHappy ? 1.5 : 3,
            repeat: (isSleeping || isHappy || expression === 'neutral') ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </motion.div>
  );
}
