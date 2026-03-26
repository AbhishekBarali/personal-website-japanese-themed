export default function InteractiveBackground() {
  return (
    <>
      <style>{`@media (min-width: 768px) { * { cursor: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='4' fill='%23ffffff' filter='blur(1px)' /%3E%3Ccircle cx='6' cy='6' r='2' fill='%23fcd34d' /%3E%3C/svg%3E") 6 6, auto !important; } }`}</style>
      
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#110f0e] pointer-events-none">
        {/* Simple static background fallback for mobile */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2a1800_0%,transparent_60%)] md:hidden opacity-20" />

        {/* Old parchment texture via SVG noise */}
        <div
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated Ink Wash / Mountain Abstractions */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[60vh] bg-[#0c0a0c] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[40px] opacity-90 hidden md:block animate-[spin_30s_linear_infinite]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[50vh] bg-[#080708] rounded-[50%_50%_30%_70%/50%_40%_60%_50%] blur-[60px] opacity-90 hidden md:block animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[30vh] bg-[#1a1412] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[50px] opacity-40 hidden md:block animate-[spin_25s_linear_infinite]" />

        {/* Soft Ambient Golden/Amber Gradient */}
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] max-w-[900px] aspect-square bg-[#4a3000] rounded-full hidden md:block mix-blend-screen opacity-20 blur-[150px]" />

        {/* Intense Vignette Overlay for Moody Lighting */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, #000000 130%)', opacity: 0.85 }} />
      </div>
    </>
  );
}
