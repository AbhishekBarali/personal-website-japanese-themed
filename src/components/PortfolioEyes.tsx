import { useRef, useEffect } from 'react';

interface PortfolioEyesProps {
  size?: number;
  className?: string;
}

export default function PortfolioEyes({ size = 48, className = '' }: PortfolioEyesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pupil1Ref = useRef<HTMLDivElement>(null);
  const pupil2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maxMove = size * 0.2;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);

      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.min(dist / 300, 1);

      const px = Math.cos(angle) * maxMove * intensity;
      const py = Math.sin(angle) * maxMove * intensity;

      if (pupil1Ref.current) {
        pupil1Ref.current.style.transform = `translate(${px}px, ${py}px)`;
      }
      if (pupil2Ref.current) {
        pupil2Ref.current.style.transform = `translate(${px}px, ${py}px)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [size]);

  const eyeSize = size;
  const pupilSize = size * 0.35;
  const glintSize = size * 0.12;
  const gap = size * 0.15;

  return (
    <div
      ref={containerRef}
      className={`flex items-center ${className}`}
      style={{ gap }}
    >
      {[pupil1Ref, pupil2Ref].map((ref, i) => (
        <div
          key={i}
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: eyeSize,
            height: eyeSize,
            background: 'radial-gradient(circle at 35% 35%, #f0f0f0, #d4d4d4)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), 0 0 20px rgba(255,180,80,0.15)',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            ref={ref}
            className="absolute rounded-full"
            style={{
              width: pupilSize,
              height: pupilSize,
              background: 'radial-gradient(circle at 40% 40%, #333, #0a0a0a)',
              transition: 'transform 30ms ease-out',
            }}
          >
            <div
              className="absolute rounded-full bg-white"
              style={{
                width: glintSize,
                height: glintSize,
                bottom: '15%',
                right: '15%',
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
