import { useState, useEffect } from 'react';

interface RobotAvatarProps {
  size?: number;
  className?: string;
}

export function RobotAvatar({ size = 96, className = '' }: RobotAvatarProps) {
  const [blinking, setBlinking] = useState(false);
  const [lookX, setLookX] = useState(0);
  const [lookY, setLookY] = useState(0);

  // Random blinking
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setLookX(dx * 3);
      setLookY(dy * 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const eyeHeight = blinking ? 1 : 8;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Glow behind head */}
        <defs>
          <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bodyGrad" x1="20" y1="28" x2="76" y2="88">
            <stop offset="0%" stopColor="#1e1e2e" />
            <stop offset="100%" stopColor="#13131f" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="24" y1="32" x2="72" y2="72">
            <stop offset="0%" stopColor="#252538" />
            <stop offset="100%" stopColor="#1a1a2e" />
          </linearGradient>
          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="antennaGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx="48" cy="52" r="44" fill="url(#headGlow)" />

        {/* Antenna */}
        <line x1="48" y1="24" x2="48" y2="14" stroke="#3f3f5c" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="48" cy="11" r="4" fill="#6366f1" filter="url(#antennaGlow)" opacity="0.9">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Ears */}
        <rect x="14" y="44" width="6" height="14" rx="3" fill="#252538" stroke="#3f3f5c" strokeWidth="1" />
        <rect x="76" y="44" width="6" height="14" rx="3" fill="#252538" stroke="#3f3f5c" strokeWidth="1" />
        
        {/* Ear lights */}
        <circle cx="17" cy="49" r="1.5" fill="#34d399" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="79" cy="49" r="1.5" fill="#34d399" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin="1.5s" />
        </circle>

        {/* Head */}
        <rect x="20" y="24" width="56" height="52" rx="16" fill="url(#bodyGrad)" stroke="#3f3f5c" strokeWidth="1.5" />

        {/* Face plate */}
        <rect x="26" y="34" width="44" height="32" rx="10" fill="url(#faceGrad)" stroke="#2a2a42" strokeWidth="1" />

        {/* Left eye */}
        <g filter="url(#eyeGlow)">
          <rect
            x={37 + lookX}
            y={blinking ? 50 : 46 + lookY}
            width="8"
            height={eyeHeight}
            rx={blinking ? 0.5 : 4}
            fill="#6ee7b7"
          >
            {!blinking && (
              <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
            )}
          </rect>
        </g>

        {/* Right eye */}
        <g filter="url(#eyeGlow)">
          <rect
            x={53 + lookX}
            y={blinking ? 50 : 46 + lookY}
            width="8"
            height={eyeHeight}
            rx={blinking ? 0.5 : 4}
            fill="#6ee7b7"
          >
            {!blinking && (
              <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" begin="2s" />
            )}
          </rect>
        </g>

        {/* Mouth — small smile */}
        <path
          d="M 41 60 Q 48 64 55 60"
          stroke="#4a4a6a"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheek dots */}
        <circle cx="33" cy="58" r="2.5" fill="#6366f1" opacity="0.15" />
        <circle cx="63" cy="58" r="2.5" fill="#6366f1" opacity="0.15" />

        {/* Forehead detail */}
        <rect x="42" y="37" width="12" height="2" rx="1" fill="#3f3f5c" opacity="0.5" />

        {/* Neck */}
        <rect x="40" y="76" width="16" height="6" rx="2" fill="#1a1a2e" stroke="#2a2a42" strokeWidth="1" />

        {/* Shoulder hint */}
        <rect x="30" y="82" width="36" height="10" rx="5" fill="#1a1a2e" stroke="#2a2a42" strokeWidth="1" />
        
        {/* Chest light */}
        <circle cx="48" cy="87" r="2" fill="#6366f1" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
