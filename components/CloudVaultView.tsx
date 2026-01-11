
import React, { useState } from 'react';
import { Cloud, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck, Lock, Fingerprint, ExternalLink } from 'lucide-react';
import { CloudProvider } from '../types';

const CloudVaultView: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>(CloudProvider.AWS);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error', message?: string }>({ status: 'idle' });
  const [showSecret, setShowSecret] = useState(false);

  const handleTestHandshake = () => {
    setIsTesting(true);
    setTestResult({ status: 'idle' });
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({ 
        status: 'success', 
        message: 'Identity Validated: cloudsentinels-scanner-service-role' 
      });
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Cloud Vault</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto italic">Zero-trust credential orchestration. All keys are encrypted at rest with AES-256 GCM and never stored as plaintext.</p>
      </div>

      {/* Provider Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProviderCard 
          provider={CloudProvider.AWS} 
          active={selectedProvider === CloudProvider.AWS} 
          onClick={() => setSelectedProvider(CloudProvider.AWS)} 
          icon={<Cloud className="text-orange-500" />}
          description="Access Key & IAM Auth"
        />
        <ProviderCard 
          provider={CloudProvider.AZURE} 
          active={selectedProvider === CloudProvider.AZURE} 
          onClick={() => setSelectedProvider(CloudProvider.AZURE)} 
          icon={<Cloud className="text-blue-500" />}
          description="Service Principal (OIDC)"
        />
        <ProviderCard 
          provider={CloudProvider.GCP} 
          active={selectedProvider === CloudProvider.GCP} 
          onClick={() => setSelectedProvider(CloudProvider.GCP)} 
          icon={<Cloud className="text-emerald-500" />}
          description="JSON Service Account"
        />
      </div>

      {/* Credential Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-10 relative overflow-hidden shadow-2xl dark:shadow-none">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck size={240} className="text-slate-400 dark:text-white" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-black flex items-center gap-4 text-slate-900 dark:text-white uppercase italic tracking-tighter">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy/5 dark:bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center shadow-inner">
                <Lock size={24} className="text-brand-navy" />
              </div>
              {selectedProvider} Configuration
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-inner">
              <Fingerprint size={14} className="text-brand-navy" /> Secure Tunnel V2.4
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedProvider === CloudProvider.AWS && (
              <>
                <InputGroup label="Access Key ID" placeholder="AKIA..." icon={<ShieldCheck size={16} />} />
                <InputGroup 
                  label="Secret Access Key" 
                  placeholder="••••••••••••••••••••••••••••••••" 
                  type={showSecret ? "text" : "password"}
                  icon={<Lock size={16} />}
                  rightAction={
                    <button onClick={() => setShowSecret(!showSecret)} className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                      {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <InputGroup label="Session Token (Optional)" placeholder="FwoGZXIvYXdzE..." />
                <InputGroup label="Default Region" placeholder="us-east-1" />
              </>
            )}

            {selectedProvider === CloudProvider.AZURE && (
              <>
                <InputGroup label="Tenant ID" placeholder="00000000-0000-..." />
                <InputGroup label="Client ID" placeholder="00000000-0000-..." />
                <InputGroup label="Client Secret" placeholder="••••••••" type="password" />
                <InputGroup label="Subscription ID" placeholder="00000000-0000-..." />
              </>
            )}

            {selectedProvider === CloudProvider.GCP && (
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Service Account Key (JSON)</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center hover:border-brand-navy/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group shadow-inner">
                  <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    <Cloud className="text-emerald-500" size={32} />
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Drag & Drop JSON Key</p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Or click to browse your local workstation</p>
                  <input type="file" className="hidden" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
             <div className="flex flex-wrap items-center gap-4">
               <button 
                onClick={handleTestHandshake}
                disabled={isTesting}
                className="px-8 py-4 bg-slate-100 dark:bg-slate-50 text-slate-900 dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-md active:scale-95"
               >
                 {isTesting ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                 Run Validation
               </button>
               <button className="px-8 py-4 bg-brand-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-midnight transition-all shadow-xl shadow-brand-navy/20 flex items-center gap-3 active:scale-95">
                 Finalize Connection
               </button>
             </div>

             {testResult.status !== 'idle' && (
               <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-500 border-2 shadow-sm ${
                 testResult.status === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20' 
                  : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20'
               }`}>
                 {testResult.status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                 {testResult.message}
               </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Help Section */}
      <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center justify-between shadow-md dark:shadow-none">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
             <ExternalLink className="text-slate-500" size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Need help with permissions?</p>
            <p className="text-xs text-slate-500 italic">Read our documentation on Least Privilege IAM policies.</p>
          </div>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-brand-navy dark:text-blue-400 hover:text-brand-midnight transition-colors">View Integration Guide</button>
      </div>
    </div>
  );
};

const ProviderCard: React.FC<{ provider: string, active: boolean, onClick: () => void, icon: React.ReactNode, description: string }> = ({ provider, active, onClick, icon, description }) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-start p-8 rounded-[32px] border-2 transition-all text-left group
      ${active 
        ? 'bg-white dark:bg-slate-900 border-brand-navy shadow-2xl dark:shadow-[0_0_30px_rgba(10,36,99,0.1)] scale-[1.02] z-10' 
        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100 shadow-sm'
      }
    `}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-6 shadow-inner group-hover:bg-slate-50 dark:group-hover:bg-slate-900 transition-colors`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <span className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-1">{provider}</span>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{description}</span>
  </button>
);

const InputGroup: React.FC<{ label: string, placeholder: string, type?: string, icon?: React.ReactNode, rightAction?: React.ReactNode }> = ({ label, placeholder, type = "text", icon, rightAction }) => (
  <div className="space-y-3">
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-brand-navy transition-colors">
          {icon}
        </div>
      )}
      <input 
        type={type} 
        placeholder={placeholder}
        className={`
          w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800 text-slate-900 dark:text-slate-100 shadow-inner
          ${icon ? 'pl-12' : ''}
        `}
      />
      {rightAction && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightAction}
        </div>
      )}
    </div>
  </div>
);

export default CloudVaultView;
