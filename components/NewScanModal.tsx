
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cloud, ShieldCheck, Lock, ArrowRight, Zap, Database, Server, Cpu, Globe, Activity, Terminal, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CloudProvider } from '../types';

interface NewScanModalProps {
  onClose: () => void;
  onStartScan: (platform: CloudProvider) => void;
}

type VerificationStep = {
  id: string;
  label: string;
  status: 'idle' | 'loading' | 'success' | 'error';
};

const NewScanModal: React.FC<NewScanModalProps> = ({ onClose, onStartScan }) => {
  const [step, setStep] = useState<'platform' | 'credentials' | 'verifying'>('platform');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { id: 'auth', label: 'Identity Handshake', status: 'idle' },
    { id: 'sts', label: 'STS Token Exchange', status: 'idle' },
    { id: 'iam', label: 'IAM Policy Simulation', status: 'idle' },
    { id: 'enc', label: 'GCM Key Wrapping', status: 'idle' },
  ]);
  const [logs, setLogs] = useState<string[]>([]);

  const handleProviderSelect = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    setStep('credentials');
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const runVerification = async () => {
    setStep('verifying');
    setIsLoading(true);
    addLog(`Initiating connection to ${selectedProvider} global endpoint...`);

    for (let i = 0; i < verificationSteps.length; i++) {
      setVerificationSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'loading' } : s));
      
      const waitTime = 600 + Math.random() * 800;
      await new Promise(resolve => setTimeout(resolve, waitTime));

      if (i === 0) addLog(`Handshake successful. Encrypted tunnel established.`);
      if (i === 1) addLog(`Temporary session tokens acquired and validated.`);
      if (i === 2) addLog(`Verified ReadOnly + SecurityAudit permissions.`);
      if (i === 3) addLog(`Keys secured in Zero-Knowledge Vault.`);

      setVerificationSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success' } : s));
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    if (selectedProvider) onStartScan(selectedProvider);
  };

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    runVerification();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[48px] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all z-50 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Left Panel */}
        <div className="md:w-[35%] bg-brand-navy p-10 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/20 rounded-full" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{ transformOrigin: 'center center' }}
            />
          </div>

          <div className="relative z-10">
             <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
               <ShieldCheck className="text-white" size={28} />
             </div>
             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Scanning<br/>Orchestrator</h3>
             <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               Defense Cluster Alpha
             </p>
          </div>
          
          <div className="relative z-10 space-y-6">
             <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
               <div className="flex items-center gap-3 text-white/70 text-[10px] font-black uppercase tracking-widest mb-3">
                 <Activity size={14} className="text-blue-400" /> System Integrity
               </div>
               <div className="space-y-2">
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "88%" }}
                     className="h-full bg-blue-400"
                   />
                 </div>
                 <div className="flex justify-between text-[8px] text-white/40 font-black uppercase">
                   <span>Node Load</span>
                   <span>88%</span>
                 </div>
               </div>
             </div>

             <div className="flex items-center gap-3 text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
               <Terminal size={14} /> 
               {step === 'verifying' ? 'Verifying Link...' : 'Handshake Ready'}
             </div>
          </div>
        </div>

        {/* Main Side */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'platform' && (
              <motion.div 
                key="platform"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10"
              >
                <div>
                  <span className="px-3 py-1 bg-brand-navy/10 dark:bg-blue-500/10 text-brand-navy dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Step 01 / 02</span>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mt-4">Target Selection</h2>
                  <p className="text-sm text-slate-500 font-medium italic mt-2">Identify the core infrastructure environment for active vulnerability vectoring.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <PlatformCard provider={CloudProvider.AWS} icon={<Database className="text-orange-500" />} region="US-EAST-1 (Verified)" latency="12ms" onClick={() => handleProviderSelect(CloudProvider.AWS)} />
                  <PlatformCard provider={CloudProvider.AZURE} icon={<Server className="text-blue-500" />} region="Global Multi-Zone" latency="45ms" onClick={() => handleProviderSelect(CloudProvider.AZURE)} />
                  <PlatformCard provider={CloudProvider.GCP} icon={<Cloud className="text-emerald-500" />} region="Compute Engine v4" latency="28ms" onClick={() => handleProviderSelect(CloudProvider.GCP)} />
                </div>
              </motion.div>
            )}

            {step === 'credentials' && (
              <motion.div 
                key="credentials"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <button onClick={() => setStep('platform')} className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy dark:hover:text-blue-400 transition-all mb-4">
                  <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                  Back to Platform
                </button>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-navy/10 dark:bg-blue-500/10 text-brand-navy dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Step 02 / 02</span>
                  </div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">{selectedProvider} Authentication</h2>
                </div>

                <form onSubmit={handleStartScan} className="space-y-8">
                  <div className="space-y-5">
                    <EnhancedInput label="Access Principal ID" placeholder="AKIA_..." icon={<Cpu size={18} />} />
                    <EnhancedInput label="Authorization Key" placeholder="••••••••••••••••" type="password" icon={<Lock size={18} />} />
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-16 bg-brand-navy text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-brand-midnight transition-all shadow-[0_20px_40px_rgba(10,36,99,0.3)] active:scale-[0.98] group"
                  >
                    Initiate & Verify Command
                    <Zap size={20} fill="currentColor" className="group-hover:scale-125 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'verifying' && (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                   <div className="w-20 h-20 bg-brand-navy/5 rounded-[32px] border border-brand-navy/10 flex items-center justify-center mx-auto relative">
                      <RefreshCw className="text-brand-navy animate-spin" size={32} />
                      <div className="absolute inset-0 bg-brand-navy/10 rounded-[32px] blur-xl animate-pulse"></div>
                   </div>
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Verifying Identity</h2>
                   <p className="text-xs text-slate-500 font-medium italic tracking-tight">Cloud Sentinels is performing a secure handshake with {selectedProvider}.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {verificationSteps.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                        {s.status === 'loading' ? <RefreshCw className="animate-spin text-brand-navy" size={14} /> : 
                         s.status === 'success' ? <CheckCircle2 className="text-emerald-500" size={14} /> : 
                         <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-800" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${s.status === 'loading' ? 'text-brand-navy' : s.status === 'success' ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400'}`}>
                          {s.label}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
                        {s.status === 'loading' ? 'In Progress' : s.status === 'success' ? 'Validated' : 'Queued'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simulated Terminal Logs */}
                <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[10px] space-y-1.5 shadow-inner border border-slate-800 h-24 flex flex-col justify-end">
                   {logs.map((log, i) => (
                     <p key={i} className="text-emerald-400/80 italic leading-none">{log}</p>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const PlatformCard = ({ provider, icon, region, latency, onClick }: { provider: string, icon: React.ReactNode, region: string, latency: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-brand-navy/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl transition-all group text-left relative overflow-hidden"
  >
    <div className="flex items-center gap-5 relative z-10">
       <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
         {icon}
       </div>
       <div>
         <span className="text-lg font-black uppercase tracking-tighter italic text-slate-900 dark:text-white flex items-center gap-2">
           {provider} Cluster
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
         </span>
         <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-500 transition-colors">
           <span className="flex items-center gap-1"><Globe size={10} /> {region}</span>
           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
           <span className="flex items-center gap-1"><Activity size={10} /> {latency}</span>
         </div>
       </div>
    </div>
    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all relative z-10">
      <ArrowRight size={20} className="text-brand-navy dark:text-blue-400" />
    </div>
  </button>
);

const EnhancedInput: React.FC<{ label: string, placeholder: string, type?: string, icon?: React.ReactNode }> = ({ label, placeholder, type = "text", icon }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] italic">{label}</label>
      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
        <Lock size={10} /> Encrypted
      </span>
    </div>
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-brand-navy dark:group-focus-within:text-blue-400 transition-colors">
          {icon}
        </div>
      )}
      <input 
        type={type} 
        placeholder={placeholder}
        required
        className={`
          w-full h-16 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[22px] px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-brand-navy/10 dark:focus:ring-blue-500/10 focus:border-brand-navy dark:focus:border-blue-400 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800 text-slate-900 dark:text-slate-100 shadow-inner
          ${icon ? 'pl-14' : ''}
        `}
      />
    </div>
  </div>
);

export default NewScanModal;
