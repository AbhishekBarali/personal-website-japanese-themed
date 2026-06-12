/**
 * Static atmosphere layer — "sumi & vermilion".
 * Every layer here paints once and never again: no filter blurs on
 * animated elements, no spinning blobs, no per-frame compositing.
 */
export default function InteractiveBackground() {
  return (
    <>
      <style>{`@media (min-width: 768px) and (pointer: fine) { * { cursor: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='4.5' fill='%23f0eade' fill-opacity='0.9'/%3E%3Ccircle cx='6' cy='6' r='2' fill='%23e1532e'/%3E%3C/svg%3E") 6 6, auto !important; } }`}</style>

      <div className="fixed inset-0 z-0 overflow-hidden bg-[#131110] pointer-events-none select-none" aria-hidden="true">
        {/* Soft light from above — static linear wash */}
        <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-[#211c18] to-transparent" />

        {/* Vermilion ember, top right — pre-blurred via radial-gradient (zero filter cost) */}
        <div
          className="absolute -top-[25%] -right-[15%] w-[70vw] max-w-[1000px] aspect-square"
          style={{ background: 'radial-gradient(circle, rgba(225,83,46,0.08) 0%, rgba(225,83,46,0.03) 40%, transparent 70%)' }}
        />

        {/* Gold warmth, bottom left */}
        <div
          className="absolute -bottom-[30%] -left-[20%] w-[75vw] max-w-[1100px] aspect-square"
          style={{ background: 'radial-gradient(circle, rgba(200,162,75,0.06) 0%, rgba(200,162,75,0.02) 45%, transparent 70%)' }}
        />

        {/* Fine sashiko dot lattice — craft texture, static */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: 'radial-gradient(rgba(240,234,222,0.055) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        {/* Giant kanji watermark — 匠 "master artisan", the theme of the whole page */}
        <div className="absolute -right-[4vw] top-1/2 -translate-y-1/2 font-jp font-bold leading-none text-[#f0eade]/[0.025] text-[58vh] hidden md:block">
          匠
        </div>

        {/* Paper grain — static SVG noise, low opacity, no blend mode */}
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gentle vignette — focus, not darkness */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(10,8,7,0.5) 130%)' }}
        />
      </div>
    </>
  );
}
