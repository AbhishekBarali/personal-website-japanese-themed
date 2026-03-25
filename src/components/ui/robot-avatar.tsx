import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RobotAvatarProps {
  size?: number;
  className?: string;
}

type Expression = 'neutral' | 'happy' | 'sleepy' | 'surprised';

export function RobotAvatar({ size = 96, className = '' }: RobotAvatarProps) {
  const [expression, setExpression] = useState<Expression>('neutral');
  const [blinking, setBlinking] = useState(false);
  const [lookPos, setLookPos] = useState({ x: 0, y: 0 });
  const [lastMouseTime, setLastMouseTime] = useState(Date.now());
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking and idle detection
  useEffect(() => {
    let prevX = 0;
    let prevY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setLastMouseTime(Date.now());
      if (expression === 'sleepy') setExpression('neutral');

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      // If user moves mouse extremely fast, "surprise" the robot
      const speed = Math.abs(dx - prevX) + Math.abs(dy - prevY);
      if (speed > 0.8 && expression !== 'happy' && expression !== 'surprised') {
        setExpression('surprised');
        setTimeout(() => setExpression('neutral'), 1500);
      }
      prevX = dx;
      prevY = dy;

      setLookPos({ x: dx * 4, y: dy * 3 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Fall asleep if idle for 7 seconds
    const idleCheck = setInterval(() => {
      if (Date.now() - lastMouseTime > 7000 && expression !== 'happy' && !isHovered) {
        setExpression('sleepy');
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(idleCheck);
    };
  }, [lastMouseTime, expression, isHovered]);

  // Organic random blinking
  useEffect(() => {
    if (expression === 'sleepy' || expression === 'surprised' || expression === 'happy') return;
    
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150 + Math.random() * 50);
    };
    
    // Sometimes do a cute double blink
    const triggerBlink = () => {
      blink();
      if (Math.random() > 0.7) setTimeout(blink, 250);
    };
    
    const interval = setInterval(triggerBlink, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [expression]);

  // Trigger happy mode when clicked
  const handleInteraction = () => {
    setExpression('happy');
    setTimeout(() => setExpression('neutral'), 2500);
  };

  const isSleeping = expression === 'sleepy';
  const isHappy = expression === 'happy';
  const isSurprised = expression === 'surprised';

  const eyeColor = isSleeping ? "#4a4a6a" : isSurprised ? "#fde047" : "#6ee7b7";
  const eyeHeight = blinking ? 1 : isSleeping ? 2 : isSurprised ? 12 : isHappy ? 5 : 8;
  const eyeWidth = isSurprised ? 10 : isSleeping ? 11 : isHappy ? 8 : 8;
  const eyeYOffset = isSleeping ? 4 : isSurprised ? -2 : isHappy ? -2 : 0;
  
  // Smooth morphing requires paths with the exact same number and type of curves (1 Move + 2 Quads)
  const mouthPath = isHappy 
    ? "M 38 57 Q 44 66 48 66 Q 52 66 58 57" 
    : isSurprised 
      ? "M 45 61 Q 48 57 51 61 Q 48 65 45 61" 
      : isSleeping 
        ? "M 42 62 Q 45 62 48 62 Q 51 62 54 62" 
        : "M 40 60 Q 44 63 48 63 Q 52 63 56 60";

  return (
    <motion.div 
      className={`relative cursor-pointer group ${className}`} 
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
        animate={{
          y: isSleeping ? [0, 3, 0] : 0,
        }}
        transition={{
          duration: isSleeping ? 3 : 0.3,
          repeat: isSleeping ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <defs>
          <radialGradient id="headGlowBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isHappy ? "#f472b6" : "#6366f1"} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isHappy ? "#f472b6" : "#6366f1"} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robotBodyGrad" x1="20" y1="28" x2="76" y2="88">
            <stop offset="0%" stopColor="#24243e" />
            <stop offset="100%" stopColor="#151525" />
          </linearGradient>
          <linearGradient id="robotFaceGrad" x1="26" y1="34" x2="70" y2="66">
            <stop offset="0%" stopColor="#2d2d44" />
            <stop offset="100%" stopColor="#1c1c2e" />
          </linearGradient>
          <linearGradient id="glassReflectionGradiant" x1="26" y1="34" x2="26" y2="44">
             <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
             <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="robotGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background glow */}
        <motion.circle cx="48" cy="52" r="44" fill="url(#headGlowBg)" 
          animate={{ scale: isHappy ? 1.1 : 1 }} transition={{ duration: 0.5 }}
        />

        {/* Dynamic floating elements like Zzz or Hearts */}
        <AnimatePresence>
          {isSleeping && (
            <>
              <motion.text
                initial={{ opacity: 0, y: 10, x: 74 }}
                animate={{ opacity: [0, 1, 0], y: -15, x: 80 }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
                fill="#6ee7b7" fontSize="10" fontWeight="bold"
              >
                z
              </motion.text>
              <motion.text
                initial={{ opacity: 0, y: 0, x: 78 }}
                animate={{ opacity: [0, 1, 0], y: -25, x: 85 }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                fill="#6ee7b7" fontSize="14" fontWeight="bold"
              >
                Z
              </motion.text>
            </>
          )}
          {isHappy && (
            <motion.text
              initial={{ opacity: 0, y: 20, x: 75, scale: 0 }}
              animate={{ opacity: [0, 1, 0], y: -10, x: 80, scale: 1.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              fill="#f472b6" fontSize="16"
            >
              ✨
            </motion.text>
          )}
        </AnimatePresence>

        {/* Wiggling Antenna */}
        <motion.line 
          x1="48" y1="24" x2="48" y2="12" 
          stroke="#4a4a6a" strokeWidth="2.5" strokeLinecap="round" 
          animate={{
            x2: isHappy ? [48, 52, 44, 48] : isSurprised ? 48 : 48,
            y2: isSurprised ? 6 : 12,
          }}
          transition={{ duration: 0.3, repeat: isHappy ? 2 : 0 }}
        />
        <motion.circle 
          cx="48" cy="11" r="4" 
          fill={isHappy ? "#f472b6" : isSurprised ? "#fde047" : "#6366f1"} 
          filter="url(#robotGlow)"
          animate={{
            cx: isHappy ? [48, 52, 44, 48] : 48,
            cy: isSurprised ? 5 : 11,
          }}
          transition={{ duration: 0.3, repeat: isHappy ? 2 : 0 }}
        />

        {/* Ears */}
        <motion.rect x="14" y="44" width="6" height="16" rx="3" fill="#2d2d44" stroke="#4a4a6a" strokeWidth="1" 
          animate={{ y: isHappy ? 42 : isSleeping ? 46 : 44 }} />
        <motion.rect x="76" y="44" width="6" height="16" rx="3" fill="#2d2d44" stroke="#4a4a6a" strokeWidth="1" 
          animate={{ y: isHappy ? 42 : isSleeping ? 46 : 44 }} />
        
        {/* Ear LEDs */}
        <motion.circle cx="17" cy="52" r="1.5" 
          fill={isHappy ? "#f472b6" : "#34d399"} 
          animate={{ opacity: isSleeping ? 0 : [0.4, 0.8, 0.4] }} 
          transition={{ duration: 2, repeat: Infinity }} 
        />
        <motion.circle cx="79" cy="52" r="1.5" 
          fill={isHappy ? "#f472b6" : "#34d399"} 
          animate={{ opacity: isSleeping ? 0 : [0.4, 0.8, 0.4] }} 
          transition={{ duration: 2, repeat: Infinity, delay: 1 }} 
        />

        {/* Head Casing */}
        <rect x="20" y="24" width="56" height="54" rx="18" fill="url(#robotBodyGrad)" stroke="#4a4a6a" strokeWidth="1.5" />

        {/* Glass Face Plate */}
        <rect x="26" y="34" width="44" height="34" rx="12" fill="url(#robotFaceGrad)" stroke="#3f3f5c" strokeWidth="1" />
        <rect x="26" y="34" width="44" height="12" rx="12" fill="url(#glassReflectionGradiant)" />

        <g filter="url(#robotGlow)">
          {/* Eyes & Mouth wrapper group that subtly tracks mouse */}
          <motion.g animate={{ x: isSleeping ? 0 : lookPos.x, y: isSleeping ? 0 : lookPos.y }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            {/* Left eye */}
            <motion.rect
              animate={{
                x: 41 - eyeWidth / 2,
                y: 50 - eyeHeight / 2 + eyeYOffset,
                width: eyeWidth,
                height: eyeHeight,
                rx: eyeHeight > 4 ? 4 : 2,
              }}
              fill={eyeColor}
              transition={{ type: "spring", bounce: 0.5 }}
            />

            {/* Right eye */}
            <motion.rect
              animate={{
                x: 55 - eyeWidth / 2,
                y: 50 - eyeHeight / 2 + eyeYOffset,
                width: eyeWidth,
                height: eyeHeight,
                rx: eyeHeight > 4 ? 4 : 2,
              }}
              fill={eyeColor}
              transition={{ type: "spring", bounce: 0.5 }}
            />

            {/* Morphing Mouth */}
            <motion.path
              animate={{ d: mouthPath }}
              stroke={isSleeping ? "#4a4a6a" : isSurprised ? "#facc15" : "#6ee7b7"}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill={isSurprised ? "#fde047" : "none"}
              opacity={isSleeping ? 0.7 : 1}
              transition={{ type: "spring", bounce: 0.5 }}
            />
          </motion.g>
        </g>

        {/* Cute blush cheeks (only visible when happy) */}
        <AnimatePresence>
          {isHappy && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              filter="url(#robotGlow)"
            >
              <ellipse cx="32" cy="54" rx="4" ry="2" fill="#f472b6" opacity="0.6" />
              <ellipse cx="64" cy="54" rx="4" ry="2" fill="#f472b6" opacity="0.6" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Subtle digital grid lines on faceplate */}
        <path d="M 28 42 L 68 42 M 28 50 L 68 50 M 28 58 L 68 58" stroke="#ffffff" strokeOpacity="0.02" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M 36 36 L 36 66 M 48 36 L 48 66 M 60 36 L 60 66" stroke="#ffffff" strokeOpacity="0.02" strokeWidth="0.5" strokeLinecap="round" />

        {/* Neck */}
        <rect x="40" y="78" width="16" height="8" rx="2" fill="#1a1a2e" stroke="#4a4a6a" strokeWidth="1" />

        {/* Little chest/shoulders */}
        <rect x="30" y="86" width="36" height="10" rx="4" fill="#24243e" stroke="#4a4a6a" strokeWidth="1" />
        
        {/* Chest heartbeat monitor */}
        <motion.circle 
          cx="48" cy="91" r="2.5" 
          fill={isSleeping ? "#4a4a6a" : isHappy ? "#f472b6" : "#34d399"} 
          filter="url(#robotGlow)"
          animate={{ opacity: isSleeping ? 0.2 : [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}

