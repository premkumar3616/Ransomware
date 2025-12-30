
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Ghost, Lock, Unlock, AlertTriangle, CheckCircle, Power } from 'lucide-react';

const UNLOCK_PHRASE = "job holder";

type ScreenState = 'LOCKED' | 'DECODING' | 'PURGING' | 'OFFLINE';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('LOCKED');
  const [inputText, setInputText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [purgeLogs, setPurgeLogs] = useState<string[]>([]);
  const [showScare, setShowScare] = useState(false);
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

  const triggerVibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    if (screen === 'LOCKED') {
      let i = 0;
      const interval = setInterval(() => {
        setLogs(prev => [...prev, breachLogs[i % breachLogs.length]].slice(-12));
        i++;
        if (Math.random() > 0.96) {
          setShowScare(true);
          triggerVibrate([100, 50, 100]);
          setTimeout(() => setShowScare(false), 200);
        }
      }, 700);
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
      }, 350);
      return () => clearInterval(interval);
    }
  }, [screen]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, purgeLogs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col font-mono select-none">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_transparent_30%,_rgba(150,0,0,0.3)_100%)]"></div>
      
      {showScare && (
        <div className="absolute inset-0 z-50 bg-red-950 flex items-center justify-center overflow-hidden">
          <Ghost size={350} className="text-red-500 opacity-80 animate-ping absolute" />
          <div className="text-white text-9xl font-black opacity-20">VOID</div>
          <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-overlay bg-[url('https://picsum.photos/800/1200?grayscale')] scale-150 rotate-12"></div>
        </div>
      )}

      <div className="p-4 bg-red-950/80 flex items-center justify-between border-b border-red-600 z-10">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500 animate-bounce" size={18} />
          <h1 className="text-lg font-black uppercase tracking-tighter glitch-text">System Hacked</h1>
        </div>
        <div className="text-[10px] bg-red-600 text-black px-1 font-bold">LIVE_FEED</div>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 bg-black border border-red-900/50 p-3 rounded flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 text-red-500 text-[10px] border-b border-red-900/30 pb-1 opacity-50">
            <span className="flex items-center gap-1"><Terminal size={10} /> STREAM_OUT</span>
            <span>ENCR_AES_256</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-[11px] leading-tight">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-red-900 shrink-0">#</span>
                <span className={idx === logs.length - 1 ? 'text-red-500 font-bold' : 'text-red-700'}>
                  {log}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        <div className="bg-red-950/20 border border-red-600/50 p-4 rounded-lg text-center flicker">
          <ShieldAlert size={36} className="mx-auto mb-2 text-red-500" />
          <h2 className="text-xl font-black mb-1 glitch-text uppercase">Fatal Security Loss</h2>
          <p className="text-red-400 text-[11px] leading-relaxed mb-4">
            Remote access established. Your camera is active. Private data is being synced to the master server.
          </p>
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-red-600 mb-1">
              <Lock size={10} />
              <span>OVERRIDE KEY REQUIRED</span>
            </div>
            
            <input
              type="text"
              inputMode="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter Key..."
              autoComplete="off"
              className="w-full bg-black border border-red-900/80 p-3 text-center text-red-500 focus:outline-none focus:border-red-500 transition-colors uppercase tracking-[0.3em] text-xs font-bold"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="p-2 bg-red-950 flex justify-between text-[9px] uppercase tracking-widest text-red-500 border-t border-red-700/50">
        <div className="flex gap-3">
          <span>ID: BR-9921</span>
          <span>MEM: PURGE</span>
        </div>
        <div className="animate-pulse">TRANSFERRING... 82%</div>
      </div>

      <button 
        onClick={() => {
            const el = document.documentElement;
            if (el.requestFullscreen) {
              el.requestFullscreen().catch(() => {});
              triggerVibrate(50);
            }
        }}
        className="fixed top-14 right-4 bg-red-600/10 text-red-600 p-2 rounded-full border border-red-600/20 active:bg-red-600 active:text-black transition-all"
      >
        <Power size={14} />
      </button>
    </div>
  );
};

export default App;
