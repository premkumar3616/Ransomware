
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Ghost, Lock, Unlock, AlertTriangle, CheckCircle, Power, Eye, Radio, Activity } from 'lucide-react';

const UNLOCK_PHRASE = "job holder";

type ScreenState = 'LOCKED' | 'DECODING' | 'PURGING' | 'OFFLINE';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('LOCKED');
  const [inputText, setInputText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [purgeLogs, setPurgeLogs] = useState<string[]>([]);
  const [showScare, setShowScare] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const breachLogs = [
    "INITIALIZING SYSTEM OVERRIDE...",
    "BYPASSING KERNEL SECURITY...",
    "ROOT ACCESS GRANTED: 0x882A1",
    "ENCRYPTING USER DATA...",
    "SENDING COORDINATES TO MASTER SERVER...",
    "DELETING SYSTEM_32...",
    "ERROR: UNAUTHORIZED ATTEMPT DETECTED",
    "PURGING SYSTEM LOGS...",
    "WATCHING YOU...",
    "I SEE YOU THROUGH THE LENS...",
    "ACCESS DENIED. ACCESS DENIED. ACCESS DENIED.",
    "PREPARING FINAL PAYLOAD...",
    "UPLOADING PRIVATE_GALLERY.ZIP...",
    "HIJACKING MICROPHONE FEED...",
    "THERMAL THROTTLING DETECTED..."
  ];

  const restorationLogs = [
    "AUTHORIZATION GRANTED",
    "STOPPING DATA EXFILTRATION...",
    "DELETING MALICIOUS SUBSYSTEMS...",
    "RESTORING KERNEL INTEGRITY...",
    "CLEANING BOOT SECTOR...",
    "RECOVERING ENCRYPTED FILES...",
    "FLUSHING VRAM...",
    "DISCONNECTING REMOTE UPLINK...",
    "SYSTEM INTEGRITY: 100%",
    "SHUTTING DOWN...",
  ];

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playScareSound = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const playDrone = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
  };

  // Trapping back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
      triggerVibrate([200, 100, 200]);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const triggerVibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    if (screen === 'LOCKED') {
      let i = 0;
      const interval = setInterval(() => {
        setLogs(prev => [...prev, breachLogs[i % breachLogs.length]].slice(-14));
        i++;
        if (Math.random() > 0.95) {
          setShowScare(true);
          playScareSound();
          triggerVibrate([100, 50, 100]);
          setTimeout(() => setShowScare(false), 150);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'PURGING') {
      let i = 0;
      const interval = setInterval(() => {
        if (i < restorationLogs.length) {
          setPurgeLogs(prev => [...prev, restorationLogs[i]]);
          triggerVibrate(20);
          i++;
        } else {
          clearInterval(interval);
          triggerVibrate([500]);
          setTimeout(() => setScreen('OFFLINE'), 1500);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [screen]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, purgeLogs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    initAudio();
    const val = e.target.value.toLowerCase();
    setInputText(val);
    if (val === UNLOCK_PHRASE) {
      triggerVibrate([100, 100, 100]);
      setScreen('DECODING');
      setTimeout(() => setScreen('PURGING'), 1500);
    }
  };

  if (screen === 'OFFLINE') {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center cursor-none">
        <div className="w-1 h-6 bg-white/10 animate-pulse"></div>
      </div>
    );
  }

  if (screen === 'DECODING') {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center p-8 animate-pulse">
        <Unlock size={80} className="text-black mb-4" />
        <h2 className="text-2xl font-black text-black tracking-widest uppercase italic">Decrypted...</h2>
      </div>
    );
  }

  if (screen === 'PURGING') {
    return (
      <div className="h-screen w-screen bg-black p-6 font-mono flex flex-col overflow-hidden">
        <div className="mb-4 flex items-center gap-3 text-green-500 border-b border-green-900 pb-2">
          <CheckCircle size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Purging System Infection</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {purgeLogs.map((log, idx) => (
            <div key={idx} className="text-green-500 text-sm flex gap-2">
              <span className="opacity-30">[{idx.toString().padStart(2, '0')}]</span>
              <span className="animate-in fade-in slide-in-from-left-2 duration-300">
                {log}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
        <div className="mt-4 h-1 w-full bg-green-900/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-linear" 
            style={{ width: `${(purgeLogs.length / restorationLogs.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col font-mono select-none" onClick={initAudio}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_transparent_30%,_rgba(150,0,0,0.4)_100%)]"></div>
      
      {showScare && (
        <div className="absolute inset-0 z-[110] bg-red-950 flex items-center justify-center overflow-hidden">
          <Ghost size={400} className="text-red-500 opacity-90 animate-ping absolute" />
          <div className="text-white text-9xl font-black opacity-10 tracking-widest">HELP</div>
          <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-overlay bg-[url('https://picsum.photos/1000/1500?grayscale')] grayscale scale-150 -rotate-12 blur-sm"></div>
        </div>
      )}

      {/* Top Header */}
      <div className="p-4 bg-red-950/90 flex items-center justify-between border-b border-red-600 z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500 animate-pulse" size={22} />
          <div className="flex flex-col">
            <h1 className="text-sm font-black uppercase tracking-tighter glitch-text leading-none">CRITICAL_OVERRIDE</h1>
            <span className="text-[8px] text-red-500 opacity-70">UID: ALPHA-9-001</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-red-600 animate-pulse" />
          <div className="text-[10px] bg-red-600 text-black px-1 font-bold">LOCKED</div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {/* Hacker Log Display */}
        <div className="flex-1 bg-black/80 border border-red-900/40 p-3 rounded-lg flex flex-col overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2 text-red-600 text-[10px] border-b border-red-900/20 pb-1">
            <span className="flex items-center gap-1 font-bold"><Radio size={10} /> REMOTE_LISTEN: ACTIVE</span>
            <span className="animate-pulse">REC ●</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-[11px] leading-tight">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-red-900 shrink-0 font-bold opacity-40 tracking-tighter">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                <span className={idx === logs.length - 1 ? 'text-red-400 font-bold' : 'text-red-800'}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Threat Level & Key Input */}
        <div className="bg-red-950/30 border border-red-600/40 p-5 rounded-xl text-center relative overflow-hidden">
          {/* Faint static pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10">
            <Eye size={40} className="mx-auto mb-3 text-red-600 opacity-80" />
            <h2 className="text-lg font-black mb-1 glitch-text uppercase tracking-widest text-red-500">I AM WATCHING</h2>
            <p className="text-red-600/80 text-[10px] leading-relaxed mb-5 px-4 font-bold italic">
              "Every move you make, every click you take... I'm already inside."
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-red-500 opacity-60">
                <Lock size={12} />
                <span>TERMINAL ACCESS KEY</span>
              </div>
              
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="BYPASS_CODE"
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-black/60 border-2 border-red-900/50 p-4 text-center text-red-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all uppercase tracking-[0.5em] text-sm font-black rounded-lg placeholder:opacity-20"
                autoFocus
              />
              <div className="text-[8px] text-red-900 font-bold tracking-widest mt-1">
                ERROR: 5 UNSUCCESSFUL ATTEMPTS REMAINING
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-3 bg-red-950/80 flex justify-between items-center text-[9px] uppercase tracking-widest text-red-600 border-t border-red-700/40 font-black">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><AlertTriangle size={10} /> FAN_FAIL</span>
          <span className="flex items-center gap-1 text-red-400">72°C <Activity size={8}/></span>
        </div>
        <div className="animate-pulse bg-red-600 text-black px-1">UPLOADING_SENSITIVE_DATA...</div>
      </div>

      {/* Manual Fullscreen Trigger (Hidden/Discreet) */}
      <button 
        onClick={() => {
            const el = document.documentElement;
            if (el.requestFullscreen) {
              el.requestFullscreen().catch(() => {});
            }
            initAudio();
            playDrone();
            triggerVibrate(50);
        }}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-red-600/5 flex items-center justify-center border border-red-600/10 active:bg-red-600 transition-all z-[120]"
      >
        <Power size={16} className="text-red-600/20" />
      </button>
    </div>
  );
};

export default App;
