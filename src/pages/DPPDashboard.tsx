import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, SlidersHorizontal, ArrowUpDown, ChevronRight, 
  Atom, Beaker, Calculator, Bookmark, FunctionSquare, Ruler, 
  ArrowRight, TrendingUp, ArrowRightCircle, Lightbulb, Truck, X, Check
} from 'lucide-react';
import { syllabusData } from '../data/syllabus';
import { SubjectType } from '../components/TestEngine/types';

const subjectStyles = {
  Physics: {
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    iconBg: 'bg-orange-500',
    icon: Atom
  },
  Chemistry: {
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500',
    icon: Beaker
  },
  Mathematics: {
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500',
    icon: Calculator
  }
};

const chapterIcons = [FunctionSquare, Ruler, ArrowRight, TrendingUp, ArrowRightCircle, Lightbulb, Truck];
const chapterColors = ['text-orange-500', 'text-emerald-500', 'text-blue-500', 'text-purple-500', 'text-yellow-500', 'text-pink-500', 'text-cyan-500'];

export default function DPPDashboard() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);
  const [selectedClass, setSelectedClass] = useState<'All' | '11th' | '12th'>('All');
  const [selectedImportance, setSelectedImportance] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Temporary state for the modal
  const [tempSelectedClass, setTempSelectedClass] = useState<'All' | '11th' | '12th'>('All');
  const [tempSelectedImportance, setTempSelectedImportance] = useState<string[]>([]);

  // Sync temp state when modal opens
  useEffect(() => {
    if (showFilterModal) {
      setTempSelectedClass(selectedClass);
      setTempSelectedImportance(selectedImportance);
    }
  }, [showFilterModal, selectedClass, selectedImportance]);

  const examData = syllabusData['JEE Main'];

  const currentChapters = useMemo(() => {
    if (!selectedSubject) return [];
    const subjectChapters = examData[selectedSubject] || [];
    
    const importanceLevels = ['Low Output High Input', 'High Output High Input', 'Low Output Low Input', 'High Output Low Input'];
    
    return subjectChapters.map((chapterName, index) => {
      const classLevel = index % 2 === 0 ? '11th' : '12th';
      const importanceLevel = importanceLevels[index % 4];
      const attempted = Math.floor(Math.random() * 5); // 0 to 4
      const total = 9;
      
      return {
        id: `c${index}`,
        name: chapterName,
        class: classLevel,
        importance: importanceLevel,
        attempted,
        total
      };
    });
  }, [selectedSubject, examData]);

  const renderSubjectSelection = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="px-6 py-6 pt-10 sticky top-0 z-40 border-b border-slate-200/60 dark:border-white/5 shadow-sm backdrop-blur-xl bg-slate-50/80 dark:bg-slate-900/80">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            Solve DPPs
          </h1>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-800 p-6 mb-8 text-center shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <p className="relative z-10 text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed tracking-wide">
            <span className="text-slate-900 dark:text-white font-bold tracking-tight">Structured Daily Practice</span><br/>700+ curated problems by expert educators.
          </p>
        </div>

        <div className="space-y-4">
          {(Object.keys(examData) as SubjectType[]).map(subject => {
            const style = subjectStyles[subject as keyof typeof subjectStyles];
            const Icon = style?.icon || Atom;
            
            // Default chaptersCount to actual data if available, but hardcode the ones requested
            let chaptersCount = examData[subject as keyof typeof examData]?.length || 0;
            if (subject === 'Physics') chaptersCount = 26;
            if (subject === 'Chemistry') chaptersCount = 28;
            if (subject === 'Mathematics') chaptersCount = 22;

            return (
              <motion.div
                key={subject}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubject(subject)}
                className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-800 cursor-pointer flex items-stretch min-h-[120px] group transition-all duration-300 hover:shadow-xl hover:border-white/10 shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${style.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="flex-1 p-6 z-10 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2 text-white/90">
                    {subject} <ChevronRight size={20} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-slate-500" />
                  </h2>
                  <div className="flex items-center gap-2">
                     <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                     <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">{chaptersCount} Modules</p>
                  </div>
                </div>
                <div className={`w-32 bg-slate-900/50 relative overflow-hidden flex items-center justify-center border-l border-white/5`}>
                  <div className={`w-14 h-14 rounded-[1.25rem] bg-slate-800 border border-white/5 flex items-center justify-center ${style.color} shadow-sm relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderChapterSelection = () => {
    const style = subjectStyles[selectedSubject as keyof typeof subjectStyles];
    const Icon = style?.icon || Atom;

    const filteredChapters = currentChapters.filter(c => {
      const classMatch = selectedClass === 'All' || c.class === selectedClass;
      const importanceMatch = selectedImportance.length === 0 || selectedImportance.includes(c.importance);
      return classMatch && importanceMatch;
    });

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col relative overflow-hidden pb-12 transition-colors duration-200">
        {/* Superior Background Accent */}
        <div className={`absolute top-0 left-0 w-full h-80 ${style?.bg || 'bg-slate-800'} opacity-30 blur-[120px] pointer-events-none`} />

        {/* Header */}
        <div className="px-6 py-6 pt-10 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedSubject(null)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <div className={`w-12 h-12 rounded-[1rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 ${style?.color || 'text-slate-900 dark:text-white'} flex items-center justify-center shadow-sm`}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all focus:ring-2 focus:ring-brand focus:outline-none">
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{selectedSubject}</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{currentChapters.length} Modules • 8 Completed</p>
            </div>
          </div>
        </div>

        {/* Filters Carousel */}
        <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar relative z-10 border-b border-white/5 bg-slate-900/30 backdrop-blur-sm">
          <button 
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-slate-800 text-xs font-semibold whitespace-nowrap shadow-sm hover:border-white/10 transition-all relative text-slate-300"
          >
            {selectedImportance.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full border-2 border-slate-900" />
            )}
            <SlidersHorizontal size={14} strokeWidth={2.5} /> Filter
          </button>
          {['All', 'Class 11', 'Class 12'].map(cls => {
            const val = cls === 'All' ? 'All' : (cls === 'Class 11' ? '11th' : '12th');
            const isActive = selectedClass === val;
            return (
              <button
                key={cls}
                onClick={() => {
                  if (isActive) {
                    setSelectedClass('All');
                  } else {
                    setSelectedClass(val as any);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isActive 
                    ? 'bg-brand text-white border-brand' 
                    : 'border-white/5 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cls}
              </button>
            );
          })}
        </div>

        {/* Sort Bar */}
        <div className="px-6 py-5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="bg-slate-800 px-3 py-1 rounded inline-flex border border-white/5">
               <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                 {selectedClass === 'All' ? 'Combined Chapters' : `${selectedClass} Chapters`} ({filteredChapters.length})
               </span>
            </span>
            <button className="flex items-center gap-1.5 text-[11px] text-brand font-semibold uppercase tracking-wider hover:text-brand-light transition-colors bg-brand/10 px-2 py-1 rounded">
              <ArrowUpDown size={12} strokeWidth={2.5} /> Sort
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 relative z-10 custom-scrollbar">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-[2rem] border border-dashed border-white/10 shadow-sm">
              <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                 <Search size={24} className="text-slate-500" />
              </div>
              <p className="font-semibold text-lg text-white mb-1">No modules found</p>
              <p className="text-sm text-slate-400 mb-6 px-8">Expand your filters to see more results.</p>
              <button 
                onClick={() => {
                  setSelectedClass('All');
                  setSelectedImportance([]);
                }}
                className="px-6 py-2.5 bg-slate-800 border border-white/5 text-slate-300 font-semibold text-sm rounded-lg shadow-sm hover:bg-slate-700 hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredChapters.map((chapter, idx) => {
              const ChIcon = chapterIcons[idx % chapterIcons.length];
              const chColor = chapterColors[idx % chapterColors.length];
              
              // Determine progress background color based on attempt percentage
              const progressPercentage = (chapter.attempted / chapter.total) * 100;
              const progressColor = progressPercentage === 0 ? 'bg-slate-700' : progressPercentage === 100 ? 'bg-emerald-500' : 'bg-brand';

              return (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/app/dpp/chapter/${selectedSubject}/${chapter.id}`, { state: { chapterName: chapter.name } })}
                  className="bg-slate-800 border border-white/5 rounded-[1.5rem] p-5 cursor-pointer hover:border-white/10 hover:shadow-md transition-all group flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-4">
                      <div className={`w-12 h-12 rounded-[1rem] bg-slate-900/50 border border-white/5 flex items-center justify-center shadow-sm group-hover:bg-slate-700 transition-colors shrink-0 ${chColor}`}>
                        <ChIcon size={24} strokeWidth={1.5} />
                      </div>
                      <div className="pt-1">
                        <h3 className="font-semibold text-white/90 text-base leading-tight group-hover:text-brand transition-colors mb-2 tracking-tight">{chapter.name}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase tracking-widest">{chapter.class}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-white/5 text-slate-400 capitalize tracking-wide">{chapter.importance.toLowerCase()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900/50 text-slate-500 border border-white/5 group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all shrink-0">
                       <ChevronRight size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-xl p-3 flex flex-col gap-2 border border-white/5 mt-1">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Progress</span>
                        <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded shadow-sm border border-white/5">{chapter.attempted} <span className="opacity-50">/</span> {chapter.total}</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                       <div className={`h-full ${progressColor} rounded-full transition-all duration-700 ease-out`} style={{ width: `${progressPercentage}%` }} />
                     </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {selectedSubject ? (
        <motion.div
          key="chapter-selection"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderChapterSelection()}
        </motion.div>
      ) : (
        <motion.div
          key="subject-selection"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSubjectSelection()}
        </motion.div>
      )}
    </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilterModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Apply filters</h3>
                <button 
                  onClick={() => {
                    setTempSelectedClass('All');
                    setTempSelectedImportance([]);
                  }}
                  className="text-red-400 font-medium hover:text-red-300 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {/* Class Filter */}
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Class</h4>
                  <div className="flex flex-col gap-4">
                    {['All', 'Class 11', 'Class 12'].map(cls => {
                      const val = cls === 'All' ? 'All' : (cls === 'Class 11' ? '11th' : '12th');
                      return (
                        <label key={cls} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tempSelectedClass === val ? 'border-blue-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                            {tempSelectedClass === val && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                          </div>
                          <span className="text-slate-200 font-medium">{cls}</span>
                          <input 
                            type="radio" 
                            name="class-filter" 
                            className="hidden" 
                            checked={tempSelectedClass === val}
                            onChange={() => {}}
                            onClick={() => {
                              if (tempSelectedClass === val) {
                                setTempSelectedClass('All');
                              } else {
                                setTempSelectedClass(val as any);
                              }
                            }}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Importance Filter */}
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Importance</h4>
                  <div className="flex flex-col gap-4">
                    {['Low Output High Input', 'High Output High Input', 'Low Output Low Input', 'High Output Low Input'].map(imp => (
                      <label key={imp} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${tempSelectedImportance.includes(imp) ? 'bg-blue-500 border-blue-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                          {tempSelectedImportance.includes(imp) && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-slate-200 font-medium">{imp}</span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={tempSelectedImportance.includes(imp)}
                          onChange={() => {
                            setTempSelectedImportance(prev => 
                              prev.includes(imp) ? prev.filter(i => i !== imp) : [...prev, imp]
                            );
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSelectedClass(tempSelectedClass);
                    setSelectedImportance(tempSelectedImportance);
                    setShowFilterModal(false);
                  }}
                  className="flex-1 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Apply filter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
