import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, BarChart2, Clock, FileText, GraduationCap, Calendar, User, Lock, AlertCircle } from 'lucide-react';
import { CustomTest } from './types';

interface ClassTestListProps {
  onBack: () => void;
  onAttemptTest: (test: CustomTest) => void;
  onViewAnalysis: (test: CustomTest) => void;
}

interface ClassTest extends CustomTest {
  teacherName: string;
  dueDate: string;
  scheduledFor?: string;
  isLocked: boolean;
  isMissed?: boolean;
}

const mockClassTests: ClassTest[] = [
  {
    id: 'ct-1',
    name: 'Weekly Mechanics Test',
    exam: 'JEE Main',
    subjects: ['Physics'],
    chapters: ['Kinematics', 'Laws of Motion'],
    questionCount: 30,
    duration: 60,
    createdAt: new Date().toISOString(),
    status: 'Not Attempted',
    yearFilter: 'all',
    teacherName: 'Dr. HC Verma',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // Due in 2 days
    isLocked: false,
  },
  {
    id: 'ct-4',
    name: 'Advanced Electromagnetism',
    exam: 'JEE Advanced',
    subjects: ['Physics'],
    chapters: ['Electrostatics', 'Current Electricity'],
    questionCount: 20,
    duration: 90,
    createdAt: new Date().toISOString(),
    status: 'Not Attempted',
    yearFilter: 'all',
    teacherName: 'Prof. Alakh Pandey',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    scheduledFor: new Date(Date.now() + 86400000 * 1).toISOString(), // Starts in 1 day
    isLocked: true,
  },
  {
    id: 'ct-2',
    name: 'Organic Chemistry - Phase 1',
    exam: 'NEET',
    subjects: ['Chemistry'],
    chapters: ['Organic Chemistry Basics', 'Hydrocarbons'],
    questionCount: 45,
    duration: 60,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'Attempted',
    score: 135,
    totalMarks: 180,
    yearFilter: 'all',
    teacherName: 'Vineet Khatri',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    isLocked: false,
  },
  {
    id: 'ct-3',
    name: 'Calculus Revision Test',
    exam: 'JEE Main',
    subjects: ['Mathematics'],
    chapters: ['Continuity and Differentiability', 'Application of Derivatives'],
    questionCount: 25,
    duration: 45,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'Not Attempted',
    yearFilter: 'all',
    teacherName: 'Arvind Academy',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Missed
    isLocked: true,
    isMissed: true,
  }
];

const ClassTestList: React.FC<ClassTestListProps> = ({ onBack, onAttemptTest, onViewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Attempted' | 'Missed'>('Upcoming');

  const filteredTests = mockClassTests.filter(test => {
    if (activeTab === 'Upcoming') return test.status === 'Not Attempted' && !test.isMissed;
    if (activeTab === 'Attempted') return test.status === 'Attempted';
    if (activeTab === 'Missed') return test.isMissed;
    return true;
  });

  const getStatusColor = (test: ClassTest) => {
    if (test.status === 'Attempted') return 'emerald';
    if (test.isMissed) return 'rose';
    if (test.isLocked) return 'slate';
    return 'purple';
  };

  const getRelativeTime = (dateStr: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
    
    if (daysDifference === 0) return 'Today';
    if (daysDifference === 1) return 'Tomorrow';
    if (daysDifference === -1) return 'Yesterday';
    return rtf.format(daysDifference, 'day');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-32 font-sans relative overflow-hidden">
      {/* Superior Background Accent */}
      <div className="absolute top-0 left-0 w-full h-80 bg-purple-100 opacity-40 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-6 pt-10 sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-200/60 shadow-sm relative">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-3 text-2xl font-bold font-serif text-slate-800">
            <div className="w-10 h-10 rounded-[1rem] bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm">
              <GraduationCap className="text-purple-600" size={20} strokeWidth={2} />
            </div>
            <h1>Class Tests</h1>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest pl-[52px]">
            <span className="text-purple-600 font-bold">{mockClassTests.filter(t => !t.isMissed && t.status !== 'Attempted').length}</span> Active Assignments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 shadow-inner">
          {['Upcoming', 'Attempted', 'Missed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <span className="relative z-10 uppercase tracking-widest">{tab}</span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="active-tab" 
                  className="absolute inset-0 border border-slate-200 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 mt-6 space-y-5 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => {
              const colorTheme = getStatusColor(test);
              const colorConfig: Record<string, string> = {
                purple: 'bg-purple-50 text-purple-600 border-purple-200',
                emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                rose: 'bg-rose-50 text-rose-600 border-rose-200',
                slate: 'bg-slate-100 text-slate-500 border-slate-200',
              };

              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-[2rem] border relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group ${
                    test.isLocked && !test.isMissed ? 'opacity-80' : ''
                  } ${test.status === 'Attempted' ? 'border-emerald-200' : test.isMissed ? 'border-rose-200' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className={`absolute -right-16 -top-16 w-40 h-40 rounded-full blur-3xl opacity-30 ${
                    colorTheme === 'purple' ? 'bg-purple-300' : 
                    colorTheme === 'emerald' ? 'bg-emerald-300' : 
                    colorTheme === 'rose' ? 'bg-rose-300' : 'bg-slate-300'
                  }`} />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase tracking-widest border ${colorConfig[colorTheme]}`}>
                              {test.exam}
                            </span>
                            {test.isLocked && !test.isMissed && (
                              <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                                <Lock size={10} strokeWidth={2.5} /> Locked
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold tracking-tight text-slate-800 leading-snug mb-2 pr-6 group-hover:text-purple-700 transition-colors">{test.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            <User size={12} strokeWidth={2.5} className="text-slate-400" />
                            <span className="text-slate-600">{test.teacherName}</span>
                          </div>
                        </div>
                        
                        {test.status === 'Attempted' ? (
                          <div className="text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm shrink-0">
                            <div className="text-lg font-black text-emerald-600">{test.score}</div>
                            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">/ {test.totalMarks}</div>
                          </div>
                        ) : (
                          <div className={`text-right text-[10px] font-bold px-3 py-2 rounded-xl border shadow-sm shrink-0 ${
                            test.isMissed ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            <div className="uppercase tracking-widest mb-1 opacity-70">{test.isMissed ? 'Missed' : 'Due'}</div>
                            <div className="flex items-center gap-1.5 text-xs">
                              {test.isMissed ? <AlertCircle size={14} strokeWidth={2.5} /> : <Calendar size={14} strokeWidth={2.5} />}
                              {getRelativeTime(test.dueDate)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-6 text-xs text-slate-600 font-semibold bg-slate-50 p-3.5 rounded-[1rem] border border-slate-100">
                        <div className="flex items-center gap-2 flex-1">
                          <FileText size={16} strokeWidth={2} className={colorTheme === 'purple' ? 'text-purple-500' : 'text-slate-400'} />
                          {test.questionCount} Qs
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-2 flex-1 justify-center">
                          <Clock size={16} strokeWidth={2} className={colorTheme === 'purple' ? 'text-purple-500' : 'text-slate-400'} />
                          {test.duration}m
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <BookOpen size={16} strokeWidth={2} className={colorTheme === 'purple' ? 'text-purple-500' : 'text-slate-400'} />
                          {test.subjects[0]}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      {test.status === 'Attempted' ? (
                        <>
                          <button 
                            onClick={() => onViewAnalysis(test)}
                            className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
                          >
                            <BarChart2 size={18} strokeWidth={2.5} />
                            Analysis
                          </button>
                          <button 
                            onClick={() => onAttemptTest(test)}
                            className="flex-1 py-3.5 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-xl border border-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all"
                          >
                            <Play size={18} strokeWidth={2.5} className="fill-current" />
                            Retake
                          </button>
                        </>
                      ) : test.isMissed ? (
                        <button 
                          disabled
                          className="w-full py-3.5 bg-rose-50 text-rose-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-rose-100 cursor-not-allowed"
                        >
                          <Lock size={18} strokeWidth={2.5} />
                          Deadline Passed
                        </button>
                      ) : test.isLocked ? (
                        <button 
                          disabled
                          className="w-full py-3.5 bg-slate-50 text-slate-500 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed shadow-sm"
                        >
                          <Clock size={18} strokeWidth={2.5} />
                          Starts {getRelativeTime(test.scheduledFor || '')}
                        </button>
                      ) : (
                        <button 
                          onClick={() => onAttemptTest(test)}
                          className="w-full py-3.5 bg-purple-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-md active:scale-[0.98] relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                          <span className="relative z-10 flex items-center gap-2">
                            <Play size={18} strokeWidth={2.5} fill="white" />
                            Start Assignment
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center px-4"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200 relative">
                {activeTab === 'Upcoming' ? <Calendar size={40} strokeWidth={1.5} className="text-purple-400" /> : 
                 activeTab === 'Attempted' ? <BarChart2 size={40} strokeWidth={1.5} className="text-emerald-400" /> :
                 <AlertCircle size={40} strokeWidth={1.5} className="text-slate-400" />}
                
                <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-slate-100 text-slate-500 text-xs font-bold shadow-sm">
                  0
                </div>
              </div>
              <h3 className="text-2xl font-semibold font-serif text-slate-800 mb-2">
                {activeTab === 'Upcoming' ? 'You are all caught up!' : 
                 activeTab === 'Attempted' ? 'No tests attempted yet' :
                 'No missed tests'}
              </h3>
              <p className="text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                {activeTab === 'Upcoming' ? 'Awesome job! You completely cleared your class test backlog. Take a break.' : 
                 activeTab === 'Attempted' ? 'When you finish assigned tests, your performance reports will appear here.' :
                 'Great consistency! You have not missed any deadlines assigned by your teachers.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// Quick helper icon for BookOpen since it was missing from imports in previous iteration
const BookOpen = ({ size, className, strokeWidth = 2 }: { size: number, className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

export default ClassTestList;
