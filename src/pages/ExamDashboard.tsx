import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Filter, ChevronDown, ArrowUpDown, ChevronRight, 
  Edit2, CheckCircle2, Bookmark, BarChart2, AlertCircle,
  BookOpen, Target, Clock, FileText, Video, LayoutGrid, BookMarked,
  History, ListOrdered, Check, FileEdit, AlertTriangle, Home, SlidersHorizontal, X,
  Asterisk, List, CheckSquare, Calendar, Minus, Calculator, PenTool, Activity
} from 'lucide-react';
import { syllabusData } from '../data/syllabus';
import { ExamType, SubjectType } from '../components/TestEngine/types';
import { useUser } from '../context/UserContext';
import AnalysisDashboard from './AnalysisDashboard';
import { notebookDB } from '../utils/notebookDB';
import Scratchpad from '../components/Scratchpad';

// Functional data based on selected PYQ year
const pyqData: Record<string, Record<string, { solved: number, total: number }>> = {
  'Last 1 Year': {
    'Physics': { solved: 717, total: 1925 },
    'Chemistry': { solved: 876, total: 2096 },
    'Mathematics': { solved: 693, total: 1667 },
    'Biology': { solved: 850, total: 2200 },
    'English Proficiency': { solved: 120, total: 300 },
    'Logical Reasoning': { solved: 150, total: 400 },
    'General Ability Test': { solved: 200, total: 500 },
  },
  'Last 3 Years': {
    'Physics': { solved: 1500, total: 3500 },
    'Chemistry': { solved: 1800, total: 4000 },
    'Mathematics': { solved: 1400, total: 3000 },
    'Biology': { solved: 2000, total: 4500 },
    'English Proficiency': { solved: 300, total: 800 },
    'Logical Reasoning': { solved: 400, total: 1000 },
    'General Ability Test': { solved: 500, total: 1200 },
  },
  'Last 5 Years': {
    'Physics': { solved: 2500, total: 5500 },
    'Chemistry': { solved: 2800, total: 6000 },
    'Mathematics': { solved: 2400, total: 5000 },
    'Biology': { solved: 3500, total: 7000 },
    'English Proficiency': { solved: 500, total: 1500 },
    'Logical Reasoning': { solved: 700, total: 1800 },
    'General Ability Test': { solved: 900, total: 2000 },
  },
  'All PYQ': {
    'Physics': { solved: 4500, total: 8500 },
    'Chemistry': { solved: 4800, total: 9000 },
    'Mathematics': { solved: 4400, total: 8000 },
    'Biology': { solved: 6000, total: 12000 },
    'English Proficiency': { solved: 1000, total: 2500 },
    'Logical Reasoning': { solved: 1200, total: 3000 },
    'General Ability Test': { solved: 1500, total: 4000 },
  }
};

export default function ExamDashboard() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { setPointsEarned, setCurrentQs } = useUser();
  
  // Find the matching exam type from syllabusData
  const examKey = useMemo(() => {
    if (!examId) return 'JEE Main' as ExamType;
    const normalizedId = examId.toLowerCase().replace(/-/g, '');
    const found = Object.keys(syllabusData).find(
      key => key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedId
    );
    return (found as ExamType) || 'JEE Main';
  }, [examId]);

  const examData = syllabusData[examKey];
  const availableSubjects = Object.keys(examData) as SubjectType[];
  
  const [pyqYear, setPyqYear] = useState<string>('Last 1 Year');
  const [showPyqDropdown, setShowPyqDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'chapter-detail' | 'all-questions' | 'analysis' | 'bookmarks' | 'mistakes' | 'filters'>('dashboard');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Filter States
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  
  // Temp Chapter Filter States
  const [tempSelectedClass, setTempSelectedClass] = useState<string | null>(null);
  const [tempSelectedUnit, setTempSelectedUnit] = useState<string | null>(null);
  const [tempSortOrder, setTempSortOrder] = useState<string>('default');

  const [showClassModal, setShowClassModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    if (showFilterModal) {
      setTempSelectedClass(selectedClass);
      setTempSelectedUnit(selectedUnit);
      setTempSortOrder(sortOrder);
    }
  }, [showFilterModal, selectedClass, selectedUnit, sortOrder]);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  
  // PYQ Filter States
  const [showPyqFilterModal, setShowPyqFilterModal] = useState(false);
  const [activePyqFilterTab, setActivePyqFilterTab] = useState<'Sort By' | 'Exam' | 'Difficulty' | 'Question Type' | 'Evaluation Status' | 'Years'>('Sort By');
  const [pyqSortBy, setPyqSortBy] = useState<string>('Default');
  const [hideOutOfSyllabus, setHideOutOfSyllabus] = useState(false);
  const [showOnlyOutOfSyllabus, setShowOnlyOutOfSyllabus] = useState(false);
  const [pyqDifficulty, setPyqDifficulty] = useState<string[]>([]);
  const [pyqQuestionType, setPyqQuestionType] = useState<string[]>([]);
  const [pyqEvaluationStatus, setPyqEvaluationStatus] = useState<string[]>([]);
  const [pyqYears, setPyqYears] = useState<string[]>([]);
  const [pyqExam, setPyqExam] = useState<string>('All');
  
  // Temp PYQ Filter States
  const [tempPyqSortBy, setTempPyqSortBy] = useState<string>('Default');
  const [tempHideOutOfSyllabus, setTempHideOutOfSyllabus] = useState(false);
  const [tempShowOnlyOutOfSyllabus, setTempShowOnlyOutOfSyllabus] = useState(false);
  const [tempPyqDifficulty, setTempPyqDifficulty] = useState<string[]>([]);
  const [tempPyqQuestionType, setTempPyqQuestionType] = useState<string[]>([]);
  const [tempPyqEvaluationStatus, setTempPyqEvaluationStatus] = useState<string[]>([]);
  const [tempPyqYears, setTempPyqYears] = useState<string[]>([]);
  const [tempPyqExam, setTempPyqExam] = useState<string>('All');

  useEffect(() => {
    if (showPyqFilterModal) {
      setTempPyqSortBy(pyqSortBy);
      setTempHideOutOfSyllabus(hideOutOfSyllabus);
      setTempShowOnlyOutOfSyllabus(showOnlyOutOfSyllabus);
      setTempPyqDifficulty(pyqDifficulty);
      setTempPyqQuestionType(pyqQuestionType);
      setTempPyqEvaluationStatus(pyqEvaluationStatus);
      setTempPyqYears(pyqYears);
      setTempPyqExam(pyqExam);
    }
  }, [showPyqFilterModal, pyqSortBy, hideOutOfSyllabus, showOnlyOutOfSyllabus, pyqDifficulty, pyqQuestionType, pyqEvaluationStatus, pyqYears, pyqExam]);
  
  // Target Countdown State
  const [targetDate, setTargetDate] = useState<string>(() => {
    return localStorage.getItem(`exam_target_date_${examKey}`) || '2026-04-02';
  });
  const [targetExamName, setTargetExamName] = useState<string>(() => {
    return localStorage.getItem(`exam_target_name_${examKey}`) || `${examKey} 2026`;
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editTargetDate, setEditTargetDate] = useState(targetDate);
  const [editTargetName, setEditTargetName] = useState(targetExamName);
  const [daysLeft, setDaysLeft] = useState(0);
  
  // Interactive state for questions
  const [bookmarkedQs, setBookmarkedQs] = useState<Record<number, boolean>>({});
  const [savedToNotebook, setSavedToNotebook] = useState<Record<number, boolean>>({});
  const { user } = useUser();

  const handleSaveToNotebook = (index: number) => {
    if (savedToNotebook[index]) return;

    notebookDB.addNote({
      email: user?.email || 'student@example.com',
      subject: activeTab !== 'Home' ? activeTab : 'General',
      chapter: activeChapter?.name || 'PYQ',
      title: `PYQ: Q${index + 1}`,
      content: `Question:\nA block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?\n\nCorrect Answer: g tan θ\n\nSolution:\nFor the block to not slip, the pseudo force (ma) must balance the component of weight along the incline.\nma cos θ = mg sin θ\na = g tan θ`
    });

    setSavedToNotebook(prev => ({ ...prev, [index]: true }));
  };

  // Generate mock chapters based on the real syllabus data for the active subject
  const currentChapters = useMemo(() => {
    if (activeTab === 'Home') return [];
    const subjectChapters = examData[activeTab as SubjectType] || [];
    
    const subjectData = pyqData[pyqYear]?.[activeTab] || { solved: 0, total: 0 };
    const numChapters = subjectChapters.length;
    
    // Distribute questions roughly evenly among chapters
    const baseTotalQs = Math.floor(subjectData.total / numChapters);
    const baseSolvedQs = Math.floor(subjectData.solved / numChapters);
    
    let remainingTotal = subjectData.total - (baseTotalQs * numChapters);
    let remainingSolved = subjectData.solved - (baseSolvedQs * numChapters);

    return subjectChapters.map((chapterName, index) => {
      const classLevel = index % 2 === 0 ? '11th' : '12th';
      const unitNum = (index % 5) + 1;
      
      let totalQs = baseTotalQs;
      if (remainingTotal > 0) {
        totalQs++;
        remainingTotal--;
      }
      
      let solvedQs = baseSolvedQs;
      if (remainingSolved > 0) {
        solvedQs++;
        remainingSolved--;
      }
      
      const correctQs = Math.floor(solvedQs * (0.4 + (index % 5) * 0.1)); // Random accuracy between 40% and 80%
      const accuracy = solvedQs > 0 ? ((correctQs / solvedQs) * 100).toFixed(2) : '0.00';
      
      const beginnerQs = Math.floor(totalQs * 0.3);
      const targetMainQs = Math.floor(totalQs * 0.5);
      const advanceQs = totalQs - beginnerQs - targetMainQs;
      const mustDoQs = Math.floor(totalQs * 0.4);

      return {
        id: `c${index}`,
        name: chapterName,
        totalQs,
        solvedQs,
        correctQs,
        accuracy,
        beginnerQs,
        targetMainQs,
        advanceQs,
        mustDoQs,
        trend: { year: 2025, count: 10 + (index % 10), up: index % 2 === 0 },
        class: classLevel,
        unit: `Unit ${unitNum}`
      };
    });
  }, [activeTab, examData, pyqYear]);

  const filteredAndSortedChapters = useMemo(() => {
    let result = [...currentChapters];
    
    if (selectedClass) {
      result = result.filter(c => c.class === selectedClass);
    }
    
    if (selectedUnit) {
      result = result.filter(c => c.unit === selectedUnit);
    }
    
    if (sortOrder === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'qs-high') {
      result.sort((a, b) => b.totalQs - a.totalQs);
    } else if (sortOrder === 'qs-low') {
      result.sort((a, b) => a.totalQs - b.totalQs);
    }
    
    return result;
  }, [currentChapters, selectedClass, selectedUnit, sortOrder]);

  useEffect(() => {
    const target = new Date(targetDate + 'T00:00:00');
    const diff = target.getTime() - new Date().getTime();
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, [targetDate]);

  const handleSaveTarget = () => {
    setTargetDate(editTargetDate);
    setTargetExamName(editTargetName);
    localStorage.setItem(`exam_target_date_${examKey}`, editTargetDate);
    localStorage.setItem(`exam_target_name_${examKey}`, editTargetName);
    setIsEditingTarget(false);
  };

  const formattedTargetDate = useMemo(() => {
    return new Date(targetDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [targetDate]);

  const renderDashboard = () => {
    // Calculate overall progress
    let totalSolved = 0;
    let totalQs = 0;
    const subjectProgress: Record<string, { solved: number, total: number }> = {};

    availableSubjects.forEach(subject => {
      const data = pyqData[pyqYear]?.[subject as string] || { solved: 0, total: 0 };
      subjectProgress[subject] = data;
      totalSolved += data.solved;
      totalQs += data.total;
    });

    const overallProgress = totalQs > 0 ? ((totalSolved / totalQs) * 100).toFixed(2) : '0.00';

    return (
    <div className="space-y-6 pb-24">
      {/* Progress Card */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-7 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="absolute top-0 right-0 p-5 z-10">
          <div className="relative">
            <button 
              onClick={() => setShowPyqDropdown(!showPyqDropdown)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:text-white hover:bg-black/30 hover:border-white/20 transition-all shadow-lg"
            >
              {pyqYear} PYQ <ChevronDown size={14} className={`transition-transform duration-300 ${showPyqDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showPyqDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-3 w-44 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  {Object.keys(pyqData).map(year => (
                    <button
                      key={year}
                      onClick={() => {
                        setPyqYear(year);
                        setShowPyqDropdown(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm font-bold transition-all ${
                        pyqYear === year ? 'bg-brand/20 text-brand border-l-2 border-brand' : 'text-slate-300 hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="mb-8 relative z-10">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity size={14} className="text-brand" /> Overall Progress
          </p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{overallProgress}%</span>
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${overallProgress}%` }} 
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand to-cyan-400 rounded-full relative" 
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-5 relative z-10">
          {availableSubjects.map((subject, index) => {
            const colors = [
              { text: 'text-orange-400', bg: 'from-orange-400 to-orange-600', dot: 'bg-orange-400' },
              { text: 'text-emerald-400', bg: 'from-emerald-400 to-emerald-600', dot: 'bg-emerald-400' },
              { text: 'text-blue-400', bg: 'from-blue-400 to-blue-600', dot: 'bg-blue-400' },
              { text: 'text-purple-400', bg: 'from-purple-400 to-purple-600', dot: 'bg-purple-400' },
              { text: 'text-rose-400', bg: 'from-rose-400 to-rose-600', dot: 'bg-rose-400' }
            ];
            const color = colors[index % colors.length];
            const progress = subjectProgress[subject];
            const percentage = progress.total > 0 ? (progress.solved / progress.total) * 100 : 0;
            return (
              <div key={subject} className="space-y-2.5">
                <div className="flex justify-between items-center text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color.dot} shadow-[0_0_8px_currentColor]`} />
                    <span className="text-slate-200">{subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white bg-white/10 px-2 py-0.5 rounded-md text-xs border border-white/5">{progress.solved} <span className="text-slate-400 font-medium">/ {progress.total}</span></span>
                    <span className={`${color.text} w-10 text-right`}>{percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${percentage}%` }} 
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${color.bg} rounded-full`} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setView('analysis')}
          className="w-full mt-8 py-4 bg-gradient-to-r from-brand/10 to-blue-500/10 hover:from-brand/20 hover:to-blue-500/20 border border-brand/20 hover:border-brand/40 text-brand text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group relative z-10 shadow-lg shadow-brand/10"
        >
          View Detailed Analysis 
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Countdown Card */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex items-center justify-between shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <div>
          <h3 className="text-xl font-black text-white mb-2 tracking-tight">{targetExamName}</h3>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
            <Calendar size={14} className="text-brand" />
            {formattedTargetDate}
            <button 
              onClick={() => setIsEditingTarget(true)}
              className="ml-1 p-1 hover:bg-brand/20 rounded text-brand transition-colors"
            >
              <Edit2 size={12} />
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-brand to-cyan-500 p-0.5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <div className="bg-slate-900 px-5 py-4 rounded-[14px] flex flex-col items-center justify-center min-w-[5rem]">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 leading-none mb-1">{daysLeft}</div>
            <div className="text-[9px] font-black text-brand uppercase tracking-widest">Days Left</div>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => setView('analysis')}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/80 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-blue-500/20">
            <BarChart2 size={24} />
          </div>
          <span className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors">Analysis</span>
        </button>
        <button 
          onClick={() => setView('bookmarks')}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/80 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-emerald-500/20">
            <Bookmark size={24} />
          </div>
          <span className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors">Bookmarks</span>
        </button>
        <button 
          onClick={() => setView('mistakes')}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/80 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-rose-500/20">
            <AlertCircle size={24} />
          </div>
          <span className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors">Mistakes</span>
        </button>
      </div>
    </div>
    );
  };

  const renderSubjectContent = () => (
    <div className="space-y-4 pb-24">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap hover:bg-slate-700 hover:text-white transition-all shadow-sm"
        >
          <Filter size={16} /> Filter
        </button>
        <button 
          onClick={() => setShowClassModal(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${selectedClass ? 'bg-brand/10 border-brand text-brand' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        >
          {selectedClass || 'Class'} <ChevronDown size={16} />
        </button>
        <button 
          onClick={() => setShowUnitModal(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${selectedUnit ? 'bg-brand/10 border-brand text-brand' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        >
          {selectedUnit || `${activeTab} Units`} <ChevronDown size={16} />
        </button>
        <button 
          onClick={() => setShowSortModal(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${sortOrder !== 'default' ? 'bg-brand/10 border-brand text-brand' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        >
          <ArrowUpDown size={16} /> Sort
        </button>
      </div>

      <div className="flex items-center justify-between mb-4 mt-2">
        <p className="text-sm font-bold text-slate-400">Showing chapters ({filteredAndSortedChapters.length}/{currentChapters.length})</p>
      </div>

      <div className="space-y-4">
        {filteredAndSortedChapters.map((chapter, i) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group"
          >
            <button
              onClick={() => { setActiveChapter(chapter); setView('chapter-detail'); }}
              className="w-full bg-slate-800/40 backdrop-blur-md p-5 rounded-[1.5rem] border border-slate-700/50 flex flex-col gap-3 text-left hover:bg-slate-800/80 hover:border-slate-600 transition-all shadow-sm relative overflow-hidden"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between gap-4 w-full">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-base leading-tight mb-2 group-hover:text-brand transition-colors">{chapter.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-300 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                      {chapter.solvedQs}<span className="text-slate-500">/{chapter.totalQs} Qs</span>
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-opacity-10 ${chapter.trend.up ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-400 bg-slate-800 border border-slate-700'}`}>
                      {chapter.trend.year}: {chapter.trend.count} Qs {chapter.trend.up ? <ArrowUpDown size={10} className="transform -rotate-45" /> : ''}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/50 group-hover:bg-brand group-hover:border-brand transition-all text-slate-400 group-hover:text-white shadow-inner">
                  <ChevronRight size={20} />
                </div>
              </div>
              
              {/* Progress Bar inside Chapter Card */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1 border border-white/5">
                <div 
                  className={`h-full rounded-full ${
                    activeTab === 'Physics' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    activeTab === 'Chemistry' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                    activeTab === 'Biology' ? 'bg-gradient-to-r from-rose-400 to-rose-500' :
                    'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                  style={{ width: `${(chapter.solvedQs / chapter.totalQs) * 100}%` }}
                />
              </div>
            </button>
          </motion.div>
        ))}
        {filteredAndSortedChapters.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No chapters match the selected filters.</p>
            <button 
              onClick={() => { setSelectedClass(null); setSelectedUnit(null); setSortOrder('default'); }}
              className="mt-4 text-brand font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderChapterDetail = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6 sticky top-0 bg-[#0F172A]/90 backdrop-blur-xl z-40 py-4 border-b border-white/5 shadow-sm px-2">
        <button onClick={() => setView('dashboard')} className="p-2.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center border border-transparent hover:border-white/5">
          <ArrowLeft size={24} className="text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight leading-tight">{activeChapter.name}</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
            {examKey} <span className="text-brand">»</span> {activeChapter.totalQs} PYQs <span className="w-1 h-1 bg-slate-600 rounded-full" /> 2 Topics
          </p>
        </div>
      </header>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-7 rounded-[2rem] border border-white/10 grid grid-cols-3 gap-6 text-center shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 mb-2 leading-none drop-shadow-md">{activeChapter.solvedQs}<span className="text-lg text-slate-500">/{activeChapter.totalQs}</span></div>
          <div className="text-[9px] font-black text-brand uppercase tracking-widest bg-brand/10 px-2 py-1 rounded-md border border-brand/20">PYQ Solved</div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center border-l border-r border-white/5 px-4">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 mb-2 leading-none drop-shadow-md">{activeChapter.correctQs}<span className="text-lg text-emerald-500/50">/{activeChapter.solvedQs}</span></div>
          <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Correct Qs</div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand to-cyan-400 mb-2 leading-none drop-shadow-md">{activeChapter.accuracy}%</div>
          <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">Accuracy</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => { setActiveFilter(null); setView('all-questions'); }}
          className="p-6 bg-gradient-to-br from-brand to-blue-600 text-white rounded-[2rem] font-bold flex flex-col items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.02] hover:-rotate-1 transition-all duration-300 group border border-blue-400/30 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
          <Target size={32} className="group-hover:scale-110 transition-transform relative z-10 drop-shadow-lg" />
          <span className="text-lg tracking-wide relative z-10">Practice MCQ</span>
        </button>
        <button 
          onClick={() => { setActiveFilter('Topic Wise'); setView('all-questions'); }}
          className="p-6 bg-slate-800/80 backdrop-blur-md text-white rounded-[2rem] font-bold flex flex-col items-center justify-center gap-3 border border-slate-700 hover:bg-slate-700/80 hover:border-slate-500 hover:scale-[1.02] transition-all duration-300 shadow-xl group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          <LayoutGrid size={32} className="text-slate-400 group-hover:text-white transition-colors relative z-10" />
          <div className="flex flex-col items-center relative z-10">
             <span className="text-lg tracking-wide group-hover:text-white text-slate-200 transition-colors">Topic Wise PYQs</span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700 mt-1">2 Topics</span>
          </div>
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Difficulty Buckets</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => { setActiveFilter('Beginner'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-emerald-500 mb-1">Beginner</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.beginnerQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Target Main'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-blue-500 mb-1">Target Main</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.targetMainQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Advance Level'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-rose-500 mb-1">Advance Level</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.advanceQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Must Do'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-orange-500 mb-1">Must Do</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.mustDoQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );

  const DashboardBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${view === 'dashboard' || view === 'chapter-detail' || view === 'all-questions' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        <button 
          onClick={() => setShowCreateTestModal(true)}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative ${showCreateTestModal ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="absolute -top-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">NEW</div>
          <FileEdit size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Create Test</span>
        </button>
        <button 
          onClick={() => setView('analysis')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${view === 'analysis' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BarChart2 size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
        </button>
        <button 
          onClick={() => setView('bookmarks')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${view === 'bookmarks' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BookMarked size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bookmarks</span>
        </button>
        <button 
          onClick={() => setView('mistakes')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative ${view === 'mistakes' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="absolute -top-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">NEW</div>
          <AlertTriangle size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">My Mistakes</span>
        </button>
      </div>
    </div>
  );

  const renderAllQuestions = () => {
    const isTopicOrAll = activeFilter === 'Topic Wise' || !activeFilter;
    
    let title = 'Practice MCQ';
    let subtitle = activeChapter.name;
    let questionCount = activeChapter.totalQs;

    if (activeFilter === 'Beginner') {
      title = 'Beginner Level';
      questionCount = 23;
    } else if (activeFilter === 'Target Main') {
      title = 'Target Main';
      questionCount = 50;
    } else if (activeFilter === 'Advance Level') {
      title = 'Advance Level';
      questionCount = 12;
    } else if (activeFilter === 'Must Do') {
      title = 'Must Do';
      questionCount = 50;
    }

    if (isTopicOrAll) {
      if (selectedTopic) {
        const topicQsCount = selectedTopic === 'Units' ? Math.floor(activeChapter.totalQs * 0.3) : Math.floor(activeChapter.totalQs * 0.7);
        return (
          <div className="space-y-4 pb-24">
            <div className="space-y-6">
              <header className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-white">{selectedTopic}</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      {examKey} » {topicQsCount} PYQs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className={`p-2 rounded-xl border transition-colors ${showScratchpad ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-brand'}`}
                  title="Scratchpad"
                >
                  <PenTool size={20} />
                </button>
              </header>

              <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-4">
                <span>{topicQsCount} Questions</span>
                <button className="flex items-center gap-1 text-brand">
                  <ArrowUpDown size={14} /> New to Old
                </button>
              </div>

              {(() => {
                const mockQuestions = Array.from({ length: Math.min(10, topicQsCount) }).map((_, i) => {
                const diffs = ['Easy', 'Medium', 'Tough'];
                const types = ['Single Correct', 'Multiple Correct', 'Numerical'];
                const statuses = ['Correct', 'Incorrect', 'Partially Correct', 'Unattempted'];
                const years = ['JEE Main 2026', 'JEE Main 2025', 'JEE Main 2024', 'JEE Main 2023', 'JEE Main 2022', 'JEE Main 2021'];
                const exams = ['JEE Main', 'JEE Advanced', 'NEET', 'BITSAT'];

                return {
                  id: i,
                  difficulty: diffs[i % 3],
                  type: types[i % 3],
                  status: statuses[i % 4],
                  year: years[i % 6],
                  exam: exams[i % 4],
                  isOutOfSyllabus: i % 5 === 0,
                  lastPracticed: new Date(Date.now() - i * 86400000).getTime() // mock date
                };
              });

              let filteredQuestions = mockQuestions.filter(q => {
                if (hideOutOfSyllabus && q.isOutOfSyllabus) return false;
                if (showOnlyOutOfSyllabus && !q.isOutOfSyllabus) return false;
                if (pyqDifficulty.length > 0 && !pyqDifficulty.includes(q.difficulty)) return false;
                if (pyqQuestionType.length > 0 && !pyqQuestionType.includes(q.type)) return false;
                if (pyqEvaluationStatus.length > 0 && !pyqEvaluationStatus.includes(q.status)) return false;
                if (pyqYears.length > 0 && !pyqYears.includes(q.year)) return false;
                if (pyqExam !== 'All' && pyqExam !== q.exam) return false;
                return true;
              });

              if (pyqSortBy === 'Latest to Oldest') {
                filteredQuestions.sort((a, b) => b.year.localeCompare(a.year));
              } else if (pyqSortBy === 'Oldest to Latest') {
                filteredQuestions.sort((a, b) => a.year.localeCompare(b.year));
              }

              return (
                <>
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <p>No questions match the selected filters.</p>
                      <button 
                        onClick={() => {
                          setPyqSortBy('Default');
                          setPyqExam('All');
                          setHideOutOfSyllabus(false);
                          setShowOnlyOutOfSyllabus(false);
                          setPyqDifficulty([]);
                          setPyqQuestionType([]);
                          setPyqEvaluationStatus([]);
                          setPyqYears([]);
                        }}
                        className="mt-4 text-brand font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    filteredQuestions.map((q) => {
                      const isBookmarked = bookmarkedQs[q.id];

                      return (
                        <div 
                          key={q.id} 
                          className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                          onClick={() => navigate('/app/practice', { state: { questionIndex: q.id, source: 'chapter-wise-pyq' } })}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{q.id+1}</span>
                              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">{q.year} • {q.exam}</span>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded border ${q.difficulty === 'Easy' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : q.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>{q.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {q.id % 3 === 0 && <Video size={16} className="text-brand" />}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBookmarkedQs(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                              >
                                <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-200 leading-relaxed">
                            A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
                          </p>
                        </div>
                      );
                    })
                  )}
                </>
              );
            })()}
            </div>
            <DashboardBottomNav />
          </div>
        );
      }

      return (
        <div className="space-y-4 pb-24">
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('chapter-detail')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold">{activeChapter.name}</h1>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {examKey} » {activeChapter.totalQs} PYQs | 2 Topics
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={`p-2 rounded-xl border transition-colors ${showScratchpad ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-brand'}`}
              title="Scratchpad"
            >
              <PenTool size={20} />
            </button>
          </header>

          <div className="flex border-b border-white/10 mb-6">
            <button 
              onClick={() => { setActiveFilter(null); setSelectedTopic(null); }}
              className={`flex-1 pb-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${!activeFilter ? 'text-brand border-b-2 border-brand' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <History size={18} />
              All PYQs
            </button>
            <button 
              onClick={() => { setActiveFilter('Topic Wise'); setSelectedTopic(null); }}
              className={`flex-1 pb-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeFilter === 'Topic Wise' ? 'text-brand border-b-2 border-brand' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <ListOrdered size={18} />
              Topic-Wise PYQs
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
            <button 
              onClick={() => setShowPyqFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand bg-brand/10 text-brand text-sm font-medium whitespace-nowrap"
            >
              <SlidersHorizontal size={16} /> Filter & Sorting
            </button>
            <button 
              onClick={() => {
                setHideOutOfSyllabus(!hideOutOfSyllabus);
                if (!hideOutOfSyllabus) setShowOnlyOutOfSyllabus(false);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${hideOutOfSyllabus ? 'border-brand bg-brand/10 text-brand' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}
            >
              As per syllabus
            </button>
            <button 
              onClick={() => {
                setShowOnlyOutOfSyllabus(!showOnlyOutOfSyllabus);
                if (!showOnlyOutOfSyllabus) setHideOutOfSyllabus(false);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${showOnlyOutOfSyllabus ? 'border-brand bg-brand/10 text-brand' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}
            >
              Removed
            </button>
            <button className="px-4 py-2 rounded-full border border-white/10 text-slate-300 text-sm font-medium whitespace-nowrap hover:bg-white/5">
              Reduced
            </button>
          </div>

          {activeFilter === 'Topic Wise' ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedTopic('Units')}
                className="w-full bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-lg mb-1">Units</div>
                  <div className="text-sm text-slate-400">{Math.floor(activeChapter.totalQs * 0.3)} Questions</div>
                </div>
                <ChevronRight size={20} className="text-slate-500" />
              </button>
              
              <button 
                onClick={() => setSelectedTopic('Dimensions')}
                className="w-full bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-lg mb-1">Dimensions</div>
                  <div className="text-sm text-slate-400 flex items-center gap-3">
                    {Math.floor(activeChapter.totalQs * 0.7)} Questions
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/50 text-rose-400 bg-rose-500/10">MUST DO</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from({ length: Math.min(10, questionCount) }).map((_, i) => {
                const isBookmarked = bookmarkedQs[i];

                return (
                  <div 
                    key={i} 
                    className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/app/practice', { state: { questionIndex: i, source: 'chapter-wise-pyq' } })}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {i % 3 === 0 && <Video size={16} className="text-brand" />}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                          <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-200 leading-relaxed">
                      A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <DashboardBottomNav />
        </div>
      );
    }

    return (
    <div className="space-y-4 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('chapter-detail')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{subtitle}</p>
        </div>
      </header>

      <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-4">
        <span>{questionCount} Questions</span>
        <button className="flex items-center gap-1 text-brand">
          <ArrowUpDown size={14} /> New to Old
        </button>
      </div>

      <div className="space-y-6">
        {Array.from({ length: Math.min(10, questionCount) }).map((_, i) => {
          const isBookmarked = bookmarkedQs[i];

          return (
            <div 
              key={i} 
              className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              onClick={() => navigate('/app/practice', { state: { questionIndex: i, source: 'chapter-wise-pyq' } })}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                </div>
                <div className="flex items-center gap-3">
                  {i % 3 === 0 && <Video size={16} className="text-brand" />}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-200 leading-relaxed">
                A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
              </p>
            </div>
          );
        })}
      </div>

        <DashboardBottomNav />
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="pb-24">
      <AnalysisDashboard onBack={() => setView('dashboard')} />
      <DashboardBottomNav />
    </div>
  );

  const renderBookmarks = () => {
    const bookmarkedIndices = Object.keys(bookmarkedQs).filter(key => bookmarkedQs[Number(key)]).map(Number);
    
    return (
      <div className="space-y-6 pb-24">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Bookmarks</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Saved Questions</p>
          </div>
        </header>
        
        {bookmarkedIndices.length === 0 ? (
          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 font-bold gap-4">
              <Bookmark size={48} className="opacity-20" />
              <p>No bookmarks yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarkedIndices.map((i) => {
              const isBookmarked = bookmarkedQs[i];

              return (
                <div 
                  key={i} 
                  className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate('/app/practice', { state: { questionIndex: i, source: 'chapter-wise-pyq' } })}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {i % 3 === 0 && <Video size={16} className="text-brand" />}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                      >
                        <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-200 leading-relaxed">
                    A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <DashboardBottomNav />
      </div>
    );
  };

  const renderMistakes = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Mistakes</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Questions to review</p>
        </div>
      </header>
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-center h-40 text-slate-500 font-bold">
          Mistakes list will appear here
        </div>
      </div>
      <DashboardBottomNav />
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Filters</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Customize your view</p>
        </div>
      </header>
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-center h-40 text-slate-500 font-bold">
          Filter options will appear here
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-kanit">
      {view === 'dashboard' && (
        <>
          <header className="px-6 pt-10 pb-6 sticky top-0 bg-[#0F172A]/90 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/app')} className="p-2.5 -ml-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center border border-transparent hover:border-white/5">
                  <ArrowLeft size={24} className="text-slate-300" />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">{examKey}</h1>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    2025 - 2012 <span className="w-1 h-1 bg-slate-600 rounded-full"/> 39 Papers <span className="w-1 h-1 bg-slate-600 rounded-full"/> {
                      availableSubjects.reduce((acc, subject) => {
                        const chapters = examData[subject as SubjectType] || [];
                        return acc + chapters.reduce((subAcc, _, index) => subAcc + (50 + (index * 7) % 50), 0);
                      }, 0)
                    } Qs
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setActiveTab('Home')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  activeTab === 'Home' 
                    ? 'bg-brand border-brand text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                    : 'bg-slate-800/80 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                Home
              </button>
              {availableSubjects.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    activeTab === tab 
                      ? 'bg-brand border-brand text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-slate-800/80 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>

          <main className="px-6 mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'Home' ? renderDashboard() : renderSubjectContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}

      {view === 'chapter-detail' && (
        <main className="px-6 pt-8">
          {renderChapterDetail()}
        </main>
      )}

      {view === 'all-questions' && (
        <main className="px-6 pt-8">
          {renderAllQuestions()}
        </main>
      )}

      {view === 'analysis' && (
        <main className="px-6 pt-8">
          {renderAnalysis()}
        </main>
      )}

      {view === 'bookmarks' && (
        <main className="px-6 pt-8">
          {renderBookmarks()}
        </main>
      )}

      {view === 'mistakes' && (
        <main className="px-6 pt-8">
          {renderMistakes()}
        </main>
      )}

      {view === 'filters' && (
        <main className="px-6 pt-8">
          {renderFilters()}
        </main>
      )}

      {/* Bottom Navigation (Only inside Exam section) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
        <button onClick={() => navigate('/app/tests', { state: { initialView: 'create-list' } })} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand transition-colors">
          <FileText size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Create Test</span>
        </button>
        <button onClick={() => setView('analysis')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'analysis' ? 'text-brand' : 'text-slate-400 hover:text-brand'}`}>
          <BarChart2 size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
        </button>
        <button onClick={() => setView('bookmarks')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'bookmarks' ? 'text-brand' : 'text-slate-400 hover:text-brand'}`}>
          <Bookmark size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bookmarks</span>
        </button>
        <button onClick={() => setView('mistakes')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'mistakes' ? 'text-brand' : 'text-slate-400 hover:text-brand'}`}>
          <AlertCircle size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Mistakes</span>
        </button>
      </div>

      {/* Target Edit Modal */}
      <AnimatePresence>
        {isEditingTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Target</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Exam Name</label>
                  <input 
                    type="text" 
                    value={editTargetName}
                    onChange={(e) => setEditTargetName(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Date</label>
                  <input 
                    type="date" 
                    value={editTargetDate}
                    onChange={(e) => setEditTargetDate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTarget}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-brand hover:bg-brand-light shadow-lg shadow-brand/20 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Class Filter Modal */}
      <AnimatePresence>
        {showClassModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowClassModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Select Class</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSelectedClass(null); setShowClassModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedClass === null ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  All Classes
                </button>
                <button 
                  onClick={() => { setSelectedClass('11th'); setShowClassModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedClass === '11th' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Class 11th
                </button>
                <button 
                  onClick={() => { setSelectedClass('12th'); setShowClassModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedClass === '12th' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Class 12th
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unit Filter Modal */}
      <AnimatePresence>
        {showUnitModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowUnitModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[70vh] flex flex-col"
            >
              <h3 className="text-lg font-bold text-white mb-4">Select {activeTab} Unit</h3>
              <div className="space-y-2 overflow-y-auto pr-2">
                <button 
                  onClick={() => { setSelectedUnit(null); setShowUnitModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedUnit === null ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  All Units
                </button>
                {[1, 2, 3, 4, 5].map(unitNum => (
                  <button 
                    key={unitNum}
                    onClick={() => { setSelectedUnit(`Unit ${unitNum}`); setShowUnitModal(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedUnit === `Unit ${unitNum}` ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                  >
                    Unit {unitNum}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sort Modal */}
      <AnimatePresence>
        {showSortModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSortModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Sort Chapters</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSortOrder('default'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'default' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Default Order
                </button>
                <button 
                  onClick={() => { setSortOrder('name-asc'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'name-asc' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Name (A-Z)
                </button>
                <button 
                  onClick={() => { setSortOrder('name-desc'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'name-desc' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Name (Z-A)
                </button>
                <button 
                  onClick={() => { setSortOrder('qs-high'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'qs-high' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Questions (High to Low)
                </button>
                <button 
                  onClick={() => { setSortOrder('qs-low'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'qs-low' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Questions (Low to High)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Comprehensive Filter Modal */}
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
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button 
                  onClick={() => {
                    setTempSelectedClass(null);
                    setTempSelectedUnit(null);
                    setTempSortOrder('default');
                  }}
                  className="text-sm font-bold text-brand hover:underline"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-6 overflow-y-auto pr-2 pb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Class</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTempSelectedClass(tempSelectedClass === '11th' ? null : '11th')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors border ${tempSelectedClass === '11th' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      11th
                    </button>
                    <button 
                      onClick={() => setTempSelectedClass(tempSelectedClass === '12th' ? null : '12th')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors border ${tempSelectedClass === '12th' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      12th
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Unit</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5].map(unitNum => (
                      <button 
                        key={unitNum}
                        onClick={() => setTempSelectedUnit(tempSelectedUnit === `Unit ${unitNum}` ? null : `Unit ${unitNum}`)}
                        className={`py-2.5 rounded-xl font-bold text-sm transition-colors border ${tempSelectedUnit === `Unit ${unitNum}` ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Unit {unitNum}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Sort By</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setTempSortOrder('default')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${tempSortOrder === 'default' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      Default Order
                    </button>
                    <button 
                      onClick={() => setTempSortOrder('qs-high')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${tempSortOrder === 'qs-high' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      Questions (High to Low)
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedClass(tempSelectedClass);
                  setSelectedUnit(tempSelectedUnit);
                  setSortOrder(tempSortOrder);
                  setShowFilterModal(false);
                }}
                className="w-full py-3.5 mt-4 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-light transition-colors"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Create Test Modal */}
      <AnimatePresence>
        {showCreateTestModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateTestModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-4">
                <FileEdit size={32} className="text-brand" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Custom Test</h3>
              <p className="text-sm text-slate-400 mb-6">
                This feature is coming soon! You will be able to create custom tests from your bookmarked questions and mistakes.
              </p>
              <button
                onClick={() => setShowCreateTestModal(false)}
                className="w-full py-3.5 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-light transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PYQ Filter & Sorting Modal */}
      <AnimatePresence>
        {showPyqFilterModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPyqFilterModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-[#1E2329] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Filter & Sorting</h3>
                <button 
                  onClick={() => {
                    setTempPyqSortBy('Default');
                    setTempPyqExam('All');
                    setTempHideOutOfSyllabus(false);
                    setTempShowOnlyOutOfSyllabus(false);
                    setTempPyqDifficulty([]);
                    setTempPyqQuestionType([]);
                    setTempPyqEvaluationStatus([]);
                    setTempPyqYears([]);
                  }}
                  className="text-red-400 font-medium hover:text-red-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden h-[60vh]">
                {/* Sidebar */}
                <div className="w-24 bg-[#1E2329] border-r border-white/10 flex flex-col overflow-y-auto no-scrollbar">
                  {[
                    { id: 'Sort By', icon: ArrowUpDown },
                    { id: 'Exam', icon: BookOpen },
                    { id: 'Difficulty', icon: Asterisk },
                    { id: 'Question Type', icon: List },
                    { id: 'Evaluation Status', icon: CheckSquare },
                    { id: 'Years', icon: Calendar }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activePyqFilterTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActivePyqFilterTab(tab.id as any)}
                        className={`flex flex-col items-center justify-center py-4 gap-2 transition-colors relative ${
                          isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />}
                        <Icon size={20} />
                        <span className="text-[10px] text-center font-medium px-1 leading-tight">{tab.id}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-[#1A1E23] overflow-y-auto p-4 space-y-6">
                  {activePyqFilterTab === 'Sort By' && (
                    <>
                      <div className="bg-[#22272E] rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SORT BY</h4>
                          <ChevronRight size={16} className="text-slate-500 rotate-90" />
                        </div>
                        <div className="flex flex-col gap-4">
                          {['Default', 'Latest to Oldest', 'Oldest to Latest'].map(sortOption => (
                            <label key={sortOption} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tempPyqSortBy === sortOption ? 'border-blue-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                {tempPyqSortBy === sortOption && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                              </div>
                              <span className="text-slate-200 text-sm font-medium">{sortOption}</span>
                              <input 
                                type="radio" 
                                name="sort-by" 
                                className="hidden" 
                                checked={tempPyqSortBy === sortOption}
                                onChange={() => setTempPyqSortBy(sortOption)}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-[#22272E] rounded-xl p-4 border border-white/5 flex justify-between items-center">
                        <span className="text-slate-200 text-sm font-medium">Hide out of syllabus Qs</span>
                        <button 
                          onClick={() => {
                            setTempHideOutOfSyllabus(!tempHideOutOfSyllabus);
                            if (!tempHideOutOfSyllabus) setTempShowOnlyOutOfSyllabus(false);
                          }}
                          className={`w-10 h-6 rounded-full transition-colors relative ${tempHideOutOfSyllabus ? 'bg-blue-500' : 'bg-slate-600'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${tempHideOutOfSyllabus ? 'left-5' : 'left-1'}`} />
                        </button>
                      </div>
                      
                      <div className="bg-[#22272E] rounded-xl p-4 border border-white/5 flex justify-between items-center mt-4">
                        <span className="text-slate-200 text-sm font-medium">Show only out of syllabus Qs</span>
                        <button 
                          onClick={() => {
                            setTempShowOnlyOutOfSyllabus(!tempShowOnlyOutOfSyllabus);
                            if (!tempShowOnlyOutOfSyllabus) setTempHideOutOfSyllabus(false);
                          }}
                          className={`w-10 h-6 rounded-full transition-colors relative ${tempShowOnlyOutOfSyllabus ? 'bg-blue-500' : 'bg-slate-600'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${tempShowOnlyOutOfSyllabus ? 'left-5' : 'left-1'}`} />
                        </button>
                      </div>
                    </>
                  )}

                  {activePyqFilterTab === 'Exam' && (
                    <div className="bg-[#22272E] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">EXAM</h4>
                        <button onClick={() => setTempPyqExam('All')} className="text-xs text-red-400 font-medium">Clear</button>
                      </div>
                      <div className="flex flex-col gap-4">
                        {['All', 'JEE Main', 'JEE Advanced', 'NEET', 'BITSAT'].map(exam => (
                          <label key={exam} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${tempPyqExam === exam ? 'border-blue-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                              {tempPyqExam === exam && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                            </div>
                            <span className="text-slate-200 text-sm font-medium">{exam}</span>
                            <input 
                              type="radio" 
                              name="exam-filter" 
                              className="hidden" 
                              checked={tempPyqExam === exam}
                              onChange={() => {}}
                              onClick={() => {
                                if (tempPyqExam === exam) {
                                  setTempPyqExam('All');
                                } else {
                                  setTempPyqExam(exam);
                                }
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePyqFilterTab === 'Difficulty' && (
                    <div className="bg-[#22272E] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">DIFFICULTY</h4>
                        <button onClick={() => setTempPyqDifficulty([])} className="text-xs text-red-400 font-medium">Clear</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {['Easy', 'Medium', 'Tough'].map(diff => {
                          const isSelected = tempPyqDifficulty.includes(diff);
                          return (
                            <button
                              key={diff}
                              onClick={() => setTempPyqDifficulty(prev => prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff])}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${
                                isSelected ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#1A1E23] border-white/5 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-end gap-0.5 h-4">
                                <div className={`w-1 rounded-t-sm ${diff === 'Easy' ? 'h-2 bg-emerald-500' : 'h-2 bg-slate-600'}`} />
                                <div className={`w-1 rounded-t-sm ${diff === 'Medium' ? 'h-3 bg-yellow-500' : (diff === 'Tough' ? 'h-3 bg-slate-600' : 'h-3 bg-slate-600')}`} />
                                <div className={`w-1 rounded-t-sm ${diff === 'Tough' ? 'h-4 bg-red-500' : 'h-4 bg-slate-600'}`} />
                              </div>
                              <span className="text-sm font-medium">{diff}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activePyqFilterTab === 'Question Type' && (
                    <div className="bg-[#22272E] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">QUESTION TYPE</h4>
                        <button onClick={() => setTempPyqQuestionType([])} className="text-xs text-red-400 font-medium">Clear</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'Single Correct', icon: List },
                          { id: 'Multiple Correct', icon: CheckSquare },
                          { id: 'Numerical', icon: Calculator }
                        ].map(type => {
                          const Icon = type.icon;
                          const isSelected = tempPyqQuestionType.includes(type.id);
                          return (
                            <button
                              key={type.id}
                              onClick={() => setTempPyqQuestionType(prev => prev.includes(type.id) ? prev.filter(t => t !== type.id) : [...prev, type.id])}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${
                                isSelected ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#1A1E23] border-white/5 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <Icon size={20} />
                              <span className="text-sm font-medium text-center leading-tight">{type.id}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activePyqFilterTab === 'Evaluation Status' && (
                    <div className="bg-[#22272E] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">EVALUATION STATUS</h4>
                        <button onClick={() => setTempPyqEvaluationStatus([])} className="text-xs text-red-400 font-medium">Clear</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'Correct', icon: Check },
                          { id: 'Incorrect', icon: X },
                          { id: 'Partially Correct', icon: Minus },
                          { id: 'Unattempted', icon: AlertCircle }
                        ].map(status => {
                          const Icon = status.icon;
                          const isSelected = tempPyqEvaluationStatus.includes(status.id);
                          return (
                            <button
                              key={status.id}
                              onClick={() => setTempPyqEvaluationStatus(prev => prev.includes(status.id) ? prev.filter(s => s !== status.id) : [...prev, status.id])}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${
                                isSelected ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#1A1E23] border-white/5 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                                <Icon size={14} />
                              </div>
                              <span className="text-sm font-medium text-center leading-tight">{status.id}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activePyqFilterTab === 'Years' && (
                    <div className="bg-[#22272E] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">YEARS</h4>
                        <button onClick={() => setTempPyqYears([])} className="text-xs text-red-400 font-medium">Clear</button>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-2">Quick Selection</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setTempPyqYears(['JEE Main 2026'])}
                            className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                          >
                            Last Year
                          </button>
                          <button 
                            onClick={() => setTempPyqYears(['JEE Main 2026', 'JEE Main 2025', 'JEE Main 2024'])}
                            className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                          >
                            Last 3 Years
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        {['JEE Main 2026', 'JEE Main 2025', 'JEE Main 2024', 'JEE Main 2023', 'JEE Main 2022', 'JEE Main 2021'].map(year => (
                          <label key={year} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${tempPyqYears.includes(year) ? 'bg-blue-500 border-blue-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                {tempPyqYears.includes(year) && <Check size={14} className="text-white" />}
                              </div>
                              <span className="text-slate-200 text-sm font-medium">{year}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-500 rotate-90" />
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={tempPyqYears.includes(year)}
                              onChange={() => setTempPyqYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year])}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 p-4 border-t border-white/10 bg-[#1E2329]">
                <button
                  onClick={() => setShowPyqFilterModal(false)}
                  className="flex-1 py-3.5 bg-transparent border border-white/20 text-white rounded-xl font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setPyqSortBy(tempPyqSortBy);
                    setPyqExam(tempPyqExam);
                    setHideOutOfSyllabus(tempHideOutOfSyllabus);
                    setShowOnlyOutOfSyllabus(tempShowOnlyOutOfSyllabus);
                    setPyqDifficulty(tempPyqDifficulty);
                    setPyqQuestionType(tempPyqQuestionType);
                    setPyqEvaluationStatus(tempPyqEvaluationStatus);
                    setPyqYears(tempPyqYears);
                    setShowPyqFilterModal(false);
                  }}
                  className="flex-1 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scratchpad Overlay */}
      <AnimatePresence>
        {showScratchpad && (
          <Scratchpad onClose={() => setShowScratchpad(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
