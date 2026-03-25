import { useEffect, useRef } from 'react';

// Rising Embers Physics Sandbox
const DRAG = 0.012;
const UPDRAFT = -0.005; // Constant upward pulling force (heat)
const MAX_EMBERS = 150;
const MAX_SPARKS = 250;

interface Ember {
  x: number;
  y: number;
  z: number; // 0.2 to 1.0 (depth layer)
  size: number;
  vx: number;
  vy: number;
  baseVx: number; // For slow horizontal sway
  swayPhase: number;
  swaySpeed: number;
  heat: number; // 0 to 1, increases when near cursor
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1.0 down to 0.0
  color: string;
  size: number;
}

const EMBER_COLORS = [
  '#ff2a00', // Intense red-orange
  '#ff5500', // Orange
  '#ff8800', // Bright orange
  '#cc0000', // Dark crimson
  '#ffcccc', // White-hot pink
];

function createEmber(w: number, h: number, offscreen: boolean, overrideY?: number): Ember {
  const z = Math.random() * 0.8 + 0.2; 
  return {
    x: Math.random() * w,
    y: overrideY ?? (offscreen ? h + Math.random() * 80 : Math.random() * h),
    z,
    size: (Math.random() * 2.5 + 1.5) * z, // 1.5px to 4px
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() * -0.5 - 0.2) * z, // Upward starting velocity
    baseVx: (Math.random() - 0.5) * 0.3,
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.01 + 0.005,
    heat: 0,
    color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
  };
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

    let embers: Ember[] = Array.from({ length: 80 }).map(() => createEmber(w, h, false));
    let sparks: Spark[] = [];
    
    // Track mouse kinematics for fluid turbulence
    let cursorX = w / 2;
    let cursorY = h / 2;
    let lastCursorX = w / 2;
    let lastCursorY = h / 2;
    let mouseVx = 0;
    let mouseVy = 0;

    let isMouseDown = false;
    let clickRipple = { x: -100, y: -100, radius: 0 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastCursorX = cursorX;
      lastCursorY = cursorY;
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      mouseVx = cursorX - lastCursorX;
      mouseVy = cursorY - lastCursorY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      clickRipple = { x: e.clientX, y: e.clientY, radius: 1 };
    };
    
    const handleMouseUp = () => {
      isMouseDown = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);

    let time = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      time += 1;

      // Mouse velocity decay (prevents infinite wind)
      mouseVx *= 0.85;
      mouseVy *= 0.85;

      // --- PROCESS CLICK RIPPLE ---
      if (clickRipple.radius > 0) {
        clickRipple.radius += 12; // Expands quickly
        
        ctx.beginPath();
        ctx.arc(clickRipple.x, clickRipple.y, clickRipple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 100, 50, ${Math.max(0, 1 - clickRipple.radius / 250)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (clickRipple.radius > 250) {
          clickRipple.radius = 0; // Die out
        }
      }

      // --- GRADUALLY ADD NEW EMBERS (Up to MAX) ---
      if (embers.length < MAX_EMBERS && Math.random() < 0.1) {
        embers.push(createEmber(w, h, true));
      }

      // --- PROCESS EMBERS ---
      for (let i = embers.length - 1; i >= 0; i--) {
        const p = embers[i];
        
        // 1. Natural Heat Updraft & Gravity
        // As heat increases, updraft becomes aggressively faster to simulate boiling
        const actualUpdraft = UPDRAFT - (p.heat * 0.05);
        p.vy += actualUpdraft * p.z; 

        // 2. Slow horizontal heat variance (Sway)
        p.vx += Math.sin(time * p.swaySpeed + p.swayPhase) * 0.01 * p.z;
        p.vx += (p.baseVx - p.vx) * 0.005; // Return to baseline sway

        // 3. Fluid Mouse Interaction (The "Wind Wake")
        const dx = p.x - cursorX;
        const dy = p.y - cursorY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Suction / Vortex effect
        if (dist < 180) {
          const force = 1 - Math.pow(dist / 180, 2); // Ease out
          
          // Drag along with mouse (turbulent wake)
          p.vx += mouseVx * force * 0.005 * p.z;
          p.vy += mouseVy * force * 0.005 * p.z;

          // If mouse is being held down, it acts as a Black Hole (Implosion)
          if (isMouseDown) {
            p.vx -= (dx / dist) * force * 0.3;
            p.vy -= (dy / dist) * force * 0.3;
            p.heat = Math.min(1, p.heat + 0.04); // Heats up immensely under pressure
          } else {
            // Passive heat buildup when near the cursor
            p.heat = Math.min(1, p.heat + 0.008);
          }
        } else {
          // Slow cooling when away from cursor
          p.heat = Math.max(0, p.heat - 0.02);
        }

        // Click Ripple physics (Blow away)
        if (clickRipple.radius > 0) {
          const rDx = p.x - clickRipple.x;
          const rDy = p.y - clickRipple.y;
          const rDist = Math.sqrt(rDx * rDx + rDy * rDy);
          if (Math.abs(rDist - clickRipple.radius) < 30) {
            const blast = 50 / Math.max(rDist, 1);
            p.vx += (rDx / rDist) * blast;
            p.vy += (rDy / rDist) * blast;
            p.heat = Math.min(1, p.heat + 0.2); // Spikes heat
          }
        }

        // 4. Explosion! If ember reaches max heat, it ignites into sparks
        if (p.heat >= 1.0) {
          // Spawn sparks
          const sparkCount = Math.floor(Math.random() * 4) + 3;
          for (let s = 0; s < sparkCount; s++) {
            if (sparks.length < MAX_SPARKS) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 4 + 2;
              sparks.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(angle) * speed + p.vx * 0.5,
                vy: Math.sin(angle) * speed + p.vy * 0.5,
                life: 1.0,
                size: Math.random() * 1.5 + 0.5,
                color: Math.random() > 0.5 ? '#ffffff' : '#ffddaa' // White/Yellow-hot
              });
            }
          }
          
          // Recycle the ember back to the bottom
          Object.assign(p, createEmber(w, h, true));
          continue; // Skip rendering for this frame since it blew up
        }

        // 5. Apply Drag and Position
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0) {
          const dragF = DRAG * speed;
          p.vx -= (p.vx / speed) * dragF;
          p.vy -= (p.vy / speed) * dragF;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Screen wrap
        if (p.y < -50 || p.x > w + 50 || p.x < -50) {
          Object.assign(p, createEmber(w, h, true));
        }

        // --- DRAW EMBER ---
        ctx.beginPath();
        // Base physics dictate size, but heat overrides it with an explosive glow
        const currentSize = p.size + Math.pow(p.heat, 2) * 3;
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        
        ctx.fillStyle = p.heat > 0.8 ? '#ffffff' : (p.heat > 0.4 ? '#ffddaa' : p.color);
        
        // Embers in the background are naturally blurred
        if (p.z < 0.5) {
          ctx.globalAlpha = 0.5;
          ctx.shadowBlur = 0; // Less expensive
        } else {
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = p.heat > 0.2 ? 15 : 6;
          ctx.shadowColor = ctx.fillStyle;
        }

        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // --- PROCESS SPARKS ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        
        s.vy += GRAVITY_SPARK; // Sparks have massive gravity, like fireworks
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.02; // Fast death

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // Draw spark as a stretched line along its velocity vector
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5); // Tail
        
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.globalAlpha = s.life;
        ctx.shadowBlur = 5;
        ctx.shadowColor = s.color;
        
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };
    
    // Spark gravity constant inside effect purely
    const GRAVITY_SPARK = 0.08;

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Global CSS for the Forge Ring Cursor */}
      <style>{`* { cursor: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 2 A 14 14 0 1 1 15.9 2' fill='none' stroke='%23ff1a1a' stroke-width='1.5' opacity='0.7' /%3E%3Ccircle cx='16' cy='16' r='3.5' fill='%23ffffff' /%3E%3Ccircle cx='16' cy='16' r='8' fill='%23ff5500' opacity='0.2' filter='blur(2px)' /%3E%3C/svg%3E") 16 16, crosshair !important; }`}</style>
      
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

        {/* Crimson Sun/Moon */}
        <div className="absolute top-[10%] right-[15%] w-[35vw] max-w-[400px] aspect-square bg-[#8b0000] rounded-full mix-blend-screen opacity-50 blur-[80px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[15%] right-[20%] w-[20vw] max-w-[200px] aspect-square bg-[#ff3333] rounded-full mix-blend-screen opacity-40 blur-[40px]" />

        {/* Canvas Layer for the Rising Embers */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-80" />

        {/* Intense Vignette Overlay for Moody Lighting */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, #000000 120%)', opacity: 0.85 }} />
      </div>
    </>
  );
}
