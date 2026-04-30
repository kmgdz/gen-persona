import { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Wallet, Twitter, Sparkles, Hexagon, ArrowRight, CheckCircle2, User, ExternalLink, LogOut, Cpu, Fingerprint, Layers, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { connectWallet, switchToGenLayer, createInscription } from './lib/web3';
import { generatePersona } from './lib/persona';
import { saveInscription, getInscriptions, InscriptionRecord } from './lib/storage';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

const ALL_QUESTIONS = [
  {
    question: "You see a meme coin named after a dog wearing a hat drop 90% in 5 minutes. What do you do?",
    options: ["Buy the dip. It's an opportunity.", "Panic sell and tweet about the scam.", "Hold. I already forgot I bought it.", "Short it with 100x leverage."]
  },
  {
    question: "How do you store your seed phrase?",
    options: ["Engraved on titanium buried in my backyard.", "In a password manager.", "On a sticky note under my keyboard.", "I screenshot it and saved it in iCloud."]
  },
  {
    question: "What's your primary motivation in crypto?",
    options: ["The tech and decentralization.", "Generational wealth by next Tuesday.", "Just here for the community vibes.", "Beating the traditional financial system."]
  },
  {
    question: "A new L2 launches with a 'points' program. You:",
    options: ["Bridge $10 and do 500 transactions for airdrop.", "Read the whitepaper first.", "Ignore it; sticking to Ethereum L1.", "Stake my entire life savings on Day 1."]
  },
  {
    question: "When someone says 'GenLayer', you think:",
    options: ["Intelligent Smart Contracts executing LLMs on-chain.", "A new on-chain inscription collection.", "Something about AI and blockchain.", "Where do I buy $GEN?"]
  },
  {
    question: "Your favorite crypto influencer gets arrested. Your reaction?",
    options: ["I knew it all along.", "Free them! They did nothing wrong.", "Time to buy their coin's bottom.", "Who? I only follow builders."]
  },
  {
    question: "What is your main strategy during a bear market?",
    options: ["DCA consistently into blue chips.", "Fade everything and farm airdrops.", "Get a real job and forget about charts.", "Trade shitcoins until I have zero."]
  },
  {
    question: "How many browser wallet extensions do you have installed?",
    options: ["Just one, keep it simple.", "2 to 3, for different chains.", "Like 10, one for every obscure testnet.", "I use a hardware wallet strictly."]
  },
  {
    question: "A VC backs a new protocol with $50M. Do you use it?",
    options: ["No, it's just VC dump fuel.", "Yes, farming the incoming airdrop.", "Only if the tech is actually groundbreaking.", "I just buy whatever token they launch."]
  },
  {
    question: "You find an obscure token with 14% daily APY. What's your move?",
    options: ["Ape in, who cares if it's a ponzi.", "Audit the smart contract myself.", "Check Twitter to see if people are talking about it.", "Avoid it entirely. Too risky."]
  },
  {
    question: "If you could only hold one asset for 10 years, it would be:",
    options: ["Bitcoin.", "Ethereum.", "Some random AI or gaming token.", "Cash."]
  },
  {
    question: "How do you describe your crypto portfolio to your family?",
    options: ["I tell them I own 'tech stocks'.", "I show them my inscription collection.", "I don't mention it. Ever.", "I pitch them my favorite altcoins at Thanksgiving."]
  },
  {
    question: "A rug pull just took 90% of your current trading stack. You:",
    options: ["Quit crypto forever.", "Track their wallets on-chain like a detective.", "Shrug. It's just a regular Tuesday.", "Borrow money to try and win it back."]
  },
  {
    question: "What do you think is the true purpose of Inscriptions and NFTs?",
    options: ["Digital art and collectibles.", "Utility, gaming, and identity.", "Money laundering and speculation.", "Showing off as a profile picture."]
  },
  {
    question: "Someone DMs you on Discord saying you won 1 BTC. You:",
    options: ["Block and report immediately.", "Click the link just to see what the site looks like.", "Troll them by wasting their time.", "Send them my wallet address to claim it."]
  }
];

export default function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [step, setStep] = useState<'landing' | 'quiz' | 'analyzing' | 'result' | 'inscribed' | 'profile'>('landing');
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [testQuestions, setTestQuestions] = useState<typeof ALL_QUESTIONS>([]);
  
  const [persona, setPersona] = useState<any>(null);
  const [isInscribing, setIsInscribing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [myInscriptions, setMyInscriptions] = useState<InscriptionRecord[]>([]);

  useEffect(() => {
    // Check if previously connected
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setMyInscriptions(getInscriptions(accounts[0]));
          }
        }
      } catch (err) {
        console.warn('Wallet check error (e.g. extension conflict):', err);
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      const acc = await connectWallet();
      setAddress(acc);
      setMyInscriptions(getInscriptions(acc));
      await switchToGenLayer();
    } catch (e: any) {
      alert(e.message || "Failed to connect wallet.");
    }
  };

  const handleStartTest = () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setTestQuestions(shuffled.slice(0, 5));
    setAnswers([]);
    setCurrentQuestionIdx(0);
    setStep('quiz');
  };

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestionIdx < testQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setStep('analyzing');
      runAnalysis(newAnswers);
    }
  };

  const runAnalysis = async (userAnswers: string[]) => {
    try {
      const result = await generatePersona(userAnswers);
      setPersona(result);
      // Wait a bit to show the cool analyzing animation
      setTimeout(() => {
        setStep('result');
      }, 2500);
    } catch (e) {
      console.error(e);
      setPersona({
        title: "Glitch Degen",
        description: "The AI node failed to read your soul. You are a glitch in the matrix.",
        traits: ["Error 404", "Unreadable"],
        emoji: "👾"
      });
      setStep('result');
    }
  };

  const handleInscribe = async () => {
    if (!persona || !address) return;
    setIsInscribing(true);
    try {
      await switchToGenLayer(); // Ensure they are on GenTestnet
      const hash = await createInscription(address, persona);
      setTxHash(hash);
      
      const inscriptionRecord: InscriptionRecord = {
        ...persona,
        txHash: hash,
        timestamp: Date.now()
      };
      saveInscription(address, inscriptionRecord);
      setMyInscriptions(getInscriptions(address));
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec3e9b', '#b91062', '#fbcce6']
      });
      
      setStep('inscribed');
    } catch (e: any) {
      alert(e.message || "Inscription failed or was rejected.");
    } finally {
      setIsInscribing(false);
    }
  };

  const handleShare = () => {
    const appInfo = `just took the GenLayer AI Personality Test! 🧬🤖\n\nMy On-Chain Persona: ${persona.title} ${persona.emoji}\n\nInscribe yours free on GenTestnet 👇`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(appInfo)}`;
    window.open(url, '_blank');
  };

  const handleDownload = async () => {
    const el = document.getElementById('nft-card');
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { cacheBust: true, style: { transform: 'scale(1)', margin: '0' }});
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${persona.title.replace(/\s+/g, '-')}-GenLayer.png`;
      a.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-10 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => setStep('landing')}>
          <Hexagon className="text-brand-500 fill-brand-500/20" size={28} />
          <span>Gen<span className="text-brand-400">Persona</span></span>
        </div>
        
        {address ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setStep('profile')}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition border border-brand-500/30 text-brand-300 hover:text-white"
            >
              <User size={18} />
            </button>
            <div className="glass-panel px-4 py-2 rounded-full text-sm font-mono flex items-center gap-2 border border-brand-500/30 hidden sm:flex">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              {shortenAddress(address)}
            </div>
            <button 
              onClick={() => {
                setAddress(null);
                setMyInscriptions([]);
                setStep('landing');
              }}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition border border-brand-500/30 text-rose-400 hover:text-rose-200"
              title="Disconnect Wallet"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            className="glass-panel px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition flex items-center gap-2 border border-white/20"
          >
            <Wallet size={16} />
            Connect Wallet
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative z-10 w-full max-w-6xl mx-auto ${step === 'landing' ? 'p-0' : 'p-6 items-center justify-center'}`}>
        <AnimatePresence mode="wait">
          
          {step === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full pb-32"
            >
              {/* Hero Section */}
              <div className="text-center space-y-8 max-w-3xl mx-auto pt-32 pb-24 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-brand-300 text-sm mb-4 border border-brand-500/30">
                  <Sparkles size={16} /> Powered by GenLayer Intelligent Contracts
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight drop-shadow-2xl">
                  Decentralized Intelligence. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-purple-400 to-indigo-500">
                    On-Chain Identity.
                  </span>
                </h1>
                
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Experience the fusion of LLMs and blockchain. Answer 5 questions and let GenLayer's AI nodes assign you a cryptographically verified personality inscription.
                </p>

                <div className="pt-10 space-y-4">
                  {address ? (
                    <button 
                      onClick={handleStartTest}
                      className="glow-btn bg-white text-black px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 mx-auto shadow-2xl shadow-white/10 hover:scale-105"
                    >
                      Initialize Analysis <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleConnect}
                      className="glow-btn bg-brand-600 border border-brand-500/50 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 mx-auto shadow-2xl shadow-brand-500/30 hover:scale-105"
                    >
                      <Wallet size={20} /> Connect Wallet to Start
                    </button>
                  )}
                  
                  <p className="text-sm text-gray-500 font-mono mt-6">
                    100% Free • <a href="https://testnet-faucet.genlayer.foundation" target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300 hover:underline transition">Get GEN from Faucet</a>
                  </p>
                </div>
              </div>

              {/* How it Works Section */}
              <div className="py-32 px-6 relative border-t border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">A seamless orchestration of AI and Blockchain technology to secure your digital persona.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        icon: <BrainCircuit size={32} className="text-brand-400" />,
                        number: "01",
                        title: "Psychometric Input",
                        desc: "Respond to a chaotic set of scenarios designed to break conventional profiling and reveal your actual chain-behavior."
                      },
                      {
                        icon: <Cpu size={32} className="text-purple-400" />,
                        number: "02",
                        title: "LLM Processing",
                        desc: "GenLayer nodes ingest your data. Instead of standard opcodes, GenLayer executes LLM evaluation natively within consensus."
                      },
                      {
                        icon: <Fingerprint size={32} className="text-indigo-400" />,
                        number: "03",
                        title: "Immutable Inscription",
                        desc: "Your resulting Persona is published as a fully on-chain 100% SVG Inscription directly to the GenLayer Testnet."
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="relative glass-panel p-8 rounded-3xl border border-white/5 hover:border-white/20 transition duration-300 group">
                        <div className="text-7xl font-black text-white/5 absolute top-4 right-6 group-hover:text-white/10 transition">{step.number}</div>
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner relative z-10 group-hover:scale-110 transition-transform">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4 relative z-10">{step.title}</h3>
                        <p className="text-gray-400 leading-relaxed relative z-10 text-sm">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* GenLayer Tech Intro */}
              <div className="py-32 px-6 bg-gradient-to-b from-transparent to-brand-950/20 border-t border-white/5 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[600px] bg-brand-600/5 blur-[150px] rounded-full" />
                
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold uppercase tracking-widest border border-indigo-500/20">
                      <Layers size={14} /> The Paradigm Shift
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black leading-tight">
                      Smart Contracts <br/>
                      <span className="text-brand-400">That Can Think.</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      GenLayer introduces <strong>Intelligent Contracts</strong>. Unlike traditional blockchains that rely entirely on deterministic, isolated code, GenLayer integrates Large Language Models directly into the execution environment.
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Connects AI to the internet securely via consensus.",
                        "Enables subjective decision making on-chain.",
                        "Powers autonomous AI agents without central servers."
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-400">
                          <CheckCircle2 size={24} className="text-green-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="relative z-10 [perspective:1000px]">
                    <div className="glass-panel p-6 rounded-3xl border border-brand-500/20 transform-gpu [transform:rotateY(-10deg)_rotateX(5deg)] hover:[transform:rotateY(0)_rotateX(0)] transition-transform duration-700 shadow-2xl shadow-brand-500/10">
                      <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-loose">
<span className="text-purple-400">async function</span> <span className="text-blue-400">evaluatePersona</span>(userAnswers) {'{'}
  <span className="text-gray-500">// GenLayer Native LLM Call</span>
  <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> llm.complete({'{'}
    prompt: <span className="text-brand-300">`Analyze 5 answers to find crypto personality: ${'{'}userAnswers{'}'}`</span>,
    consensus: <span className="text-amber-300">0.8</span> <span className="text-gray-500">// Requires 80% validator agreement</span>
  {'}'});
  
  <span className="text-purple-400">return</span> response.json();
{'}'}</pre>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to see what the nodes think?</h2>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="glow-btn bg-brand-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto"
                >
                  <Sparkles size={20} /> Back to Top
                </button>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && testQuestions.length > 0 && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8 text-sm text-brand-400 font-mono">
                <span>QUESTION {currentQuestionIdx + 1}/5</span>
                <span>{Math.round(((currentQuestionIdx) / 5) * 100)}%</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
                {testQuestions[currentQuestionIdx].question}
              </h2>
              
              <div className="grid gap-4">
                {testQuestions[currentQuestionIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="text-left w-full p-4 rounded-xl border border-white/10 hover:border-brand-500 hover:bg-brand-500/10 transition-all duration-200 group flex justify-between items-center"
                  >
                    <span className="text-gray-200 group-hover:text-white">{opt}</span>
                    <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-brand-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center flex flex-col items-center justify-center h-[50vh]"
            >
              <div className="relative mb-8">
                <BrainCircuit size={64} className="text-brand-500 relative z-10 animate-pulse" />
                <div className="absolute inset-0 bg-brand-500/40 blur-[30px] rounded-full animate-ping" />
              </div>
              <h2 className="text-3xl font-bold mb-4 font-mono">GenLayer AI Processing...</h2>
              <p className="text-brand-300">Evaluating your on-chain behavior profile</p>
              
              <div className="w-64 h-2 bg-white/10 rounded-full mt-8 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {step === 'result' && persona && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <div className="relative group [perspective:1000px]">
                <motion.div 
                  className="w-full max-w-sm aspect-[4/5] rounded-3xl p-1 relative overflow-hidden bg-gradient-to-br from-brand-500 via-purple-600 to-indigo-900 shadow-2xl shadow-brand-500/20 transform-gpu transition-transform duration-500 group-hover:scale-105 [transform-style:preserve-3d]"
                  animate={{ rotateY: [-5, 5, -5], rotateX: [5, -5, 5] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl mix-blend-overlay" />
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[1.4rem] p-6 flex flex-col justify-between relative z-10 border border-white/10 [transform:translateZ(10px)]">
                    <div className="flex justify-between items-start">
                      <div className="text-brand-400 font-mono text-xs uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                        100% On-Chain SVG
                      </div>
                      <div className="text-gray-500 text-xs font-mono">№ {(Math.random() * 9000 + 1000).toFixed(0)}</div>
                    </div>
                    
                    <div className="text-center py-6 [transform:translateZ(30px)]">
                      <div className="text-8xl mb-6 drop-shadow-2xl">{persona.emoji}</div>
                      <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-400 leading-tight">
                        {persona.title}
                      </h2>
                    </div>
                    
                    <div>
                      <div className="text-gray-400 text-xs font-mono mb-2 uppercase tracking-wide">Verified Traits</div>
                      <div className="flex flex-wrap gap-2">
                        {persona.traits.map((trait: string, idx: number) => (
                          <div key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                            {trait}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="w-full max-w-sm text-center">
                <p className="text-gray-400 text-sm mb-6">
                  {persona.description}
                </p>
                
                <button 
                  onClick={handleInscribe}
                  disabled={isInscribing}
                  className={`glow-btn w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-xl shadow-brand-600/20 ${isInscribing ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isInscribing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Inscribing to GenTestnet...
                    </>
                  ) : (
                    <>
                      <Hexagon className="fill-white/20" size={24} />
                      Submit Inscription
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'inscribed' && persona && (
            <motion.div 
              key="inscribed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl mx-auto text-center"
            >
              <div className="glass-panel p-10 rounded-[2rem] border border-green-500/30 shadow-[0_0_40px_rgba(74,222,128,0.1)]">
                <CheckCircle2 className="text-green-400 mx-auto w-20 h-20 mb-6" />
                
                <h2 className="text-3xl font-bold mb-4">Successfully Inscribed!</h2>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                  Your identity as a <span className="text-white font-bold">{persona.title}</span> is now permanently recorded on the GenLayer Testnet.
                </p>
                
                {txHash && (
                  <div className="bg-black/50 rounded-xl p-4 mb-8 font-mono text-xs text-gray-500 break-all cursor-pointer hover:text-gray-300 transition"
                       onClick={() => window.open(`https://explorer.testnet-chain.genlayer.com/tx/${txHash}`, '_blank')}>
                    Tx: {txHash}
                  </div>
                )}
                
                <div className="mb-8 flex justify-center">
                  <div id="nft-card" className="w-full max-w-xs aspect-[4/5] rounded-3xl p-1 relative bg-gradient-to-br from-brand-500 via-purple-600 to-indigo-900 shadow-2xl">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-[1.4rem] p-6 flex flex-col justify-between relative z-10 border border-white/10">
                      <div className="flex justify-between items-start">
                        <div className="text-brand-400 font-mono text-[10px] uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded-full border border-brand-500/20">
                          GenLayer Inscription
                        </div>
                      </div>
                      <div className="text-center py-4">
                        <div className="text-6xl mb-4 drop-shadow-2xl">{persona.emoji}</div>
                        <h3 className="text-xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-400 leading-tight">
                          {persona.title}
                        </h3>
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {persona.traits.slice(0, 3).map((trait: string, idx: number) => (
                            <div key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300">
                              {trait}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <button 
                      onClick={handleShare}
                      className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Twitter size={20} />
                      Share on X
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Download size={20} />
                      Save Image
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                        setStep('profile');
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center transition"
                  >
                    View Collection
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-4xl font-bold mb-2">Your <span className="text-brand-400">Collection</span></h2>
              <p className="text-gray-400 mb-12">Personas inscribed to your connected wallet address.</p>

              {myInscriptions.length === 0 ? (
                <div className="glass-panel w-full max-w-xl p-12 text-center rounded-3xl border border-white/10 flex flex-col items-center">
                   <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                     <BrainCircuit size={40} className="text-gray-500" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">No Personas Found</h3>
                   <p className="text-gray-400 mb-8 max-w-xs mx-auto">Take the personality test to inscribe your first GenLayer on-chain certificate.</p>
                   <button 
                     onClick={() => {
                       setAnswers([]);
                       setCurrentQuestionIdx(0);
                       setStep('quiz');
                     }} 
                     className="glow-btn bg-brand-600 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2"
                   >
                     Take the Test <ArrowRight size={18} />
                   </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                  {myInscriptions.map((inscription) => (
                    <div key={inscription.txHash} className="relative group [perspective:1000px] w-full max-w-sm mx-auto">
                      <div className="w-full aspect-[4/5] rounded-3xl p-1 relative overflow-hidden bg-gradient-to-br from-brand-500/60 via-purple-600/60 to-indigo-900/60 shadow-xl border border-white/10 transform-gpu transition-all duration-300 hover:scale-105">
                        <div className="w-full h-full bg-[#0a0a0a] rounded-[1.4rem] p-5 flex flex-col justify-between relative z-10 border border-white/5">
                          <div className="flex justify-between items-start">
                            <div className="text-brand-400 font-mono text-[10px] uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded-full border border-brand-500/20">
                              On-Chain Inscription
                            </div>
                            <a 
                              href={`https://explorer.testnet-chain.genlayer.com/tx/${inscription.txHash}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-gray-500 hover:text-white transition"
                              title="View Transaction"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                          
                          <div className="text-center py-4">
                            <div className="text-6xl mb-4 drop-shadow-2xl">{inscription.emoji}</div>
                            <h3 className="text-xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-400 line-clamp-2">
                              {inscription.title}
                            </h3>
                          </div>
                          
                          <div>
                            <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                              {inscription.traits.slice(0, 3).map((trait: string, idx: number) => (
                                <div key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider font-medium text-gray-300 truncate max-w-full">
                                  {trait}
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono mt-3 text-center">
                              {new Date(inscription.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-600 relative z-10 font-mono">
        Built with ❤️ for GenLayer • 100% Free on Testnet
      </footer>
    </div>
  );
}

