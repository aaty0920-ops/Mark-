import React, { useState } from"react";
import { motion } from"motion/react";
import {
  ArrowLeft,
  Filter,
  Search,
  MoreVertical,
  PlayCircle,
  BookOpen,
} from"lucide-react";

interface PYQChapterViewProps {
  exam:"JEE Main" |"NEET";
  subject: string;
  chapter: string;
  onBack: () => void;
  onSelectQuestion: (questionId: string) => void;
}

const PYQChapterView: React.FC<PYQChapterViewProps> = ({
  exam,
  subject,
  chapter,
  onBack,
  onSelectQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<"All PYQs" |"Topic-Wise PYQs">("All PYQs",
  );

  const mockQuestions = Array(10)
    .fill(0)
    .map((_, i) => ({
      id: `q${i + 1}`,
      qNumber: `Q${i + 1}`,
      year:"2025",
      shift:"Shift 1",
      text:"A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?",
      options: ["g sin θ","g tan θ","g cos θ","g cot θ"],
      status: i < 2 ?"Correct" : i === 2 ?"Wrong" :"Unattempted", // Mock status
    }));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 sticky top-0 bg-white/9 dark:bg-slate-900/90 backdrop-blur-lg z-40 border-b border-slate-900/5 dark:border-white/5 shadow-sm shadow-slate-900/50">
        <div className="flex items-start gap-4 mb-5">
          <button
            onClick={onBack}
            className="p-2 -ml-2 -mt-1 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-full transition-colors shrink-0"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold leading-tight mb-1">{chapter}</h1>
            <p className="text-xs text-brand font-bold uppercase tracking-wider flex items-center gap-2">
              {exam}{""}
              <span className="text-slate-500 dark:text-slate-400">»</span> 102
              PYQs <span className="text-slate-500 dark:text-slate-400">|</span>{""}
              2 Topics
            </p>
          </div>
        </div>

        {/* Top Tabs */}
        <div className="flex gap-4 border-b border-slate-100/80 dark:border-slate-800/80 -px-5">
          {["All PYQs","Topic-Wise PYQs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 text-sm font-bold transition-all relative outline-none ${
                activeTab === tab
                  ?"text-slate-900 dark:text-white"
                  :"text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-700 dark:text-slate-200"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="chapterTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.5)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex items-center justify-between pt-4 gap-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-900/5 dark:border-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700">
              <Filter size={14} /> Filter & Sorting
            </button>
            <div className="w-px h-6 bg-white/1 dark:bg-slate-900/10 mx-1 shrink-0 self-center" />
            <button className="px-3 py-1.5 bg-brand text-white border border-brand/20 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 shadow-md shadow-brand/20">
              As per syllabus
            </button>
            <button className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-900/5 dark:border-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700">
              Removed
            </button>
            <button className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-900/5 dark:border-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700">
              Reduced
            </button>
          </div>
        </div>
      </header>

      {/* Main List */}
      <main className="p-4 space-y-4 pb-24">
        {mockQuestions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelectQuestion(q.id)}
            className="bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-5 cursor-pointer hover:border-slate-500 transition-colors shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                    q.status ==="Correct"
                      ?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      : q.status ==="Wrong"
                        ?"bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        :"bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-900/10 dark:border-white/10"
                  }`}
                >
                  {q.qNumber}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md border border-slate-900/5 dark:border-white/5">
                  {q.year} <span className="text-slate-600 dark:text-slate-400">•</span> {q.shift}
                </div>
              </div>
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white p-1">
                <MoreVertical size={16} />
              </button>
            </div>

            <p className="text-slate-700 dark:text-slate-200 text-[15px] leading-relaxed mb-5 font-medium">
              {q.text}
            </p>

            {/* Quick action buttons row (purely visual for the list view) */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-200/40 dark:border-slate-700/40">
              <div className="flex gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-brand px-2 py-1 rounded border border-brand/10">
                  Laws of Motion
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-yellow-500 px-2 py-1 rounded border border-yellow-500/10">
                  Medium
                </span>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-white bg-brand/10 hover:bg-brand/20 border border-brand/30 px-3 py-1.5 rounded-lg transition-colors">
                <PlayCircle size={14} /> Attempt Option
              </button>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Floating Action Button for bulk attempt */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-30 flex justify-center pointer-events-none">
        <button className="pointer-events-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-full px-6 py-3.5 font-bold shadow-xl shadow-black/20 flex items-center gap-2 hover:scale-105 transition-transform">
          <BookOpen size={18} /> Take Chapter Test
        </button>
      </div>
    </div>
  );
};

export default PYQChapterView;
