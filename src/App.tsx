import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { Github, Mail, Linkedin, ExternalLink, Building2, ArrowUpRight, X, Code, GraduationCap, Globe, Wrench, Cloud, RotateCcw } from 'lucide-react';
import InteractiveBackground from './components/InteractiveBackground';
import PortfolioEyes from './components/PortfolioEyes';
import { RobotAvatar } from './components/ui/robot-avatar';

const portfolioData = {
  profile: {
    name: "Abhishek Barali",
    title: "Builder · AI Engineer",
    bio: "20-year-old CS student building KAIKI — an AI-native B2B company. From code security to chat platforms, I ship products that solve real problems.",
    location: "Kathmandu, Nepal"
  },
  company: {
    name: "KAIKI",
    full: "Kaiki AI Technology Pvt. Ltd.",
    status: "Registered company · Self-funded",
    product: "AI-powered code security scanner (Private Beta)",
    next: "AI-personalized study platform",
    accelerators: ["NVIDIA Inception", "Alibaba Cloud AI Catalyst"]
  },
  projects: [
    { name: "Kaiki.dev", desc: "Enterprise-grade B2B Security & AI discovery platform.", link: "https://kaiki.dev", image: "/projects/kaiki.webp", layout: "horizontal" },
    { name: "SpeakoFlow", desc: "Local-first desktop voice assistant — dictation, writing & AI, all on-device.", link: "https://www.speakoflow.com", image: "/projects/speakoflow.webp", layout: "horizontal" },
    { name: "Gamedev Agent Skills", desc: "66 open-source Agent Skills that teach AI coding agents to build games in 10 engines.", link: "https://github.com/gamedev-skills/awesome-gamedev-agent-skills", image: "/projects/gamedev-skills.webp", layout: "horizontal" },
    { name: "Barali Chat", desc: "Full-stack AI chat platform with multi-provider support.", link: "https://barali.tech", image: "/projects/barali-chat.webp", layout: "featured" },
    { name: "KAIKI Shikigami", desc: "AI agent system for business opportunity discovery.", link: "https://github.com/AbhishekBarali/KAIKI-Shikigami", image: "/projects/shikigami.webp", layout: "horizontal" }
  ],
  skills: {
    Frontend: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
    Backend: ['Node.js', 'Python', 'FastAPI'],
    Databases: ['PostgreSQL', 'SQLite', 'Convex', 'Prisma'],
    Cloud: ['AWS', 'Microsoft Azure', 'Docker', 'Vercel'],
    AI: ['LLMs & APIs', 'Local AI', 'AI Agents'],
    Tools: ['Git', 'Streamlit', 'Playwright']
  },
  aiWorkflow: {
    mcpTools: [
      { name: 'Context7', desc: 'Version-accurate docs for any library' },
      { name: 'Firecrawl', desc: 'Web scraping, search & crawl for agents' },
      { name: 'Playwright', desc: 'Browser automation & E2E testing' },
      { name: 'Stitch', desc: 'Data pipeline orchestration' },
      { name: 'GitHub MCP', desc: 'Repo, PR & issue management' },
    ],
    cloudModels: ['OpenAI', 'Anthropic', 'Google DeepMind', 'DeepSeek', 'Qwen', 'MiniMax', 'GLM'],
    contextEngineering: [
      'Agentic primitives with domain-scoped tool boundaries',
      'Persistent memory architecture across agent sessions',
      'Spec-driven development with structured validation gates',
      'MCP server orchestration for standardized tool access',
    ],
    philosophy: 'Prompts are disposable. The architecture that feeds the model the right context at the right time — that\u0027s what compounds.',
  },
  aiExperience: [
    { area: "LLM Integration", details: "Multi-provider apps using OpenAI, Anthropic, Gemini, NVIDIA NIM" },
    { area: "AI Agents", details: "Designed agent-based systems with orchestration, tool use, MCP" },
    { area: "Fine-Tuning", details: "Hands-on with Unsloth for efficient LLM fine-tuning (Llama, DeepSeek-R1)" }
  ],
  hobbies: {
    music: {
      details: "Composed, mixed, and mastered original digital tracks using FL Studio. Released on Spotify.",
      tracks: [
        { name: "Breathless Echo", image: "https://i.scdn.co/image/ab67616d0000b27340cbf7b63a507ca241d02b36", url: "https://open.spotify.com/track/63012IrFr5rKMHV6dJ2bCX?si=b2b9c7785cb34beb" },
        { name: "Gentle Breeze", image: "https://i.scdn.co/image/ab67616d0000b2738a5189a08e4b16bd4c9f394f", url: "https://open.spotify.com/track/0Wa0BRwd4ZStbAtC4h9bri?si=75264628feea4947" },
        { name: "Mellow & Missing", image: "https://i.scdn.co/image/ab67616d0000b273f64db69926aaa3f96ddea62e", url: "https://open.spotify.com/track/0R607x86AVNGilugaAfgaf?si=d4356c1bd24641ba" },
        { name: "Fragile Bonds", image: "https://i.scdn.co/image/ab67616d0000b273d1a046a7da4d41415c57b882", url: "https://open.spotify.com/track/5cy6XCvzSuHfH3kLi7WhRd?si=919b5fe840d54a7c" }
      ]
    },
    reading: {
      details: "Diving into captivating stories and beautiful art through anime, manga, and manhwa.",
    }
  }
};

// Custom easing — smooth deceleration, not default springs
const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

const Modal = ({ isOpen, onClose, title, jp, children, maxWidth = "max-w-2xl" }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0c0a08]/85 z-50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-1.5rem)] ${maxWidth} max-h-[85vh] flex flex-col bg-sumi-900 border border-washi/10 rounded-3xl z-50 shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden`}
        >
          <div className="flex justify-between items-center shrink-0 bg-sumi-900 py-4 px-6 md:px-8 border-b border-washi/8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-washi">{title}</h2>
            </div>
            <button onClick={onClose} aria-label="Close" className="p-2 bg-washi/5 hover:bg-washi/15 rounded-full transition-colors">
              <X className="w-5 h-5 text-washi/80" />
            </button>
          </div>
          <div className="flex-1 min-h-0 text-washi/90 space-y-4 p-6 md:p-8 overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

function DraggableBox({
  children,
  onClick,
  className,
  variants,
  dragRef,
  resetSignal,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
  variants: any;
  dragRef?: React.RefObject<HTMLDivElement | null>;
  resetSignal?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const wasDragged = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.matchMedia("(hover: none)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Glide home — fired by the tidy-up button and on zoom/resize so the
  // grid reflow never strands a card in the wrong place.
  useEffect(() => {
    if (!resetSignal) return;
    animate(x, 0, { duration: 0.55, ease: EASE_OUT_QUART });
    animate(y, 0, { duration: 0.55, ease: EASE_OUT_QUART });
  }, [resetSignal, x, y]);

  // Real dragging: cards stay where you drop them. No rubber-band, no snap-back.
  const dragProps = isMobile ? {} : {
    drag: true,
    dragConstraints: dragRef,
    dragElastic: 0.1,
    dragMomentum: false,
    whileDrag: { scale: 1.04, zIndex: 100, boxShadow: '0 24px 60px rgba(0,0,0,0.55)' },
    onDragStart: () => { wasDragged.current = true; },
    onDragEnd: () => { setTimeout(() => { wasDragged.current = false; }, 60); },
  };

  return (
    <motion.div
      variants={variants}
      style={{ x, y }}
      onClickCapture={(e) => { if (wasDragged.current) { e.preventDefault(); e.stopPropagation(); } }}
      onClick={() => { if (!wasDragged.current) onClick?.(); }}
      className={className}
      {...dragProps}
    >
      {children}
    </motion.div>
  );
}

// Footer one-liners — rotates every few seconds
const QUIPS = [
  "UTC+5:45 — yes, that's a real timezone",
  'powered by momos, not venture capital',
  'the eyes follow your cursor. they judge, too.',
  'this site passed its own security scanner. barely.',
  'drag the cards. rearrange my life.',
];

function FooterQuip() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % QUIPS.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-1 h-1 rounded-full bg-koke-400 shrink-0"></span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
        >
          {QUIPS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_QUART } }
};

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Zoom or resize reflows the grid — glide every card back home so
  // stale drag offsets never leave the layout in a mess.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setResetSignal(s => s + 1), 180);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, []);

  // Tab-away gag — the title misses you
  useEffect(() => {
    const original = document.title;
    const onVis = () => { document.title = document.hidden ? 'おーい — come back' : original; };
    document.addEventListener('visibilitychange', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); document.title = original; };
  }, []);

  // Console easter egg for fellow devs
  useEffect(() => {
    console.log('%c開 KAIKI', 'font-size:36px;color:#e1532e;font-weight:bold;font-family:serif;');
    console.log('%creading the console, are we? respect. → barali@kaiki.dev', 'color:#8a8275;font-size:12px;');
  }, []);

  return (
    <div ref={constraintsRef} className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans text-washi">
      <InteractiveBackground />

      {/* Vertical gutter signature — ものづくり, craftsmanship */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col items-center gap-5 pointer-events-none select-none" aria-hidden="true">
        <span className="writing-vertical font-jp text-xs text-washi/30">ものづくり</span>
        <span className="w-px h-20 bg-gradient-to-b from-washi/25 to-transparent"></span>
      </div>

      {/* Editorial frame — top rule */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT_QUART }}
        className="relative z-10 mb-5 w-full max-w-5xl flex items-end justify-between border-b border-washi/10 pb-3"
      >
        <span className="font-mono text-[11px] tracking-[0.25em] text-washi-dim uppercase">Portfolio</span>
        <span className="font-jp text-xs text-washi-dim tracking-[0.4em] pl-4">職人気質</span>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              ease: EASE_OUT_QUART
            }
          }
        }}
        className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-4 auto-rows-[190px] gap-4 relative z-10 grid-flow-dense"
      >
        
        {/* Profile Box */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          onClick={() => setActiveModal('profile')}
          className="md:col-span-2 md:row-span-1 bg-sumi-900/95 rounded-3xl p-6 border border-washi/10 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-washi/25 hover:bg-sumi-850 transition-colors duration-300 z-10 hover:z-50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-washi/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <PortfolioEyes size={28} className="bg-sumi-950/80 rounded-2xl p-2 border border-washi/10" />
                <div title="online — probably debugging" className="absolute -bottom-1 -right-1 w-4 h-4 bg-koke-400 rounded-full border-2 border-sumi-900"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-washi">{portfolioData.profile.name}</h1>
                <p className="text-sm text-washi-dim font-mono">@AbhishekBarali</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-washi/5 flex items-center justify-center border border-washi/10 group-hover:bg-shu-500 group-hover:border-shu-500 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          
          <div className="relative z-10 mt-2 flex justify-between items-end">
            <div>
              <p className="text-lg md:text-xl font-medium leading-snug text-washi">
                Building what people <span className="font-serif italic text-shu-400 text-xl md:text-2xl whitespace-nowrap">actually use.</span>
              </p>
            </div>
          </div>
        </DraggableBox>

        {/* Tech Stack Box — compact */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          onClick={() => setActiveModal('stack')}
          className="md:col-span-1 md:row-span-1 bg-sumi-900/95 rounded-3xl p-5 border border-washi/10 flex flex-col justify-between overflow-hidden shadow-2xl cursor-pointer group hover:border-washi/25 hover:bg-sumi-850 transition-colors duration-300 z-10 hover:z-50"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-washi-dim group-hover:text-shu-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <h2 className="text-2xl font-black leading-none tracking-tight text-washi">STACK</h2>
            </div>
            <ArrowUpRight className="w-4 h-4 text-washi-dim group-hover:text-washi transition-colors" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3 relative z-10">
            {['React', 'Next.js', 'Python', 'AWS', 'Docker'].map(item => (
              <div key={item} className="px-2 py-0.5 text-xs font-medium bg-washi/5 border border-washi/10 rounded-md text-washi/75">
                {item}
              </div>
            ))}
            <div className="px-2 py-0.5 text-xs font-medium bg-shu-500/10 border border-shu-500/25 rounded-md text-shu-300">+ more</div>
          </div>
        </DraggableBox>

        {/* Links Box */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          className="md:col-span-1 md:row-span-1 flex flex-col gap-2 z-10 hover:z-50"
        >
          <div className="flex items-center justify-center h-1/2 gap-2">
            <div className="flex items-center justify-center w-1/2 h-full font-black text-2xl leading-none tracking-tight text-washi bg-sumi-900/95 rounded-2xl border border-washi/10">
              LIN<br/>KS.
            </div>
            <a href="https://github.com/AbhishekBarali" title="GitHub" target="_blank" rel="noreferrer" draggable={false} className="w-1/2 h-full bg-sumi-900/95 rounded-2xl border border-washi/10 flex items-center justify-center hover:bg-sumi-850 hover:border-shu-500/50 transition-colors cursor-pointer shadow-lg group">
              <Github className="w-7 h-7 text-washi/70 group-hover:text-shu-400 transition-colors" />
            </a>
          </div>
          <div className="flex items-center justify-center h-1/2 gap-2">
            <a href="mailto:barali@kaiki.dev" title="Email" draggable={false} className="w-1/3 h-full bg-sumi-900/95 rounded-2xl border border-washi/10 flex items-center justify-center hover:bg-sumi-850 hover:border-shu-500/50 transition-colors cursor-pointer shadow-lg group">
              <Mail className="w-6 h-6 text-washi/70 group-hover:text-shu-400 transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/abhishek-barali-8a1a2a1a6/" title="LinkedIn" target="_blank" rel="noreferrer" draggable={false} className="w-1/3 h-full bg-sumi-900/95 rounded-2xl border border-washi/10 flex items-center justify-center hover:bg-sumi-850 hover:border-shu-500/50 transition-colors cursor-pointer shadow-lg group">
              <Linkedin className="w-6 h-6 text-washi/70 group-hover:text-shu-400 transition-colors" />
            </a>
            <a href="https://kaiki.dev" title="KAIKI" target="_blank" rel="noreferrer" draggable={false} className="w-1/3 h-full bg-sumi-900/95 rounded-2xl border border-washi/10 flex items-center justify-center hover:bg-sumi-850 hover:border-shu-500/50 transition-colors cursor-pointer shadow-lg group">
              <Globe className="w-6 h-6 text-washi/70 group-hover:text-shu-400 transition-colors" />
            </a>
          </div>
        </DraggableBox>

        {/* Projects Box */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          onClick={() => setActiveModal('projects')}
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-sumi-850 to-sumi-900 rounded-3xl p-6 border border-washi/10 relative overflow-hidden group cursor-pointer flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.45)] hover:border-shu-500/35 transition-colors duration-300 z-10 hover:z-50"
        >
          {/* Ensō — single brush circle, static */}
          <svg viewBox="0 0 200 200" className="absolute -right-12 -bottom-16 w-72 h-72 text-shu-500/15 group-hover:text-shu-500/25 transition-colors duration-700 pointer-events-none" fill="none" aria-hidden="true">
            <path d="M167.7 75.4 A72 72 0 1 0 146.3 155.2" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
          </svg>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <svg viewBox="0 0 48 48" className="w-10 h-10 mb-4 text-shu-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 14 Q 24 8 42 14" />
                <line x1="10" y1="13" x2="10" y2="38" />
                <line x1="38" y1="13" x2="38" y2="38" />
                <line x1="7" y1="22" x2="41" y2="22" />
              </svg>
              <h2 className="text-5xl font-black leading-none tracking-tight text-washi mb-2">PROJECTS</h2>
              <p className="text-sm font-medium text-washi-dim mt-1">Full stack · AI · Open source</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-washi/8 border border-washi/10 flex items-center justify-center group-hover:bg-shu-500 group-hover:border-shu-500 transition-colors">
              <ArrowUpRight className="w-6 h-6 text-washi" />
            </div>
          </div>
          
          <div className="relative z-10 flex justify-between items-end">
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-shu-500/15 border border-shu-500/30 rounded-full eyebrow text-shu-300">5 Shipped</span>
              <span className="px-3 py-1.5 bg-washi/8 border border-washi/10 rounded-full eyebrow text-washi/85">AI Agents</span>
            </div>
          </div>
        </DraggableBox>

        {/* Company Box */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          onClick={() => setActiveModal('company')}
          className="md:col-span-1 md:row-span-1 bg-sumi-900/95 rounded-3xl p-5 border border-washi/10 relative overflow-hidden group cursor-pointer shadow-2xl hover:border-washi/25 hover:bg-sumi-850 transition-colors duration-300 z-10 hover:z-50"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-2xl font-black leading-none text-washi tracking-tight">KAIKI</h3>
                  <p className="eyebrow text-washi-faint mt-1.5">FOUNDER & CEO</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-washi/5 flex items-center justify-center group-hover:bg-shu-500 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-washi" />
              </div>
            </div>
            <div className="mt-4 bg-sumi-950/70 border border-washi/8 rounded-xl p-3">
              <p className="text-xs text-washi/85 font-medium">B2B Security & AI</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-koke-400"></div>
                <p className="eyebrow text-washi-dim">Building Phase</p>
              </div>
            </div>
          </div>
        </DraggableBox>

        {/* AI Workflow Box — hero card */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          onClick={() => setActiveModal('ai')}
          className="md:col-span-2 md:row-span-1 bg-sumi-900/95 rounded-3xl p-6 border border-washi/10 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-washi/25 hover:bg-sumi-850 transition-colors duration-300 z-10 hover:z-50"
        >
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* Static core mark — concentric orbits, one cheap pulse */}
              <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0 text-shu-400 group-hover:text-shu-300 transition-colors" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="4" fill="currentColor" className="animate-pulse" />
              </svg>
              <h3 className="text-2xl font-black tracking-tight text-washi self-center">AI WORKFLOW</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-washi/5 flex items-center justify-center group-hover:bg-shu-500 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-washi" />
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-shu-500/12 border border-shu-500/30 rounded-xl p-2 md:p-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-shu-400"></div>
                <span className="eyebrow text-shu-300">Context Gen</span>
              </div>
              <div className="bg-washi/5 border border-washi/10 rounded-xl p-2 md:p-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-washi/40"></div>
                <span className="eyebrow text-washi/80">Agent Loops</span>
              </div>
              <div className="bg-washi/5 border border-washi/10 rounded-xl p-2 md:p-3 hidden sm:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-washi/40"></div>
                <span className="eyebrow text-washi/80">MCP Flow</span>
              </div>
            </div>
          </div>
        </DraggableBox>

        {/* Hobbies Box */}
        <DraggableBox
          variants={itemVariants}
          dragRef={constraintsRef}
          resetSignal={resetSignal}
          onClick={() => setActiveModal('hobbies')}
          className="md:col-span-1 md:row-span-1 bg-sumi-900/95 rounded-3xl p-5 border border-washi/10 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-washi/25 transition-colors duration-300 z-10 hover:z-50"
        >
          {/* Subtle minimal collage */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] opacity-25 filter grayscale group-hover:grayscale-0 group-hover:opacity-45 transition-all duration-500 pointer-events-none overflow-hidden rounded-3xl">
            {portfolioData.hobbies.music.tracks.slice(0, 4).map((t, i) => (
              <div key={`music-${i}`} className="overflow-hidden bg-sumi-850">
                <img src={t.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-sumi-950/90 via-transparent to-sumi-950/60 pointer-events-none rounded-3xl"></div>

          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-2xl font-black tracking-tight text-washi">HOBBIES</h3>
            <div className="w-8 h-8 rounded-full bg-sumi-950/60 border border-washi/10 flex items-center justify-center group-hover:bg-shu-500 transition-colors shadow-xl text-washi">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10 mt-auto pb-1">
            <p className="text-sm font-medium text-washi/85">Music Prod, Anime, Manga & Manhwa</p>
          </div>
        </DraggableBox>

      </motion.div>

      {/* Editorial frame — footer rule */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: EASE_OUT_QUART }}
        className="relative z-10 mt-5 w-full max-w-5xl hidden md:flex items-center justify-between border-t border-washi/10 pt-3 font-mono text-[11px] text-washi-dim"
      >
        <span className="flex"><FooterQuip /></span>
        <button
          onClick={() => setResetSignal(s => s + 1)}
          title="put every card back where it belongs"
          className="hidden md:inline-flex items-center gap-1.5 hover:text-washi transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          made a mess? tidy up
        </button>
      </motion.div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} title="About Me" jp="自己紹介">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-washi/10 bg-sumi-950 shrink-0 flex items-center justify-center">
            <RobotAvatar size={96} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-washi">{portfolioData.profile.name}</h3>
            <p className="text-shu-400 font-medium mb-4">{portfolioData.profile.title}</p>
            <p className="text-lg leading-relaxed text-washi/90">{portfolioData.profile.bio}</p>
            
            <div className="mt-6 flex items-center gap-2 text-washi-dim">
              <GraduationCap className="w-5 h-5" />
              <span>B.Sc. Computer Science @ St. Xavier's College, Maitighar</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-washi-dim">
              <Globe className="w-5 h-5" />
              <span>{portfolioData.profile.location}</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'stack'} onClose={() => setActiveModal(null)} title="Tech Stack" jp="技術" maxWidth="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Engineering Core (Frontend & Backend) */}
          <div className="md:col-span-2 bg-sumi-950/60 border border-washi/8 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-washi/15 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-5 h-5 text-washi-dim" />
                <h3 className="text-xl font-bold tracking-tight text-washi">Engineering core</h3>
              </div>
              <p className="text-sm text-washi-dim leading-relaxed max-w-md">Full-stack foundation with a focus on performant, scalable, and responsive architectures.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-auto border-t border-washi/8 pt-6">
              <div>
                <h4 className="eyebrow text-washi-faint mb-4">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.Frontend.map(s => <span key={s} className="px-3 py-1.5 bg-washi/5 border border-washi/8 rounded-lg text-xs font-medium text-washi/85">{s}</span>)}
                </div>
              </div>
              <div>
                <h4 className="eyebrow text-washi-faint mb-4">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.Backend.map(s => <span key={s} className="px-3 py-1.5 bg-washi/5 border border-washi/8 rounded-lg text-xs font-medium text-washi/85">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence (AI) */}
          <div className="md:col-span-1 bg-gradient-to-b from-shu-500/10 to-sumi-950/60 border border-shu-500/25 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-shu-500/40 transition-colors relative overflow-hidden">
            <div className="mb-10 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-shu-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="15.5" />
                  <polyline points="22 8.5 12 15.5 2 8.5" />
                  <polyline points="2 15.5 12 8.5 22 15.5" />
                  <line x1="12" y1="2" x2="12" y2="8.5" />
                </svg>
                <h3 className="text-xl font-bold tracking-tight text-washi">Intelligence</h3>
              </div>
              <p className="text-sm text-washi-dim leading-relaxed">Agentic frameworks, local models, and integration.</p>
            </div>
            
            <div className="mt-auto relative z-10 border-t border-shu-500/15 pt-6">
              <h4 className="eyebrow text-shu-400/70 mb-4">AI & ML</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.AI.map(s => <span key={s} className="px-3 py-1.5 bg-shu-500/12 border border-shu-500/20 rounded-lg text-xs font-medium text-shu-300">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="md:col-span-1 bg-sumi-950/60 border border-washi/8 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-washi/15 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-5 h-5 text-washi-dim" />
                <h3 className="text-xl font-bold tracking-tight text-washi">Infrastructure</h3>
              </div>
            </div>
            
            <div className="mt-auto border-t border-washi/8 pt-6">
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.Cloud.map(s => <span key={s} className="px-3 py-1.5 bg-washi/5 border border-washi/8 rounded-lg text-xs font-medium text-washi/85">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Data Architecture */}
          <div className="md:col-span-1 bg-sumi-950/60 border border-washi/8 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-washi/15 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-washi-dim" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                <h3 className="text-xl font-bold tracking-tight text-washi">Data Architecture</h3>
              </div>
            </div>
            
            <div className="mt-auto border-t border-washi/8 pt-6">
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.Databases.map(s => <span key={s} className="px-3 py-1.5 bg-washi/5 border border-washi/8 rounded-lg text-xs font-medium text-washi/85">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Tooling */}
          <div className="md:col-span-1 bg-sumi-950/60 border border-washi/8 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-washi/15 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-5 h-5 text-washi-dim" />
                <h3 className="text-xl font-bold tracking-tight text-washi">Tooling</h3>
              </div>
            </div>
            
            <div className="mt-auto border-t border-washi/8 pt-6">
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.Tools.map(s => <span key={s} className="px-3 py-1.5 bg-washi/5 border border-washi/8 rounded-lg text-xs font-medium text-washi/85">{s}</span>)}
              </div>
            </div>
          </div>
          
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'company'} onClose={() => setActiveModal(null)} title="Company" jp="会社" maxWidth="max-w-2xl">
        <div className="space-y-8">
          <div className="flex items-start justify-between border-b border-washi/10 pb-6 group pt-2">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 shrink-0 rounded-lg bg-shu-500 flex items-center justify-center shadow-[0_2px_16px_rgba(225,83,46,0.35)]">
                <span className="font-jp font-bold text-washi text-xl leading-none">開</span>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-washi tracking-tight">
                  {portfolioData.company.name}
                </h3>
                <p className="eyebrow text-kin-400 mt-1.5">
                  {portfolioData.company.status}
                </p>
              </div></div>
            <a href="https://kaiki.dev" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-washi/5 hover:bg-shu-500 rounded-full text-xs font-bold tracking-wider uppercase text-washi/90 hover:text-washi transition-colors border border-washi/10 hover:border-shu-500 shrink-0 mt-3 md:mt-2">
              Visit Site <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             {/* Mission */}
             <div className="bg-sumi-950/60 p-6 rounded-2xl border border-washi/10 relative overflow-hidden group hover:border-kin-400/30 transition-colors duration-300">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-kin-400/10 border border-kin-400/25 flex items-center justify-center text-kin-400">
                   <Building2 className="w-4 h-4" />
                 </div>
                 <h4 className="text-base font-bold tracking-tight text-washi">Mission</h4>
               </div>
               <p className="text-washi/75 leading-relaxed text-sm">
                 Targeting B2B SaaS with AI-native products that solve deep workflow problems. Developing enterprise-grade tools with unparalleled developer experience.
               </p>
             </div>

             {/* Initiative */}
             <div className="bg-sumi-950/60 p-6 rounded-2xl border border-washi/10 relative overflow-hidden group hover:border-koke-400/35 transition-colors duration-300">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-koke-400/10 border border-koke-400/25 flex items-center justify-center text-koke-400">
                   <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <h4 className="text-base font-bold tracking-tight text-washi">Current Build</h4>
               </div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-koke-400 animate-pulse"></div>
                 <span className="eyebrow text-koke-400">Private Beta</span>
               </div>
               <p className="text-washi/75 leading-relaxed text-sm">
                 AI-powered code security scanner currently establishing early stage B2B validation frameworks.
               </p>
             </div>
          </div>

          <div>
            <h4 className="text-xl font-bold tracking-tight text-washi mb-4">
              Accelerators & Incubators
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portfolioData.company.accelerators.map(prog => (
                <div key={prog} className="flex flex-col justify-center text-washi/90 bg-washi/[0.03] px-4 py-3 rounded-xl border border-washi/10 hover:bg-washi/[0.06] hover:border-shu-500/40 transition-all cursor-default relative overflow-hidden group">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-shu-500/40 group-hover:bg-shu-500 transition-colors"></div>
                   <span className="text-sm font-bold tracking-tight">{prog}</span>
                   <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-washi-faint mt-0.5">Member</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sm:hidden pt-4 border-t border-washi/10">
             <a href="https://kaiki.dev" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-washi/5 border border-washi/10 rounded-xl text-xs font-bold tracking-wider uppercase text-washi">
                Visit Website <ExternalLink className="w-4 h-4" />
             </a>
          </div>
        </div>
      </Modal>

      {/* Project Showcase — Clean Accordion */}
      <Modal isOpen={activeModal === 'projects'} onClose={() => setActiveModal(null)} title="Projects Craft" jp="作品" maxWidth="max-w-4xl">
        <div className="flex flex-col gap-2 pt-6 pb-12 w-full">
          {portfolioData.projects.map((project, i) => {
            const isPortrait = project.layout === 'portrait';
            const isExpanded = expandedProject === project.name;

            return (
              <div 
                key={project.name} 
                className={`overflow-hidden transition-all duration-500 rounded-[2rem] border ${isExpanded ? 'bg-washi/[0.04] border-washi/20 my-4 shadow-2xl' : 'bg-transparent border-transparent hover:bg-washi/[0.04]'}`}
              >
                {/* Header Row (Clickable) */}
                <div 
                  onClick={() => setExpandedProject(isExpanded ? null : project.name)}
                  className="flex items-center justify-between p-6 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-washi/5 text-washi-faint text-xs font-bold font-mono group-hover:text-shu-400 group-hover:bg-shu-500/10 transition-colors">
                      0{i + 1}
                    </div>
                    <h4 className={`font-black tracking-tight transition-all duration-500 ${isExpanded ? 'text-3xl md:text-5xl text-washi' : 'text-2xl md:text-3xl text-washi/85 group-hover:text-washi'}`}>
                      {project.name}
                    </h4>
                  </div>
                  
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-shu-500 border-shu-500 text-washi rotate-45' : 'bg-washi/5 border-washi/10 text-washi/60 group-hover:bg-washi/10 group-hover:text-washi'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
                      className="px-6 pb-6"
                    >
                      <div className={`flex flex-col md:flex-row gap-8 items-stretch mt-4 mb-2`}>
                        {/* Text & Meta */}
                        <div className="flex-1 flex flex-col justify-between order-2 md:order-1">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                               <div className="w-1.5 h-1.5 rounded-full bg-shu-400"></div>
                               <p className="eyebrow text-washi-dim">SHIPPED</p>
                            </div>
                            <p className="text-lg md:text-xl text-washi/85 leading-relaxed font-medium">
                              {project.desc}
                            </p>
                          </div>
                          
                          <div className="mt-8">
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-sumi-950 border border-washi/10 hover:border-shu-500 hover:bg-shu-500 transition-colors text-xs font-bold tracking-wider uppercase text-washi group/btn"
                            >
                              Visit Live 
                              <ArrowUpRight className="w-4 h-4 text-washi/60 group-hover/btn:text-washi transition-colors" strokeWidth={2.5} />
                            </a>
                          </div>
                        </div>

                        {/* Image Preview */}
                        <div className={`w-full ${isPortrait ? 'md:w-1/3' : 'md:w-[55%]'} shrink-0 relative order-1 md:order-2`}>
                          <a 
                             href={project.link} 
                             target="_blank" 
                             rel="noreferrer" 
                             onClick={(e) => e.stopPropagation()}
                             className="block relative rounded-2xl overflow-hidden border border-washi/10 bg-sumi-950 group/img hover:border-washi/30 transition-all shadow-xl"
                          >
                             <div className={`w-full ${isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]'} overflow-hidden relative bg-sumi-950`}>
                               {/* loading="eager": this img only mounts once the row expands, and the
                                   wrapper animates from height:0 — a lazy image is measured as
                                   off-screen at that moment and never gets fetched. */}
                               <img 
                                 src={project.image} 
                                 alt={project.name} 
                                 className={`w-full h-full ${isPortrait ? 'object-cover' : 'object-cover object-top'} scale-100 group-hover/img:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] opacity-90 group-hover/img:opacity-100`} 
                                 loading="eager"
                                 decoding="async"
                               />
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-20 pointer-events-none bg-sumi-950/30">
                               <div className="w-12 h-12 rounded-full bg-shu-500 flex items-center justify-center text-washi shadow-lg">
                                  <ExternalLink className="w-5 h-5" />
                               </div>
                             </div>
                          </a>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'ai'} onClose={() => setActiveModal(null)} title="AI Workflow Core" jp="仕組み" maxWidth="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column (Philosophy & Models) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-shu-500/12 to-sumi-950/60 p-6 rounded-3xl border border-shu-500/25 relative overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-shu-400 mb-4" aria-hidden="true">
                <path d="M10 50 Q 30 10 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M10 50 Q 30 90 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
              <p className="font-serif italic text-washi text-base leading-relaxed">
                “{portfolioData.aiWorkflow.philosophy}”
              </p>
            </div>

            <div className="bg-sumi-950/60 p-6 rounded-3xl border border-washi/10 relative overflow-hidden">
              <h4 className="text-xs tracking-[0.18em] uppercase font-bold text-washi-dim mb-4 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Model Providers
              </h4>
              <div className="flex flex-wrap gap-2 relative z-10">
                {portfolioData.aiWorkflow.cloudModels.map(m => (
                  <div key={m} className="flex items-center gap-2 px-3 py-1.5 bg-washi/5 border border-washi/10 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-koke-400"></div>
                    <span className="text-xs font-medium text-washi/90">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (MCP & Engineering) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-sumi-950/60 p-6 rounded-3xl border border-washi/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs tracking-[0.18em] uppercase font-bold text-washi-dim flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                  Core MCP Servers
                </h4>
                <div className="px-3 py-1 bg-shu-500/15 border border-shu-500/25 rounded-full eyebrow text-shu-300">TOOL AUGMENTATION</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {portfolioData.aiWorkflow.mcpTools.map(t => (
                  <div key={t.name} className="group bg-washi/5 hover:bg-washi/10 transition-colors p-4 md:p-5 rounded-2xl border border-washi/8 border-l-[3px] border-l-transparent hover:border-l-shu-500 flex items-center justify-center">
                    <h5 className="text-base font-bold tracking-tight text-washi text-center">{t.name}</h5>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-sumi-950/60 p-6 rounded-3xl border border-washi/10">
              <h4 className="text-xs tracking-[0.18em] uppercase font-bold text-washi-dim mb-5 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                Agentic Workflow Design
              </h4>
              <div className="space-y-3">
                {portfolioData.aiWorkflow.contextEngineering.map(item => (
                  <div key={item} className="flex items-center gap-3 bg-washi/5 p-3 rounded-xl border border-washi/8">
                    <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-shu-400"></div>
                    <span className="text-sm font-medium text-washi/90 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </Modal>

      {/* Hobbies / Culture Category */}
      <Modal isOpen={activeModal === 'hobbies'} onClose={() => setActiveModal(null)} title="Diversions" jp="趣味" maxWidth="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Music Panel */}
          <div className="space-y-6">
            <div className="border-b border-washi/10 pb-4">
               <h4 className="text-xl font-bold tracking-tight text-washi mb-2">Music Production</h4>
               <p className="text-washi-dim text-sm leading-relaxed">{portfolioData.hobbies.music.details}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {portfolioData.hobbies.music.tracks.map((track, i) => (
                <a 
                  key={track.name} 
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-xl bg-washi/5 aspect-square border border-washi/10 block cursor-pointer hover:border-shu-500/50 hover:shadow-lg transition-all"
                >
                   <img src={track.image} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sumi-950/95 to-transparent p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex justify-between items-center">
                     <p className="text-xs font-bold text-washi truncate">{track.name}</p>
                     <ExternalLink className="w-3 h-3 text-washi/70" />
                   </div>
                </a>
              ))}
            </div>
          </div>

          {/* Reading & Culture Panel */}
          <div className="space-y-6">
            <div className="border-b border-washi/10 pb-4">
               <h4 className="text-xl font-bold tracking-tight text-washi mb-2">Anime & Manga</h4>
               <p className="text-washi-dim text-sm leading-relaxed">{portfolioData.hobbies.reading.details}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-3 h-48 border border-washi/10 rounded-xl bg-washi/[0.02] relative overflow-hidden group">
               <svg viewBox="0 0 24 24" className="w-16 h-16 text-washi/25 group-hover:text-shu-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
               </svg>
               <span className="font-jp text-xs text-washi-faint tracking-[0.4em] group-hover:text-washi-dim transition-colors">物語を読む</span>
            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
}
