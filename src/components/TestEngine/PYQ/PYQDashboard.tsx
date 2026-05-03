import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter, SortDesc, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PYQPaper } from '../types';

interface PYQDashboardProps {
  exam: 'JEE Main' | 'NEET';
  onBack: () => void;
  onSelectChapter: (subject: string, chapter: string) => void;
  onOpenFullPapers: () => void;
}

const PYQDashboard: React.FC<PYQDashboardProps> = ({ exam, onBack, onSelectChapter, onOpenFullPapers }) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics'>(exam === 'NEET' ? 'Physics' : 'Physics');

  const tabs = exam === 'NEET' 
    ? ['Home', 'Physics', 'Chemistry', 'Biology'] as const
    : ['Home', 'Physics', 'Chemistry', 'Mathematics'] as const;

  const physicsChapters = [
    { name: 'Units and Measurements', qs: 102, attempted: 38, yearInfo: '2025: 10 Qs ↑' },
    { name: 'Kinematics', qs: 102, attempted: 38, yearInfo: '2025: 11 Qs' },
    { name: 'Laws of Motion', qs: 102, attempted: 38, yearInfo: '2025: 12 Qs ↑' },
    { name: 'Work, Energy and Power', qs: 102, attempted: 38, yearInfo: '2025: 13 Qs' },
    { name: 'Rotational Motion', qs: 102, attempted: 38, yearInfo: '2025: 14 Qs ↑' },
    { name: 'Gravitation', qs: 102, attempted: 38, yearInfo: '2025: 15 Qs' },
    { name: 'Properties of Matter (Solids & Fluids)', qs: 101, attempted: 38, yearInfo: '2025: 16 Qs ↑' },
    { name: 'Thermodynamics', qs: 101, attempted: 38, yearInfo: '2025: 17 Qs' },
    { name: 'Kinetic Theory', qs: 101, attempted: 38, yearInfo: '2025: 18 Qs ↑' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#0F172A]/90 backdrop-blur-lg z-40 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center text-brand border border-brand/30">
                <CheckCircle2 size={24} fill="currentColor" className="text-brand" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">{exam}</h1>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {exam === 'JEE Main' ? '2019 - 2026' : '2012 - 2025'} | 39 Papers | 4037 Qs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 border-b border-slate-800/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-[#0F172A] shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 mt-6">
        {activeTab === 'Home' ? (
           <div className="p-6 bg-slate-800/40 border border-white/10 rounded-3xl text-center space-y-4">
               <h3 className="text-2xl font-bold">Mock Exams</h3>
               <p className="text-slate-400 text-sm">Take full length previous year papers to test your preparation in a real exam environment.</p>
               <button onClick={onOpenFullPapers} className="px-6 py-3 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 mt-4 inline-flex items-center gap-2">
                 View All Full Papers <ChevronRight size={18} />
               </button>
           </div>
        ) : (
          <>
            {/* Filter Tools */}
            <div className="flex items-center justify-between mb-6 gap-2">
              <div className="flex gap-2 w-full overflow-x-auto no-scrollbar">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap shrink-0">
                  <Filter size={16} /> Filter
                </button>
                <div className="w-px h-8 bg-white/10 mx-1 shrink-0 self-center" />
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap shrink-0">
                  Class
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap shrink-0">
                  Physics Units
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-brand border border-brand/20 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 ml-auto">
                <SortDesc size={16} /> Sort
              </button>
            </div>

            <div className="flex items-center justify-between mb-4 pl-2">
              <p className="text-sm font-bold text-slate-400">Showing chapters ({physicsChapters.length}/{physicsChapters.length})</p>
            </div>

            {/* Chapters List */}
            <div className="space-y-3">
              {physicsChapters.map((chapter, i) => (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectChapter(activeTab, chapter.name)}
                  className="bg-[#1E293B] p-5 rounded-[2rem] border border-white/5 flex flex-col cursor-pointer group shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-100 pr-4 leading-snug group-hover:text-brand transition-colors">
                      {chapter.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-brand group-hover:text-white transition-all shrink-0">
                      <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-brand tracking-wide">{chapter.attempted}/{chapter.qs} Qs</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-black/20 px-3 py-1 rounded-lg border border-white/5">
                      {chapter.yearInfo}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${(chapter.attempted / chapter.qs) * 100}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PYQDashboard;
