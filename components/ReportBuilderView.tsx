
import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Clock, Eye, ShieldCheck, ChevronRight, FileOutput, FileSearch, FileCode } from 'lucide-react';

const ReportBuilderView: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('exec');

  const templates = [
    { id: 'exec', name: 'Executive Summary', desc: 'High-level risk posture and compliance charts for leadership.', icon: <FileSearch size={18} /> },
    { id: 'tech', name: 'Technical Audit', desc: 'Detailed table of all findings, resource IDs, and fix status.', icon: <FileCode size={18} /> },
    { id: 'compliance', name: 'Compliance Mapping', desc: 'Specific alignment report for NIST, CIS, or SOC2.', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Report Builder</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Generate professional security artifacts for stakeholders and auditors.</p>
        </div>
        <button className="flex items-center justify-center gap-3 px-8 py-3.5 bg-brand-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-midnight transition-all shadow-xl shadow-brand-navy/20 active:scale-95">
          <Download size={18} />
          Export Artifact (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-lg dark:shadow-none">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 italic">1. Select Template</h3>
            <div className="space-y-4">
              {templates.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`
                    w-full text-left p-5 rounded-2xl border-2 transition-all group relative overflow-hidden
                    ${selectedTemplate === t.id 
                      ? 'bg-slate-50 dark:bg-slate-900 border-brand-navy shadow-md scale-[1.02]' 
                      : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedTemplate === t.id ? 'text-brand-navy bg-brand-navy/10' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                        {t.icon}
                      </div>
                      <span className={`font-black uppercase tracking-tighter italic text-sm ${selectedTemplate === t.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{t.name}</span>
                    </div>
                    {selectedTemplate === t.id && (
                      <div className="p-1 rounded-full bg-brand-navy text-white animate-in zoom-in duration-300">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-lg dark:shadow-none">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 italic">2. Compliance Mapping</h3>
            <div className="grid grid-cols-1 gap-4">
              <CheckboxItem label="CIS Benchmark (Global)" checked />
              <CheckboxItem label="NIST 800-53 (FedRAMP)" checked />
              <CheckboxItem label="SOC2 Type II (TSC)" />
              <CheckboxItem label="HIPAA Security Rule" />
              <CheckboxItem label="PCI-DSS v4.0" />
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-lg dark:shadow-none">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] italic">Archive</h3>
               <FileOutput size={16} className="text-slate-400" />
             </div>
             <div className="space-y-3">
                <HistoryItem name="Q2_Security_Audit.pdf" date="Yesterday" />
                <HistoryItem name="NIST_Compliance_Final.pdf" date="May 14, 2024" />
             </div>
          </section>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-8 flex flex-col">
           <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[40px] h-full min-h-[800px] overflow-hidden flex flex-col shadow-2xl transition-colors duration-500">
              {/* Browser-like Chrome */}
              <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter uppercase">
                        {selectedTemplate === 'exec' ? 'exec_summary_posture_v1.pdf' : 'technical_vulnerability_dump.pdf'}
                      </span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <Eye size={12} /> Live Preview
                    </div>
                    <span>100% Zoom</span>
                 </div>
              </div>

              {/* Scrollable PDF Area */}
              <div className="flex-1 overflow-y-auto p-12 lg:p-16 flex justify-center bg-slate-200 dark:bg-slate-900/50 scroll-smooth">
                 {/* The Page */}
                 <div className="bg-white w-full max-w-[700px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-12 lg:p-20 text-slate-950 animate-in fade-in zoom-in-95 duration-500 min-h-[1000px] relative">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
                      <ShieldCheck size={200} />
                    </div>

                    <header className="flex justify-between items-start border-b-8 border-slate-950 pb-10 mb-12 relative z-10">
                       <div className="space-y-1">
                          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-brand-navy">Cloud Sentinels</h1>
                          <p className="text-slate-500 font-black tracking-[0.3em] text-[10px] uppercase">Security Orchestration Engine</p>
                       </div>
                       <div className="text-right font-mono">
                          <p className="text-xs font-black">REF: #CG-{new Date().getFullYear()}-001</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase">Generated: {new Date().toLocaleDateString()}</p>
                       </div>
                    </header>

                    <div className="space-y-16 relative z-10">
                       <section className="space-y-8">
                          <h2 className="text-2xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                            <span className="w-10 h-10 bg-brand-navy text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-xl">01</span>
                            Posture Integrity Audit
                          </h2>
                          <div className="grid grid-cols-3 gap-6">
                             <PdfMetric label="Compliance" value="78.4%" />
                             <PdfMetric label="Toxic Paths" value="12 Active" color="text-red-600" />
                             <PdfMetric label="Managed Assets" value="4,291" />
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                            Report Type: {templates.find(t => t.id === selectedTemplate)?.name}. This artifact contains automated evidence of infrastructure compliance against global standards.
                          </p>
                       </section>

                       <section className="space-y-8">
                          <h2 className="text-2xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                            <span className="w-10 h-10 bg-brand-navy text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-xl">02</span>
                            Blast Radius Analysis
                          </h2>
                          <div className="h-48 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                             <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                               <FileOutput size={24} className="text-slate-300" />
                             </div>
                             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Vector Visualization Overlay</span>
                          </div>
                          <div className="space-y-4">
                             <PdfSubSection title="Critical Findings" detail="Analysis of public S3 buckets and lateral movement risk in the AWS-PROD environment." />
                             <PdfSubSection title="Remediation Summary" detail="156 findings automatically resolved via Magic Fix during the audit period." />
                          </div>
                       </section>

                       <footer className="pt-24 text-center space-y-4 opacity-50 border-t border-slate-100">
                          <div className="flex items-center justify-center gap-4">
                            <ShieldCheck size={16} className="text-slate-300" />
                            <p className="text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">Confidential Artifact • PII Redacted</p>
                          </div>
                          <div className="w-12 h-1 bg-slate-950 mx-auto rounded-full"></div>
                       </footer>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const CheckboxItem = ({ label, checked }: { label: string, checked?: boolean }) => (
  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer group hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-inner">
    <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${checked ? 'text-slate-900 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-500'}`}>{label}</span>
    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${checked ? 'bg-brand-navy border-brand-navy shadow-lg shadow-brand-navy/10' : 'border-slate-200 dark:border-slate-800'}`}>
      {checked && <CheckCircle size={12} className="text-white" />}
    </div>
  </label>
);

const HistoryItem = ({ name, date }: { name: string, date: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer group transition-all shadow-inner">
    <div className="flex items-center gap-4">
       <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform">
         <FileText size={18} className="text-slate-400 dark:text-slate-500" />
       </div>
       <div className="space-y-0.5">
         <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-slate-300 block">{name}</span>
         <span className="text-[9px] text-slate-400 dark:text-slate-600 font-mono font-bold tracking-tighter">{date}</span>
       </div>
    </div>
    <Download size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-0.5" />
  </div>
);

const PdfMetric = ({ label, value, color = "text-slate-900" }: { label: string, value: string, color?: string }) => (
  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 shadow-inner">
     <span className="text-[9px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{label}</span>
     <span className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</span>
  </div>
);

const PdfSubSection = ({ title, detail }: { title: string, detail: string }) => (
  <div className="space-y-2 border-l-4 border-slate-100 pl-6">
     <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{title}</h4>
     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{detail}</p>
  </div>
);

export default ReportBuilderView;
