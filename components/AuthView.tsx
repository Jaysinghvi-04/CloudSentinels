
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Shield, Fingerprint, Sun, Moon } from 'lucide-react';

interface AuthViewProps {
  onLogin: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, theme, onToggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-navy/10 dark:bg-brand-navy/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      </div>

      {/* Theme Toggle Overlay */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={onToggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:scale-105 transition-all text-slate-500 dark:text-slate-400"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Top Logo and Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-navy/40 mb-6"
            >
              <ShieldCheck className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
              Cloud Sentinels
            </h1>
            <p className="text-sm font-medium text-slate-500 italic">
              Enterprise Identity Orchestration
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-navy transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Sentinel Operator"
                      required
                      className="w-full h-14 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-slate-100 shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">Corporate Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-navy transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="operator@sentinels.cloud"
                    required
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-slate-100 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Vault Key</label>
                  {isLogin && <button type="button" className="text-[10px] font-black uppercase tracking-widest text-brand-navy dark:text-blue-400 hover:text-brand-midnight transition-colors italic">Recovery Path?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-navy transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    required
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-slate-100 shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-brand-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-midnight transition-all shadow-xl shadow-brand-navy/20 active:scale-[0.98] disabled:opacity-50 mt-4 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? 'Initiate Link' : 'Register Identity'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 hover:text-brand-navy dark:hover:text-blue-400 transition-colors"
            >
              {isLogin ? "No Access? Provision New Identity" : "Already Identified? Secure Login"}
            </button>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="mt-8 flex justify-center gap-6">
          <Badge icon={<Shield size={12} />} label="AES-256 GCM" />
          <Badge icon={<Fingerprint size={12} />} label="Zero Trust" />
          <Badge icon={<ShieldCheck size={12} />} label="ISO 27001" />
        </div>
      </motion.div>
    </div>
  );
};

const Badge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
    <div className="p-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700/50">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

export default AuthView;
