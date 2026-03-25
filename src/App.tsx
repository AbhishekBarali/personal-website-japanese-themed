import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Mail, Linkedin, ExternalLink, Building2, ArrowUpRight, X, Code, Brain, Music, GraduationCap, Globe, Rocket, ChevronLeft, ChevronRight, Cpu, Sparkles, Wrench, Cloud } from 'lucide-react';
import InteractiveBackground from './components/InteractiveBackground';
import PortfolioEyes from './components/PortfolioEyes';

const portfolioData = {
  profile: {
    name: "Abhishek Barali",
    title: "Builder · AI Practitioner · Founder",
    bio: "20-year-old CS student and founder who recently went all-in on building — shipping 6 projects, founding a company, and deploying multiple AI-powered products. Now focused on building products that people actually use.",
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
    { name: "Barali Chat", desc: "Full-stack AI chat platform with multi-provider support.", link: "https://barali-chat.vercel.app", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" },
    { name: "KAIKI Shikigami", desc: "AI agent system for business opportunity discovery.", link: "https://github.com/AbhishekBarali/KAIKI-Shikigami", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop" },
    { name: "Manhwa Finder", desc: "AI Recommendation Engine for manhwa.", link: "https://github.com/AbhishekBarali/manhwa-reccomender", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop" },
    { name: "AI Playlist Curator", desc: "Gemini-powered CLI tool to reorganize YouTube Music.", link: "https://github.com/AbhishekBarali/AI_Playlist_Curator", image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop" },
    { name: "Barali Life", desc: "Personal Life OS with dynamic diet engine and gym split.", link: "https://github.com/AbhishekBarali/Barali-Life", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop" }
  ],
  skills: {
    Frontend: ['React 18/19', 'Next.js', 'Vite', 'Tailwind CSS'],
    Backend: ['FastAPI', 'SQLAlchemy', 'Prisma', 'Node.js', 'Python'],
    AI: ['OpenAI', 'Anthropic', 'Gemini', 'NVIDIA NIM', 'Unsloth', 'Agents'],
    Databases: ['PostgreSQL', 'SQLite', 'Convex'],
    Tools: ['Docker', 'Vercel', 'Streamlit', 'FL Studio']
  },
  aiWorkflow: {
    mcpTools: [
      { name: 'Context7', desc: 'Version-accurate docs for any library' },
      { name: 'Firecrawl', desc: 'Web scraping, search & crawl for agents' },
      { name: 'Playwright', desc: 'Browser automation & E2E testing' },
      { name: 'Stitch', desc: 'Data pipeline orchestration' },
      { name: 'GitHub MCP', desc: 'Repo, PR & issue management' },
    ],
    cloudModels: ['OpenAI (GPT-4.5)', 'Anthropic (Claude 4.6)', 'Google (Gemini 3.1)'],
    contextEngineering: [
      'Custom agent skills & copilot instructions',
      'Persistent memory systems across sessions',
      'Spec-based coding with context-rich prompts',
      'MCP server orchestration for tool-augmented agents',
    ],
    philosophy: 'Context engineering over prompt engineering — designing the full information environment around AI, not just the prompt.',
  },
  aiExperience: [
    { area: "LLM Integration", details: "Multi-provider apps using OpenAI, Anthropic, Gemini, NVIDIA NIM" },
    { area: "AI Agents", details: "Designed agent-based systems with orchestration, tool use, MCP" },
    { area: "Fine-Tuning", details: "Hands-on with Unsloth for efficient LLM fine-tuning (Llama, DeepSeek-R1)" }
  ],
  music: {
    title: "Music Production",
    details: "Composed, mixed, and mastered original digital tracks using FL Studio. Released on Spotify.",
    tracks: [
      { name: "Breathless Echo", image: "https://i.scdn.co/image/ab67616d0000b27340cbf7b63a507ca241d02b36" },
      { name: "Gentle Breeze", image: "https://i.scdn.co/image/ab67616d0000b2738a5189a08e4b16bd4c9f394f" },
      { name: "Mellow & Missing", image: "https://i.scdn.co/image/ab67616d0000b273f64db69926aaa3f96ddea62e" },
      { name: "Fragile Bonds", image: "https://i.scdn.co/image/ab67616d0000b273d1a046a7da4d41415c57b882" }
    ]
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
                I build <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">Full Stack & AI</span>
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
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-white/30" />
              <h2 className="text-xl font-black leading-none tracking-tight group-hover:text-teal-400 transition-colors">TECH STACK</h2>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['React', 'Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'].map(item => (
              <div key={item} className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10 rounded-md text-white/60">
                {item}
              </div>
            ))}
            <div className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10 rounded-md text-white/40">+{Object.values(portfolioData.skills).flat().length - 6} more</div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-amber-400/80 group-hover:text-amber-300 transition-colors drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                  <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M20 45 L80 45" stroke="currentColor" strokeWidth="4" opacity="0.6" strokeDasharray="6 4" />
                  <path d="M50 20 L50 80" stroke="currentColor" strokeWidth="4" opacity="0.6" strokeDasharray="6 4" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.9" />
                  <circle cx="50" cy="50" r="2" fill="#000" />
                </svg>
                <div>
                  <h3 className="text-2xl font-black leading-none text-white/90 tracking-tight">KAIKI</h3>
                  <p className="text-[10px] font-bold text-amber-400/70 tracking-widest uppercase mt-1">FOUNDER & CEO</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-4 bg-white/5 border border-white/5 rounded-xl p-3 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/5 rounded-full blur-md"></div>
              <p className="text-xs text-white/70 font-medium z-10 relative">B2B Security & AI</p>
              <div className="flex items-center gap-2 mt-2 z-10 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Self-Funded</p>
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
          onClick={() => setActiveModal('music')}
          className="md:col-span-1 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-5 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-[5]"></div>
          
          {/* Collage Background */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2 opacity-50 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 pointer-events-none mix-blend-screen overflow-hidden rounded-3xl">
            {portfolioData.music.tracks.map((t, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white/5 shadow-2xl">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover blur-[1px] group-hover:blur-0 transition-all duration-500" />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-start relative z-10">
            <div className="bg-black/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-xl">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all">
                <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-xl">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="relative z-10 mt-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pb-1">
            <h3 className="text-2xl font-black tracking-tight text-white/95">Hobbies</h3>
            <p className="text-sm font-semibold text-emerald-400 mt-1">Music Prod. & Spotify</p>
          </div>
        </DraggableBox>

      </motion.div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} title="About Me">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-4xl font-black shadow-lg shrink-0">
            AB
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

      <Modal isOpen={activeModal === 'stack'} onClose={() => setActiveModal(null)} title="Tech Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(portfolioData.skills).map(([category, skills]) => (
            <div key={category} className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <h4 className="text-lg font-bold text-white mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-white/10 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'company'} onClose={() => setActiveModal(null)} title="KAIKI" maxWidth="max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-full"></div>
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-amber-400 relative z-10" fill="none" stroke="currentColor" strokeWidth="5">
                  <path d="M20 20 L80 20 L80 80 L20 80 Z" opacity="0.4" />
                  <path d="M35 35 L65 35 L65 65 L35 65 Z" strokeWidth="6" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  {portfolioData.company.full}
                  <a href="https://kaiki.dev" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs font-bold font-mono tracking-tight text-white/90">
                    KAIKI.DEV <ArrowUpRight className="w-3 h-3" />
                  </a>
                </h3>
                <p className="text-white/60 font-medium mt-1">{portfolioData.company.status}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg mt-4 text-white/90 leading-relaxed text-lg">
            <h4 className="font-bold text-xl text-white mb-3">Honest Plan</h4>
            <p>
              I am going to aim for B2B and use AI agents heavily to solve deep workflow problems. At the moment, I don't have a rigid, step-by-step master plan for it — I am experimenting, moving fast, and building practical systems that businesses actually want to pay for.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Current Build</h4>
                <p className="text-white/70 mt-1">Foundational AI-driven security scanners and testing B2B approaches.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Startup Programs</h4>
            <ul className="space-y-2">
              {portfolioData.company.programs.map(prog => (
                <li key={prog} className="flex items-center gap-2 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {prog}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      {/* Project Showcase — with arrow navigation */}
      <Modal isOpen={activeModal === 'projects'} onClose={() => setActiveModal(null)} title="Project Showcase" maxWidth="max-w-5xl">
        <div className="relative">
          <ScrollArrows scrollRef={projectsScrollRef} />
          <div
            ref={projectsScrollRef}
            className="flex overflow-x-auto gap-6 pb-4 pt-4 snap-x snap-mandatory hide-scrollbar"
          >
            {portfolioData.projects.map((project, i) => (
              <motion.a 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: EASE_OUT_QUART }}
                key={project.name} 
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="min-w-[220px] sm:min-w-[260px] snap-center shrink-0 bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group overflow-hidden flex flex-col"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{project.name}</h4>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{project.desc}</p>
              </motion.a>
            ))}
          </div>
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

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg relative h-[210px] overflow-hidden">
              <div className="absolute right-0 bottom-0 -mr-6 -mb-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <h4 className="text-sm tracking-widest uppercase font-bold text-white/50 mb-4 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Intelligence Layer
              </h4>
              <div className="flex flex-col gap-2 relative z-10">
                {portfolioData.aiWorkflow.cloudModels.map(m => (
                  <div key={m} className="flex items-center gap-3 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-sm font-semibold text-white/90">{m}</span>
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
                Context Engineering
              </h4>
              <div className="space-y-3">
                {portfolioData.aiWorkflow.contextEngineering.map(item => (
                  <div key={item} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-5 h-5 mt-0.5 shrink-0 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-3 h-3" stroke="currentColor" strokeWidth="3" fill="none"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </Modal>

      {/* Music Production — with arrow navigation */}
      <Modal isOpen={activeModal === 'music'} onClose={() => setActiveModal(null)} title="Music Production" maxWidth="max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] shrink-0 animate-[spin_10s_linear_infinite]">
            <Music className="w-12 h-12 text-white animate-[spin_10s_linear_infinite_reverse]" />
          </div>
          <div>
            <p className="text-xl text-white/80 leading-relaxed">{portfolioData.music.details}</p>
          </div>
        </div>
        
        <h4 className="font-bold text-2xl text-white mb-6">Original Tracks</h4>
        <div className="relative">
          <ScrollArrows scrollRef={musicScrollRef} />
          <div
            ref={musicScrollRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar"
          >
            {portfolioData.music.tracks.map((track, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: EASE_OUT_QUART }}
                key={track.name} 
                className="min-w-[200px] sm:min-w-[250px] snap-center shrink-0 bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group cursor-pointer"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative">
                  <img src={track.image} alt={track.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <h5 className="font-bold text-lg text-center group-hover:text-emerald-400 transition-colors">{track.name}</h5>
              </motion.div>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
}
