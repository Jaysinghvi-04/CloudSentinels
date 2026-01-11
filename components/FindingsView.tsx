
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ShieldAlert, 
  ExternalLink, 
  Code, 
  Zap, 
  Search, 
  Filter, 
  MoreHorizontal,
  Cloud,
  Terminal,
  Clock,
  AlertCircle,
  RefreshCw,
  Box,
  Fingerprint,
  Eye,
  ShieldOff,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  MessageSquareText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Finding, Severity, CloudProvider } from '../types';

type RemediationStepStatus = 'idle' | 'running' | 'success' | 'error';

interface RemediationProgress {
  step: number;
  steps: {
    label: string;
    status: RemediationStepStatus;
    detail?: string;
  }[];
}

const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'F-001',
    title: 'S3 Bucket "finance-reports" is public',
    resource: 'arn:aws:s3:::finance-reports',
    provider: CloudProvider.AWS,
    severity: Severity.CRITICAL,
    status: 'Open',
    framework: ['CIS 1.2', 'NIST AC-3'],
    impact: 'Critical data leakage path detected. An unauthenticated attacker could traverse and exfiltrate PII data. This violates corporate governance policy P-91.',
    fix: 'aws s3api put-public-access-block --bucket finance-reports --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
    timestamp: '2024-05-20T10:30:00Z'
  },
  {
    id: 'F-002',
    title: 'Azure Disk "vm-disk-01" is unencrypted',
    resource: '/subscriptions/sub-123/disks/vm-disk-01',
    provider: CloudProvider.AZURE,
    severity: Severity.HIGH,
    status: 'Open',
    framework: ['CIS 2.1'],
    impact: 'Physical data compromise risk. Regulatory frameworks (GDPR/HIPAA) require encryption at rest for all production volumes.',
    fix: 'az disk update --name vm-disk-01 --resource-group prod-rg --encryption-type EncryptionAtRestWithCustomerKey',
    timestamp: '2024-05-20T11:15:00Z'
  },
  {
    id: 'F-003',
    title: 'GCP Service Account has Overly Permissive Roles',
    resource: 'deployer@project-x.iam.gserviceaccount.com',
    provider: CloudProvider.GCP,
    severity: Severity.MEDIUM,
    status: 'Open',
    framework: ['CIS 1.6', 'Least Privilege'],
    impact: 'Lateral movement risk. This account has "Project Owner" permissions but only requires "GCR Reader". Compomise leads to full environment takeover.',
    fix: 'gcloud projects remove-iam-policy-binding project-x --member="serviceAccount:deployer@project-x.iam.gserviceaccount.com" --role="roles/owner"',
    timestamp: '2024-05-20T12:00:00Z'
  }
];

const DEFAULT_REMEDIATION_STEPS = [
  { label: 'Cloud API Authentication', status: 'idle' as RemediationStepStatus, detail: 'Validating service principal permissions' },
  { label: 'Policy Integrity Check', status: 'idle' as RemediationStepStatus, detail: 'Verifying remediation payload safety' },
  { label: 'Remediation Deployment', status: 'idle' as RemediationStepStatus, detail: 'Applying resource configuration update' },
  { label: 'Final Compliance Audit', status: 'idle' as RemediationStepStatus, detail: 'Confirming resource is now secure' },
];

const FindingsView: React.FC = () => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [suppressingId, setSuppressingId] = useState<string | null>(null);
  const [suppressionReason, setSuppressionReason] = useState<string>('');
  const [suppressionNotes, setSuppressionNotes] = useState<string>('');
  const [remediationProgress, setRemediationProgress] = useState<Record<string, RemediationProgress>>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchFindings = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setFindings(INITIAL_FINDINGS);
      setLoading(false);
    };
    fetchFindings();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToast({ id, msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRemediate = async (id: string) => {
    if (remediationProgress[id]?.step !== undefined && remediationProgress[id].step < DEFAULT_REMEDIATION_STEPS.length) return;
    
    setRemediatingId(id);
    setActiveMenu(null);
    setExpandedRow(id);

    const steps = DEFAULT_REMEDIATION_STEPS.map(s => ({ ...s }));
    setRemediationProgress(prev => ({ ...prev, [id]: { step: 0, steps } }));

    for (let i = 0; i < steps.length; i++) {
      setRemediationProgress(prev => {
        const current = { ...prev[id] };
        current.steps[i].status = 'running';
        current.step = i;
        return { ...prev, [id]: current };
      });

      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

      setRemediationProgress(prev => {
        const current = { ...prev[id] };
        current.steps[i].status = 'success';
        return { ...prev, [id]: current };
      });
    }

    setFindings(prev => prev.map(f => f.id === id ? { ...f, status: 'Fixed' as const } : f));
    setRemediatingId(null);
    showToast(`Remediation successful for ${id}`);
  };

  const handleConfirmSuppression = () => {
    if (!suppressingId || !suppressionReason) return;
    setFindings(prev => prev.map(f => f.id === suppressingId ? { ...f, status: 'Muted' as const } : f));
    showToast(`Finding ${suppressingId} has been suppressed.`);
    setSuppressingId(null);
    setSuppressionReason('');
    setSuppressionNotes('');
    setActiveMenu(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"></div>
        <div className="h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  const suppressedFinding = findings.find(f => f.id === suppressingId);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative" onClick={() => setActiveMenu(null)}>
      {/* Enhanced Suppression Confirmation Modal */}
      <AnimatePresence>
        {suppressingId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuppressingId(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 lg:p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <ShieldOff size={240} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-200 dark:border-amber-500/20">
                    <ShieldOff size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                      Suppress Finding
                    </h2>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Action Audit Requirement</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Target Finding</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 italic">"{suppressedFinding?.title}"</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">Justification Type</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['False Positive', 'Risk Accepted', 'Compensating Control'].map((reason) => (
                        <button
                          key={reason}
                          onClick={() => setSuppressionReason(reason)}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                            suppressionReason === reason 
                            ? 'bg-slate-100 dark:bg-slate-800 border-brand-navy shadow-md' 
                            : 'bg-white dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <span className={`text-xs font-black uppercase tracking-widest ${suppressionReason === reason ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{reason}</span>
                          {suppressionReason === reason && <CheckCircle2 size={16} className="text-brand-navy" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 italic">Audit Notes (Optional)</label>
                    <div className="relative group">
                      <MessageSquareText className="absolute left-4 top-4 text-slate-400 dark:text-slate-600" size={18} />
                      <textarea 
                        value={suppressionNotes}
                        onChange={(e) => setSuppressionNotes(e.target.value)}
                        placeholder="Provide context for auditors..."
                        className="w-full h-24 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-medium focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-slate-100 shadow-inner resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      onClick={() => setSuppressingId(null)}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleConfirmSuppression}
                      disabled={!suppressionReason}
                      className="flex-[2] py-4 bg-brand-navy text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-midnight transition-all shadow-xl shadow-brand-navy/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed group"
                    >
                      {suppressionReason ? 'Mute Finding' : 'Select Reason First'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-8 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/90 border-red-500/30 text-red-700 dark:text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Action Center</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Remote execution engine connected to global remediation cluster.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-inner">
             <TabButton label="Active" active />
             <TabButton label="Muted" />
             <TabButton label="Resolved" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-wrap items-center gap-4 shadow-md dark:shadow-xl">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-navy transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search resources, frameworks..." 
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-navy transition-all placeholder:text-slate-400 dark:placeholder:text-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
        <FilterButton label="Cloud: Multi" />
        <FilterButton label="Severity: Critical+" />
        <FilterButton label="Status: Unresolved" />
        <div className="ml-auto flex items-center gap-2">
           <button className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all shadow-inner">
             <RefreshCw size={20} />
           </button>
        </div>
      </div>

      {/* Findings Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-visible bg-white dark:bg-slate-900/20 backdrop-blur-md shadow-lg dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-5 rounded-tl-[32px]">Security Finding</th>
                <th className="px-8 py-5">Cloud</th>
                <th className="px-8 py-5">Risk Level</th>
                <th className="px-8 py-5">Frameworks</th>
                <th className="px-8 py-5 text-right rounded-tr-[32px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {findings.map((finding) => (
                <React.Fragment key={finding.id}>
                  <tr 
                    onClick={() => toggleExpand(finding.id)}
                    className={`group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300 ${expandedRow === finding.id ? 'bg-slate-50 dark:bg-slate-800/50' : ''} ${finding.status === 'Muted' ? 'opacity-40 grayscale' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${
                          finding.status === 'Fixed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
                          finding.status === 'Muted' ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' :
                          remediationProgress[finding.id]?.step !== undefined ? 'bg-brand-navy/10 text-brand-navy border border-brand-navy/20 animate-pulse' :
                          finding.severity === Severity.CRITICAL ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                          finding.severity === Severity.HIGH ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {remediationProgress[finding.id]?.step !== undefined && finding.status !== 'Fixed' ? (
                            <RefreshCw size={20} className="animate-spin" />
                          ) : finding.status === 'Fixed' ? (
                            <CheckCircle2 size={20} />
                          ) : finding.status === 'Muted' ? (
                            <ShieldOff size={20} />
                          ) : (
                            <ShieldAlert size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white transition-colors">{finding.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-2 uppercase tracking-tight">
                            <Terminal size={12} className="text-slate-400 dark:text-slate-600" /> {finding.resource}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-fit">
                         <Cloud size={14} className="text-slate-500 dark:text-slate-400" />
                         <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">{finding.provider}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <SeverityBadge severity={finding.severity} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {finding.framework.map(f => (
                          <span key={f} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[9px] rounded-lg border border-slate-200 dark:border-slate-800 font-black uppercase tracking-wider">{f}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right relative">
                      <div className="flex items-center justify-end gap-3">
                         <div className="hidden lg:flex items-center gap-2 mr-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${finding.status === 'Open' ? 'bg-red-500 animate-pulse' : finding.status === 'Fixed' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${finding.status === 'Open' ? 'text-red-500' : finding.status === 'Fixed' ? 'text-emerald-500' : 'text-slate-500'}`}>{finding.status}</span>
                         </div>
                         
                         <div className="relative">
                            <button 
                              onClick={(e) => toggleMenu(e, finding.id)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                              <MoreHorizontal size={20} />
                            </button>

                            {activeMenu === finding.id && (
                              <div 
                                className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                 <button 
                                   onClick={() => handleRemediate(finding.id)}
                                   disabled={remediationProgress[finding.id]?.step !== undefined || finding.status !== 'Open'}
                                   className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
                                     finding.status !== 'Open' || remediationProgress[finding.id]
                                       ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                                       : 'text-brand-navy dark:text-blue-400 hover:bg-brand-navy/5 dark:hover:bg-blue-400/10'
                                   }`}
                                 >
                                   <Zap size={14} fill="currentColor" />
                                   Magic Fix
                                 </button>

                                 <button 
                                   onClick={() => setSuppressingId(finding.id)}
                                   disabled={finding.status !== 'Open'}
                                   className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
                                     finding.status !== 'Open'
                                      ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                   }`}
                                 >
                                   <ShieldOff size={14} />
                                   Suppress
                                 </button>
                                 <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-2"></div>
                                 <button 
                                   onClick={() => toggleExpand(finding.id)}
                                   className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                                 >
                                   <Eye size={14} />
                                   View Details
                                 </button>
                              </div>
                            )}
                         </div>
                      </div>
                    </td>
                  </tr>

                  {expandedRow === finding.id && (
                    <tr>
                      <td colSpan={5} className="p-0 border-b border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-950/80 p-10 animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-20 opacity-[0.05] dark:opacity-[0.02] pointer-events-none">
                            <Box size={300} />
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                            {/* Info Column */}
                            <div className="lg:col-span-5 space-y-8">
                               <section>
                                 <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-3 italic">
                                   <AlertCircle size={16} /> Exposure Impact & Analysis
                                 </h4>
                                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">{finding.impact}</p>
                               </section>
                               
                               <div className="grid grid-cols-2 gap-4">
                                  <MetadataCard label="Discovered" value={new Date(finding.timestamp).toLocaleDateString()} icon={<Clock size={14} />} />
                                  <MetadataCard label="Audit UID" value={finding.id} icon={<Fingerprint size={14} />} />
                               </div>

                               <div className="pt-6 flex flex-wrap gap-4">
                                  <button className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-md dark:shadow-xl active:scale-95">
                                    <ExternalLink size={16} /> Cloud Console
                                  </button>
                                  {finding.status === 'Open' && (
                                    <button 
                                      onClick={() => setSuppressingId(finding.id)}
                                      className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-md dark:shadow-xl active:scale-95"
                                    >
                                      Mute Findings
                                    </button>
                                  )}
                               </div>
                            </div>

                            {/* Action/Remediation Column */}
                            <div className="lg:col-span-7 space-y-8">
                               {(remediationProgress[finding.id] || finding.status === 'Fixed') ? (
                                 <section className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 space-y-8 animate-in fade-in duration-500 shadow-lg dark:shadow-2xl">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                                      <div className="space-y-1">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Remediation Pipeline</h4>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Deployment State: {finding.status === 'Fixed' ? 'Verified' : 'Active'}</p>
                                      </div>
                                      <div className={`p-4 rounded-2xl border ${finding.status === 'Fixed' ? 'bg-emerald-50 border-emerald-500/30 text-emerald-600 dark:text-emerald-500 dark:bg-emerald-500/10' : 'bg-brand-navy/10 border-brand-navy/30 text-brand-navy dark:text-blue-500 dark:bg-brand-navy/10'}`}>
                                        {finding.status === 'Fixed' ? <ShieldCheck size={28} /> : <Activity size={28} className="animate-pulse" />}
                                      </div>
                                    </div>

                                    <div className="space-y-6">
                                      {(remediationProgress[finding.id]?.steps || DEFAULT_REMEDIATION_STEPS).map((step, idx) => (
                                        <div key={idx} className="flex items-start gap-4 group">
                                          <div className="relative flex flex-col items-center">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-500 ${
                                              finding.status === 'Fixed' || step.status === 'success' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                              step.status === 'running' ? 'bg-slate-50 dark:bg-slate-950 border-brand-navy text-brand-navy animate-pulse' :
                                              'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-700'
                                            }`}>
                                              {finding.status === 'Fixed' || step.status === 'success' ? <CheckCircle2 size={14} /> : 
                                               step.status === 'running' ? <RefreshCw size={12} className="animate-spin" /> : (idx + 1)}
                                            </div>
                                            {idx < 3 && (
                                              <div className={`w-0.5 h-10 -mb-6 mt-1 transition-colors duration-500 ${
                                                finding.status === 'Fixed' || step.status === 'success' ? 'bg-emerald-500/30' : 'bg-slate-200 dark:bg-slate-800'
                                              }`}></div>
                                            )}
                                          </div>
                                          <div className="flex-1 pb-4">
                                            <p className={`text-xs font-black uppercase tracking-widest transition-colors ${
                                              finding.status === 'Fixed' || step.status === 'success' ? 'text-slate-900 dark:text-white' : 
                                              step.status === 'running' ? 'text-brand-navy' : 'text-slate-400 dark:text-slate-600'
                                            }`}>
                                              {step.label}
                                            </p>
                                            <p className="text-[10px] text-slate-500 mt-1 font-medium italic opacity-70">
                                              {step.status === 'running' ? 'In Progress...' : step.status === 'success' || finding.status === 'Fixed' ? 'Completed successfully' : step.detail}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {finding.status === 'Fixed' && (
                                      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                          <ShieldCheck size={16} /> Automated Audit Passed
                                        </div>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                                          Rollback Action <ArrowRight size={14} />
                                        </button>
                                      </div>
                                    )}
                                 </section>
                               ) : finding.status === 'Muted' ? (
                                 <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
                                    <div className="p-5 bg-slate-100 dark:bg-slate-950 rounded-[28px] border border-slate-200 dark:border-slate-800">
                                      <ShieldOff size={40} className="text-slate-400 dark:text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase italic tracking-tighter">Finding Muted</h4>
                                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Compliance reporting for this resource is currently disabled.</p>
                                    </div>
                                    <button 
                                      onClick={() => setFindings(prev => prev.map(f => f.id === finding.id ? { ...f, status: 'Open' } : f))}
                                      className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                                    >
                                      Unmute Finding
                                    </button>
                                 </div>
                               ) : (
                                 <>
                                   <section>
                                     <h4 className="text-[10px] font-black text-brand-navy dark:text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 italic">
                                       <Code size={16} /> Automated Fix Payload
                                     </h4>
                                     <div className="bg-slate-50 dark:bg-slate-950 rounded-[28px] border border-slate-200 dark:border-slate-800 p-8 font-mono text-xs text-slate-500 relative group overflow-hidden shadow-inner">
                                       <div className="flex items-center gap-2 mb-6">
                                         <div className="w-2.5 h-2.5 rounded-full bg-brand-navy/20"></div>
                                         <div className="w-2.5 h-2.5 rounded-full bg-amber-600/20"></div>
                                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-600/20"></div>
                                       </div>
                                       <div className="leading-relaxed">
                                         <span className="text-brand-navy dark:text-blue-500 opacity-60">$</span> {finding.fix}
                                       </div>
                                       <button className="absolute right-6 top-6 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-900 dark:hover:text-white shadow-xl">
                                         <Terminal size={16} />
                                       </button>
                                     </div>
                                   </section>

                                   <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-brand-navy/10 dark:border-brand-navy/10 rounded-[40px] p-10 space-y-8 shadow-lg dark:shadow-2xl relative overflow-hidden group">
                                     <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-navy/5 blur-3xl group-hover:bg-brand-navy/10 transition-all"></div>
                                     <div className="flex items-center justify-between relative z-10">
                                       <div className="space-y-1">
                                         <h4 className="font-black text-slate-900 dark:text-white text-2xl italic uppercase tracking-tighter">Magic Fix Orchestrator</h4>
                                         <p className="text-[10px] text-brand-navy font-black uppercase tracking-[0.2em]">Zero-Touch Remediation Cluster</p>
                                       </div>
                                       <div className="p-5 bg-white dark:bg-brand-navy/10 rounded-[24px] border border-brand-navy/20 shadow-xl">
                                         <Zap className="text-brand-navy" size={32} />
                                       </div>
                                     </div>
                                     
                                     <button 
                                      onClick={(e) => { e.stopPropagation(); handleRemediate(finding.id); }}
                                      className="w-full py-5 rounded-[22px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all bg-brand-navy text-white hover:bg-brand-midnight active:scale-[0.98] shadow-lg dark:shadow-[0_15px_30px_rgba(10,36,99,0.2)] relative z-10"
                                     >
                                       <Zap size={20} fill="currentColor" /> Trigger Root Cause Resolution
                                     </button>
                                   </div>
                                 </>
                               )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetadataCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
    <span className="text-[10px] text-slate-500 dark:text-slate-600 font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
      {icon} {label}
    </span>
    <span className="text-xs font-bold text-slate-900 dark:text-slate-300 font-mono tracking-tighter">{value}</span>
  </div>
);

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const styles = {
    [Severity.CRITICAL]: 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    [Severity.HIGH]: 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]',
    [Severity.MEDIUM]: 'bg-brand-navy text-white shadow-[0_0_12px_rgba(10,36,99,0.3)]',
    [Severity.LOW]: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const TabButton = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`
    px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
    ${active 
      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm dark:shadow-xl border border-slate-200 dark:border-slate-700/50' 
      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
    }
  `}>
    {label}
  </button>
);

const FilterButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center gap-3 px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200 transition-all shadow-inner">
    {label}
    <ChevronDown size={14} strokeWidth={3} />
  </button>
);

export default FindingsView;
