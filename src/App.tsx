import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Mail, Linkedin, ExternalLink, Building2, ArrowUpRight, X, Code, Brain, Music, GraduationCap, Globe, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
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
  aiExperience: [
    { area: "LLM Integration", details: "Multi-provider apps using OpenAI, Anthropic, Gemini, NVIDIA NIM" },
    { area: "AI Agents", details: "Designed agent-based systems with orchestration, tool use, MCP" },
    { area: "Fine-Tuning", details: "Hands-on with Unsloth for efficient LLM fine-tuning (Llama, DeepSeek-R1)" }
  ],
  music: {
    title: "Music Production",
    details: "Composed, mixed, and mastered original digital tracks using FL Studio. Released on Spotify.",
    tracks: [
      { name: "Breathless Echo", image: "https://images.unsplash.com/photo-1614680376573-3e4e1ef4142a?q=80&w=400&auto=format&fit=crop" },
      { name: "Mellow & Missing", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop" },
      { name: "Gentle Breeze", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" },
      { name: "Fragile Bonds", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop" }
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

        {/* Tech Stack Box */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('stack')}
          className="md:col-span-1 md:row-span-2 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col gap-4 overflow-hidden shadow-2xl cursor-pointer group hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center text-white/30">
                <span className="text-2xl font-bold leading-none">{`{`}</span>
                <span className="text-2xl font-bold leading-none">{`}`}</span>
              </div>
              <h2 className="text-3xl font-black leading-none tracking-tight group-hover:text-teal-400 transition-colors">TECH<br/>STACK</h2>
            </div>
            <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#050505]/80 to-transparent z-10 pointer-events-none"></div>
            <div className="flex flex-wrap gap-2 content-start h-full overflow-y-auto pb-8" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
              {[...portfolioData.skills.Frontend, ...portfolioData.skills.Backend, ...portfolioData.skills.AI].map(item => (
                <div key={item} className="px-2 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-md">
                  {item}
                </div>
              ))}
            </div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-black leading-none text-white/90">回帰</h3>
                <p className="text-xs font-bold text-amber-400/70 tracking-widest uppercase mt-1">KAIKI</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white/90">Founder & CEO</p>
              <p className="text-xs text-white/50 mt-0.5">AI Technology Pvt. Ltd.</p>
            </div>
          </div>
        </DraggableBox>

        {/* AI Experience Box */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('ai')}
          className="md:col-span-1 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start">
            <Brain className="w-8 h-8 text-cyan-400" />
            <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">AI Experience</h3>
            <p className="text-sm text-white/50 mt-1">LLMs, Agents, Fine-tuning</p>
          </div>
        </DraggableBox>

        {/* Music Box */}
        <DraggableBox
          variants={itemVariants}
          onClick={() => setActiveModal('music')}
          className="md:col-span-1 md:row-span-1 bg-[#050505]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 hover:bg-[#050505]/80 transition-all z-10 hover:z-50 hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start">
            <Music className="w-8 h-8 text-emerald-400" />
            <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">Music Prod.</h3>
            <p className="text-sm text-white/50 mt-1">FL Studio, Spotify</p>
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

      <Modal isOpen={activeModal === 'company'} onClose={() => setActiveModal(null)} title="KAIKI">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{portfolioData.company.full}</h3>
              <p className="text-white/60">{portfolioData.company.status}</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-teal-400" /> Live Product
            </h4>
            <p>{portfolioData.company.product}</p>
            <p className="text-sm text-white/60 mt-2">Scans codebases for leaked API keys, credentials, and vulnerabilities before they hit production.</p>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" /> Next Product (Validated)
            </h4>
            <p>{portfolioData.company.next}</p>
            <p className="text-sm text-white/60 mt-2">Validated with college students drowning in slides. Uses beautiful markdown rendering with a personalization layer that adapts to how each student learns.</p>
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

      <Modal isOpen={activeModal === 'ai'} onClose={() => setActiveModal(null)} title="AI Experience">
        <div className="space-y-4">
          {portfolioData.aiExperience.map(exp => (
            <div key={exp.area} className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h4 className="text-lg font-bold text-white mb-2">{exp.area}</h4>
              <p className="text-white/70">{exp.details}</p>
            </div>
          ))}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <h4 className="text-lg font-bold text-white mb-2">AI-Augmented Development</h4>
            <p className="text-white/70">Heavy use of AI across entire development workflow — design, code, debug, ship.</p>
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
