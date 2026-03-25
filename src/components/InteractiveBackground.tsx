import { useEffect, useRef } from 'react';

// --- THE CALLIGRAPHY SILK ---
// A highly-tuned, elegant spring-chain physics ribbon that trails the cursor.
const POINTS = 100; // Optimal length for deep smoothness
const TENSION = 0.5; // High responsiveness
const DAMPING = 0.4; // Strong friction to prevent chaos/rubber-banding
const GRAVITY = 0.2; // Gentle drifting weight

interface Segment {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function createRibbon(length: number): Segment[] {
  return Array.from({ length }).map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Two intertwining ribbons
    const ribbonPrimary = createRibbon(POINTS); // Deep Crimson
    const ribbonShadow = createRibbon(POINTS);  // Pure Black Ink

    // Mouse
    let targetX = w / 2;
    let targetY = h / 2;
    // Hide initially by pulling it way offscreen until mouse moves
    let started = false;

    // Optional: Add some slow orbital motion when idle so the ribbon stays alive
    let idleTime = 0;
    let canvasOpacity = 0; // Starts hidden so we fade in elegantly

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as Element;
      // Detect if hover is over a Portfolio Card or Modal
      const isOverUI = target.closest('.backdrop-blur-xl, .backdrop-blur-2xl, a, button');

      if (isOverUI) {
        // The user crossed into an opaque UI element!
        // Instantly force 'idle' mode so the ribbon stops moving and rapidly fades out
        idleTime = 999;
      } else {
        if (!started) {
          started = true;
          // Snap instantly to mouse on first move
          ribbonPrimary.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
          ribbonShadow.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
        }
        targetX = e.clientX;
        targetY = e.clientY;
        idleTime = 0;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let time = 0;

    const render = () => {
      // Clear the canvas completely so it remains transparent over the foreground UI
      ctx.clearRect(0, 0, w, h);
      
      time += 0.05;
      idleTime += 1;

      // --- SMART FADE LOGIC ---
      // If idle for ~1.5s (90 frames), slowly fade the canvas out to 0 so the user can read unblocked
      // If idleTime > 900 (hovering a box), fade out 3x faster
      if (idleTime > 90) {
        const fadeSpeed = idleTime > 900 ? 0.06 : 0.02;
        canvasOpacity = Math.max(0, canvasOpacity - fadeSpeed);
      } else if (started) {
        canvasOpacity = Math.min(1, canvasOpacity + 0.1); // Fast fade in
      }
      canvas.style.opacity = canvasOpacity.toString();

      // If fully invisible, we still update physics but nothing visually breaks
      
      // If idle, the cursor naturally breathes/orbits to keep the ribbon floating
      let leadX = targetX;
      let leadY = targetY;
      
      if (idleTime > 60) {
        const breathing = (idleTime - 60) * 0.005;
        // Gentle figure-8 breathing
        leadX += Math.sin(breathing) * 30;
        leadY += Math.sin(breathing * 2) * 15;
      }

      // Update Ribbon 1 (Primary Crimson)
      ribbonPrimary[0].x = leadX + Math.sin(time) * 4; // slight sine wobble at the head
      ribbonPrimary[0].y = leadY + Math.cos(time) * 4;
      
      for (let i = 1; i < POINTS; i++) {
        const curr = ribbonPrimary[i];
        const prev = ribbonPrimary[i - 1];

        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;

        // Hooke's Law (Spring)
        curr.vx += dx * TENSION;
        curr.vy += dy * TENSION;

        // Gravity pulls it down slowly
        curr.vy += GRAVITY;

        // Friction dampens wild swings making it feel like underwater silk
        curr.vx *= DAMPING;
        curr.vy *= DAMPING;

        curr.x += curr.vx;
        curr.y += curr.vy;
      }

      // Update Ribbon 2 (Shadow Black) runs slightly behind and offsets
      ribbonShadow[0].x = leadX - Math.sin(time) * 6;
      ribbonShadow[0].y = leadY - Math.cos(time) * 6;
      for (let i = 1; i < POINTS; i++) {
        const curr = ribbonShadow[i];
        const prev = ribbonShadow[i - 1];
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        // Slightly looser tension for the shadow
        curr.vx += dx * 0.45; 
        curr.vy += dy * 0.45;
        curr.vy += GRAVITY * 1.5; // Heavier
        curr.vx *= 0.5; // Different fluid drag
        curr.vy *= 0.5;
        curr.x += curr.vx;
        curr.y += curr.vy;
      }

      // Draw Ribbon Function
      const drawRibbon = (ribbon: Segment[], r: number, g: number, b: number, maxThickness: number) => {
        if (!started) return;
        
        ctx.lineCap = 'butt'; // Remove overlapping round caps that create visible dots
        ctx.lineJoin = 'miter';

        // Draw piecewise with decreasing opacity and thickness for tapering effect
        for (let i = 0; i < POINTS - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(ribbon[i].x, ribbon[i].y);
          ctx.lineTo(ribbon[i + 1].x, ribbon[i + 1].y);
          
          // Taper the thickness
          const thicknessScale = 1 - (i / POINTS);
          ctx.lineWidth = maxThickness * thicknessScale;
          
          // Taper the opacity
          const opacity = Math.pow(thicknessScale, 1.5);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          
          // Glow effect at the head
          if (i < 10) {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
            ctx.shadowBlur = 10 * (1 - i / 10);
          } else {
            ctx.shadowBlur = 0;
          }
          
          ctx.stroke();
        }
      };

      // Draw shadow/ink ribbon first (underneath)
      drawRibbon(ribbonShadow, 5, 5, 5, 30);
      
      // Draw primary glowing amber/pearl ribbon (on top) - deeply satisfying ASMR feel
      drawRibbon(ribbonPrimary, 252, 211, 77, 18); // #fcd34d

      // --- ELEGANT DOT CURSOR (Hardware) ---
      // We rely on the global CSS hardware cursor so we don't draw it on the background canvas anymore
      // which prevents it from being hidden behind UI text.

      animId = requestAnimationFrame(render);
    };
    
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <style>{`* { cursor: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='4' fill='%23ffffff' filter='blur(1px)' /%3E%3Ccircle cx='6' cy='6' r='2' fill='%23fcd34d' /%3E%3C/svg%3E") 6 6, auto !important; }`}</style>
      
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#110f0e] pointer-events-none">
        {/* Old parchment texture via SVG noise */}
        <div
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated Ink Wash / Mountain Abstractions */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[60vh] bg-[#0c0a0c] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[40px] opacity-90 animate-[spin_30s_linear_infinite]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[50vh] bg-[#080708] rounded-[50%_50%_30%_70%/50%_40%_60%_50%] blur-[60px] opacity-90 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[30vh] bg-[#1a1412] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[50px] opacity-40 animate-[spin_25s_linear_infinite]" />

        {/* Soft Ambient Golden/Amber Gradient */}
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] max-w-[900px] aspect-square bg-[#4a3000] rounded-full mix-blend-screen opacity-20 blur-[150px]" />

        {/* High-Performance Canvas for Calligraphy Silk Ribbon (Background) */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-100 pointer-events-none" />

        {/* Intense Vignette Overlay for Moody Lighting */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, #000000 130%)', opacity: 0.85 }} />
      </div>
    </>
  );
}
