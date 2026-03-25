import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Mail, Linkedin, ExternalLink, Building2, ArrowUpRight, X, Code, Brain, Music, GraduationCap, Globe, Rocket, ChevronLeft, ChevronRight, Cpu, Sparkles, Wrench, Cloud } from 'lucide-react';
import InteractiveBackground from './components/InteractiveBackground';
import PortfolioEyes from './components/PortfolioEyes';
import { RobotAvatar } from './components/ui/robot-avatar';

const portfolioData = {
  profile: {
    name: "Abhishek Barali",
    title: "Builder · AI Engineer",
    bio: "20-year-old CS student who shipped 6 projects and founded a company. Building AI-powered products — from chat platforms to code security scanners.",
    location: "Kathmandu, Nepal"
  },
  company: {
    name: "KAIKI",
    full: "Kaiki AI Technology Pvt. Ltd.",
    status: "Registered company · Self-funded",
    product: "AI-powered code security scanner (Private Beta)",
    next: "AI-personalized study platform",
    programs: ["Microsoft Azure Startup Credits", "Alibaba Cloud AI Catalyst", "NVIDIA Inception"]
  },
  projects: [
    { name: "Kaiki.dev", desc: "Enterprise-grade B2B Security & AI discovery platform.", link: "https://kaiki.dev", image: "/projects/kaiki.png", layout: "horizontal" },
    { name: "Barali Chat", desc: "Full-stack AI chat platform with multi-provider support.", link: "https://barali.tech", image: "/projects/barali-chat.png", layout: "featured" },
    { name: "Barali Life", desc: "Personal Life OS with dynamic diet engine and gym split.", link: "https://github.com/AbhishekBarali/Barali-Life", image: "/projects/barali-life.png", layout: "portrait" },
    { name: "KAIKI Shikigami", desc: "AI agent system for business opportunity discovery.", link: "https://github.com/AbhishekBarali/KAIKI-Shikigami", image: "/projects/shikigami.png", layout: "horizontal" },
    { name: "Manhwa Recommender", desc: "AI Recommendation Engine for manhwa.", link: "https://github.com/AbhishekBarali/manhwa-reccomender", image: "/projects/manhwa.png", layout: "wide" }
  ],
  skills: {
    Frontend: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
    Backend: ['Node.js', 'Python', 'FastAPI'],
    Databases: ['PostgreSQL', 'SQLite', 'Convex', 'Prisma'],
    Cloud: ['AWS', 'Microsoft Azure', 'Docker', 'Vercel'],
    AI: ['LLMs & APIs', 'Local AI', 'AI Agents'],
    Tools: ['Git', 'Streamlit', 'Playwright', 'FL Studio']
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

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${maxWidth} max-h-[85vh] overflow-y-auto bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)] hide-scrollbar`}
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-md py-4 -mt-4 -mx-4 px-4 rounded-t-3xl border-b border-white/5">
            <h2 className="text-3xl font-black">{title}</h2>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-white/90 space-y-4">
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// Scroll arrow buttons for carousels
function ScrollArrows({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [scrollRef, updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Left arrow */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: canScrollLeft ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { e.stopPropagation(); scroll('left'); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
        style={{ pointerEvents: canScrollLeft ? 'auto' : 'none' }}
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </motion.button>
      {/* Right arrow */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: canScrollRight ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { e.stopPropagation(); scroll('right'); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors"
        style={{ pointerEvents: canScrollRight ? 'auto' : 'none' }}
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </motion.button>
    </>
  );
}

function DraggableBox({
  children,
  onClick,
  className,
  variants,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
  variants: any;
}) {
  return (
    <motion.div
      variants={variants}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.8}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ scale: 1.05, zIndex: 100, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_QUART } }
};

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const musicScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={constraintsRef} className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden font-sans text-white">
      <InteractiveBackground />
      
      {/* Background Main Grid Highlight Filter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-emerald-500/5 to-amber-500/10 blur-[100px] pointer-events-none rounded-full z-0 mix-blend-screen"></div>

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
          onClick={() => setActiveModal('profile')}
          className="md:col-span-2 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <PortfolioEyes size={28} className="bg-[#0a0a0a]/60 rounded-2xl p-2 border border-white/10" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{portfolioData.profile.name}</h1>
                <p className="text-sm text-white/50 font-mono">@AbhishekBarali</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          
          <div className="relative z-10 mt-2 flex justify-between items-end">
            <div>
              <p className="text-xl font-medium flex items-center gap-2">
                Building what people <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">actually use.</span>
              </p>
              <p className="text-sm text-white/60 mt-2 max-w-md leading-relaxed truncate">
                {portfolioData.profile.bio}
              </p>
            </div>
          </div>
        </DraggableBox>

        {/* Tech Stack Box — compact */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('stack')}
          className="md:col-span-1 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/5 flex flex-col justify-between overflow-hidden shadow-2xl cursor-pointer group hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/40 group-hover:text-teal-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <h2 className="text-xl font-black leading-none tracking-tight group-hover:text-teal-400 transition-colors">STACK</h2>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3 relative z-10">
            {['React', 'Next.js', 'Python', 'AWS', 'Docker'].map(item => (
              <div key={item} className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10 rounded-md text-white/60">
                {item}
              </div>
            ))}
            <div className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10 rounded-md text-teal-400/60">+ more</div>
          </div>
        </DraggableBox>

        {/* Links Box */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-1 md:row-span-1 flex flex-col gap-2 z-10 hover:z-50"
        >
          <div className="flex items-center justify-center h-1/2 gap-2">
            <div className="flex items-center justify-center w-1/2 h-full font-black text-2xl leading-none tracking-tighter bg-[#050505]/60 backdrop-blur-xl rounded-2xl border border-white/5">
              LIN<br/>KS.
            </div>
            <a href="https://github.com/AbhishekBarali" title="GitHub" target="_blank" rel="noreferrer" className="w-1/2 h-full bg-[#050505]/60 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all cursor-pointer shadow-lg group">
              <Github className="w-7 h-7 text-white/70 group-hover:text-white transition-colors" />
            </a>
          </div>
          <div className="flex items-center justify-center h-1/2 gap-2">
            <a href="mailto:barali@kaiki.dev" title="Email" className="w-1/3 h-full bg-[#050505]/60 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all cursor-pointer shadow-lg group">
              <Mail className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/abhishek-barali-8a1a2a1a6/" title="LinkedIn" target="_blank" rel="noreferrer" className="w-1/3 h-full bg-[#050505]/60 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all cursor-pointer shadow-lg group">
              <Linkedin className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
            </a>
            <a href="https://kaiki.dev" title="KAIKI" target="_blank" rel="noreferrer" className="w-1/3 h-full bg-[#050505]/60 backdrop-blur-xl rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all cursor-pointer shadow-lg group">
              <Globe className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
            </a>
          </div>
        </motion.div>

        {/* Projects Box */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('projects')}
          className="md:col-span-2 md:row-span-2 bg-[#0a0e14]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 relative overflow-hidden group cursor-pointer flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(195,165,100,0.12)] hover:border-white/20 hover:bg-[#0a0e14]/90 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <Rocket className="w-10 h-10 text-amber-400/80 mb-4 stroke-[1.5]" />
              <h2 className="text-5xl font-black leading-none tracking-tight text-white mb-2">PROJECTS</h2>
              <p className="text-sm font-medium text-white/50 mt-1">Full stack · AI · Open source</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="relative z-10 flex justify-between items-end">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-bold text-white backdrop-blur-md border border-white/5">6 Shipped</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-bold text-white backdrop-blur-md border border-white/5">AI Agents</span>
            </div>
            <p className="text-4xl font-black opacity-30 text-white">工<br/>芸</p>
          </div>
        </DraggableBox>

        {/* Company Box */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('company')}
          className="md:col-span-1 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/5 relative overflow-hidden group cursor-pointer shadow-2xl hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none group-hover:bg-white/10 transition-all duration-700"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-2xl font-black leading-none text-white/90 tracking-tight">KAIKI</h3>
                  <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mt-1">FOUNDER & CEO</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-4 bg-[#0a0a0a]/80 border border-white/5 rounded-xl p-3 relative overflow-hidden">
              <p className="text-xs text-white/70 font-medium z-10 relative">B2B Security & AI</p>
              <div className="flex items-center gap-2 mt-2 z-10 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 hidden"></div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Building Phase</p>
              </div>
            </div>
          </div>
        </DraggableBox>

        {/* AI Workflow Box — hero card */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('ai')}
          className="md:col-span-2 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-400 group-hover:text-indigo-300 transition-colors drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                  <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="3" className="animate-[spin_20s_linear_infinite]" />
                  <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" className="animate-[spin_15s_linear_infinite_reverse]" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
                  <line x1="50" y1="10" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
                  <line x1="15" y1="30" x2="25" y2="35" stroke="currentColor" strokeWidth="2" />
                  <line x1="85" y1="30" x2="75" y2="35" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-black tracking-tight self-center mt-1">AI WORKFLOW</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-2 md:p-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-indigo-200 uppercase tracking-wider">Context Gen</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 md:p-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">Agent Loops</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 md:p-3 hidden sm:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">MCP Flow</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-white/40 italic truncate mt-1">"{portfolioData.aiWorkflow.philosophy}"</p>
          </div>
        </DraggableBox>

        {/* Hobbies Box */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('hobbies')}
          className="md:col-span-1 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          {/* Subtle minimal collage */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] opacity-20 filter grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-500 pointer-events-none mix-blend-screen overflow-hidden rounded-3xl">
            {portfolioData.hobbies.music.tracks.slice(0, 4).map((t, i) => (
              <div key={`music-${i}`} className="overflow-hidden bg-[#111]">
                <img src={t.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-2xl font-black tracking-tight text-white/95">HOBBIES</h3>
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-xl text-white">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10 mt-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pb-1">
            <p className="text-sm font-semibold text-white/60">Music Prod, Anime, Manga & Manhwa</p>
          </div>
        </DraggableBox>

      </motion.div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} title="About Me">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shrink-0 flex items-center justify-center">
            <RobotAvatar size={88} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{portfolioData.profile.name}</h3>
            <p className="text-teal-400 font-medium mb-4">{portfolioData.profile.title}</p>
            <p className="text-lg leading-relaxed">{portfolioData.profile.bio}</p>
            
            <div className="mt-6 flex items-center gap-2 text-white/60">
              <GraduationCap className="w-5 h-5" />
              <span>B.Sc. Computer Science @ St. Xavier's College, Maitighar</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-white/60">
              <Globe className="w-5 h-5" />
              <span>{portfolioData.profile.location}</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'stack'} onClose={() => setActiveModal(null)} title="Tech Stack" maxWidth="max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Engineering Core (Frontend & Backend) */}
          <div className="md:col-span-2 bg-[#0a0a0a]/50 border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-5 h-5 text-white/40" />
                <h3 className="text-xl font-bold tracking-tight text-white/90">Engineering core</h3>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-md">Full-stack foundation with a focus on performant, scalable, and responsive architectures.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-auto border-t border-white/5 pt-6">
              <div>
                <h4 className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-4">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.Frontend.map(s => <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-white/70">{s}</span>)}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-4">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.Backend.map(s => <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-white/70">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence (AI) */}
          <div className="md:col-span-1 bg-gradient-to-b from-indigo-500/10 to-[#0a0a0a]/50 border border-indigo-500/20 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-indigo-500/30 transition-colors relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
            <div className="mb-10 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-400 relative z-10 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    <line x1="12" y1="22" x2="12" y2="15.5" />
                    <polyline points="22 8.5 12 15.5 2 8.5" />
                    <polyline points="2 15.5 12 8.5 22 15.5" />
                    <line x1="12" y1="2" x2="12" y2="8.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-indigo-100">Intelligence</h3>
              </div>
              <p className="text-sm text-indigo-200/50 leading-relaxed">Agentic frameworks, local models, and integration.</p>
            </div>
            
            <div className="mt-auto relative z-10 border-t border-indigo-500/10 pt-6">
              <h4 className="text-[10px] font-black tracking-widest text-indigo-400/50 uppercase mb-4">AI & ML</h4>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.AI.map(s => <span key={s} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/10 rounded-lg text-xs font-medium text-indigo-200">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="md:col-span-1 bg-[#0a0a0a]/50 border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-5 h-5 text-white/40" />
                <h3 className="text-xl font-bold tracking-tight text-white/90">Infrastructure</h3>
              </div>
            </div>
            
            <div className="mt-auto border-t border-white/5 pt-6">
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.Cloud.map(s => <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-white/70">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Data Architecture */}
          <div className="md:col-span-1 bg-[#0a0a0a]/50 border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                <h3 className="text-xl font-bold tracking-tight text-white/90">Data Architecture</h3>
              </div>
            </div>
            
            <div className="mt-auto border-t border-white/5 pt-6">
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.Databases.map(s => <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-white/70">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Tooling */}
          <div className="md:col-span-1 bg-[#0a0a0a]/50 border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-5 h-5 text-white/40" />
                <h3 className="text-xl font-bold tracking-tight text-white/90">Tooling</h3>
              </div>
            </div>
            
            <div className="mt-auto border-t border-white/5 pt-6">
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.Tools.map(s => <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-white/70">{s}</span>)}
              </div>
            </div>
          </div>
          
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'company'} onClose={() => setActiveModal(null)} title="Company" maxWidth="max-w-2xl">
        <div className="space-y-8">
          <div className="flex items-start justify-between border-b border-white/10 pb-6 group pt-2">
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  {portfolioData.company.name}
                </h3>
                 <p className="text-amber-400/80 font-bold text-[10px] sm:text-xs tracking-widest mt-1 uppercase">
                   {portfolioData.company.status}
                 </p>
              </div>
            </div>
            <a href="https://kaiki.dev" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold tracking-tight text-white/80 hover:text-white transition-all border border-white/10 hover:border-white/20 hover:scale-105 shrink-0 mt-3 md:mt-2">
              VISIT SITE <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             {/* Mission */}
             <div className="bg-gradient-to-br from-indigo-500/5 to-transparent p-6 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="flex items-center gap-3 mb-3 relative z-10">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                   <Building2 className="w-4 h-4" />
                 </div>
                 <h4 className="font-bold text-white text-base">Mission</h4>
               </div>
               <p className="text-white/60 leading-relaxed text-sm relative z-10">
                 Targeting B2B SaaS with AI-native products that solve deep workflow problems. Developing enterprise-grade tools with unparalleled developer experience.
               </p>
             </div>

             {/* Initiative */}
             <div className="bg-gradient-to-br from-emerald-500/5 to-transparent p-6 rounded-2xl border border-emerald-500/20 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-300">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="flex items-center gap-3 mb-3 relative z-10">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                   <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <h4 className="font-bold text-white text-base">Current Build</h4>
               </div>
               <div className="flex items-center gap-2 mb-2 relative z-10">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                 <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Private Beta</span>
               </div>
               <p className="text-white/60 leading-relaxed text-sm relative z-10">
                 AI-powered code security scanner currently establishing early stage B2B validation frameworks.
               </p>
             </div>
          </div>

          <div>
            <h4 className="font-black text-white mb-4 text-base flex items-center gap-2">
              Backed By
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {portfolioData.company.programs.map(prog => (
                <div key={prog} className="flex flex-col justify-center text-white/80 bg-white/[0.03] px-4 py-3 rounded-xl border border-white/10 shadow-sm hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-default relative overflow-hidden group">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/10 to-transparent group-hover:from-white/30 transition-colors"></div>
                   <span className="text-sm font-bold tracking-tight">{prog}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sm:hidden pt-4 border-t border-white/5">
             <a href="https://kaiki.dev" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 rounded-xl text-sm font-bold text-white">
                Visit Website <ExternalLink className="w-4 h-4" />
             </a>
          </div>
        </div>
      </Modal>

      {/* Project Showcase — Clean Accordion */}
      <Modal isOpen={activeModal === 'projects'} onClose={() => setActiveModal(null)} title="Projects Craft" maxWidth="max-w-4xl">
        <div className="flex flex-col gap-2 pt-6 pb-12 w-full">
          {portfolioData.projects.map((project, i) => {
            const isPortrait = project.layout === 'portrait';
            const isExpanded = expandedProject === project.name;

            return (
              <div 
                key={project.name} 
                className={`overflow-hidden transition-all duration-500 rounded-[2rem] border ${isExpanded ? 'bg-white/5 border-white/20 my-4 shadow-2xl' : 'bg-transparent border-transparent hover:bg-white/5'}`}
              >
                {/* Header Row (Clickable) */}
                <div 
                  onClick={() => setExpandedProject(isExpanded ? null : project.name)}
                  className="flex items-center justify-between p-6 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-white/30 text-xs font-bold font-mono group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                      0{i + 1}
                    </div>
                    <h4 className={`font-black tracking-tight transition-all duration-500 ${isExpanded ? 'text-3xl md:text-5xl text-white' : 'text-2xl md:text-3xl text-white/80 group-hover:text-white'}`}>
                      {project.name}
                    </h4>
                  </div>
                  
                  <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-white text-black rotate-45' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'}`}>
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
                               <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>
                               <p className="text-[10px] sm:text-xs font-bold text-white/50 tracking-[0.2em] uppercase">SHIPPED</p>
                            </div>
                            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium">
                              {project.desc}
                            </p>
                          </div>
                          
                          <div className="mt-8">
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0a0a0a] border border-white/10 hover:border-white/30 hover:bg-white hover:text-black transition-all text-sm font-bold tracking-tight text-white group/btn"
                            >
                              Visit Live 
                              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover/btn:text-black transition-colors" strokeWidth={2.5} />
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
                             className="block relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] group/img hover:border-white/30 transition-all shadow-xl"
                          >
                             <div className={`w-full ${isPortrait ? 'aspect-[9/16]' : 'aspect-[16/9]'} overflow-hidden relative bg-black`}>
                               <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors z-10 pointer-events-none"></div>
                               <img 
                                 src={project.image} 
                                 alt={project.name} 
                                 className={`w-full h-full ${isPortrait ? 'object-cover' : 'object-cover object-top'} scale-100 group-hover/img:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] opacity-80 group-hover/img:opacity-100`} 
                               />
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-20 pointer-events-none bg-black/20">
                               <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
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

      <Modal isOpen={activeModal === 'ai'} onClose={() => setActiveModal(null)} title="AI Workflow Core" maxWidth="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column (Philosophy & Models) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-900/5 p-6 rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] mix-blend-overlay opacity-30"></div>
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-indigo-400 mb-4 opacity-80">
                <path d="M10 50 Q 30 10 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M10 50 Q 30 90 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
              <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-md">
                "{portfolioData.aiWorkflow.philosophy}"
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 -mr-6 -mb-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <h4 className="text-sm tracking-widest uppercase font-bold text-white/50 mb-4 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Model Providers
              </h4>
              <div className="flex flex-wrap gap-2 relative z-10">
                {portfolioData.aiWorkflow.cloudModels.map(m => (
                  <div key={m} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-xs font-semibold text-white/90">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (MCP & Engineering) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-black/40 p-6 rounded-3xl border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs tracking-widest uppercase font-bold text-white/50 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                  Core MCP Servers
                </h4>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white">TOOL AUGMENTATION</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {portfolioData.aiWorkflow.mcpTools.map(t => (
                  <div key={t.name} className="group bg-white/5 hover:bg-white/10 transition-colors p-4 md:p-5 rounded-2xl border border-white/5 border-l-[3px] border-l-transparent hover:border-l-indigo-500 flex items-center justify-center">
                    <h5 className="font-extrabold text-white text-lg tracking-tight text-center">{t.name}</h5>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg">
              <h4 className="text-xs tracking-widest uppercase font-bold text-white/50 mb-5 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                Agentic Workflow Design
              </h4>
              <div className="space-y-3">
                {portfolioData.aiWorkflow.contextEngineering.map(item => (
                  <div key={item} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]"></div>
                    <span className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </Modal>

      {/* Hobbies / Culture Category */}
      <Modal isOpen={activeModal === 'hobbies'} onClose={() => setActiveModal(null)} title="Diversions" maxWidth="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Music Panel */}
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
               <h4 className="text-xl font-bold tracking-tight text-white mb-2 uppercase">Music Production</h4>
               <p className="text-white/60 text-sm leading-relaxed">{portfolioData.hobbies.music.details}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {portfolioData.hobbies.music.tracks.map((track, i) => (
                <a 
                  key={track.name} 
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-xl bg-white/5 aspect-square border border-white/5 block cursor-pointer hover:border-white/20 hover:shadow-lg transition-all"
                >
                   <img src={track.image} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex justify-between items-center">
                     <p className="text-xs font-bold text-white truncate">{track.name}</p>
                     <ExternalLink className="w-3 h-3 text-white/50" />
                   </div>
                </a>
              ))}
            </div>
          </div>

          {/* Reading & Culture Panel */}
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
               <h4 className="text-xl font-bold tracking-tight text-white mb-2 uppercase">Anime & Manga</h4>
               <p className="text-white/60 text-sm leading-relaxed">{portfolioData.hobbies.reading.details}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center h-48 border border-white/5 rounded-xl bg-white/[0.02] relative overflow-hidden group">
               <svg viewBox="0 0 24 24" className="w-16 h-16 text-white/20 group-hover:text-white/80 transition-colors drop-shadow-xl" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
               </svg>
            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
}
