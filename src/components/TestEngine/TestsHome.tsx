import React from"react";
import { motion } from"motion/react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  ChevronRight,
  Star,
  Settings2,
} from"lucide-react";

interface TestsHomeProps {
  onBack: () => void;
  onCreateTest: () => void;
  onViewPYQs: () => void;
  onViewTestSeries: (id: string) => void;
  onViewClassTests: () => void;
}

const TestsHome: React.FC<TestsHomeProps> = ({
  onBack,
  onCreateTest,
  onViewPYQs,
  onViewTestSeries,
  onViewClassTests,
}) => {
  const testSeries = [
    {
      id:"1",
      title:"JEE Main 2024 Full Mock Series",
      subtitle:"15 Full Length Tests with detailed analysis",
      image:"https://picsum.photos/seed/jee1/400/200",
      students:"12k+",
    },
    {
      id:"2",
      title:"Chapter-wise PYQ Series (2019-2023)",
      subtitle:"Topic-wise sorted previous year questions",
      image:"https://picsum.photos/seed/pyq1/400/200",
      students:"45k+",
    },
    {
      id:"3",
      title:"Advanced Level Problem Set",
      subtitle:"Challenging problems for JEE Advanced prep",
      image:"https://picsum.photos/seed/adv1/400/200",
      students:"8k+",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white pb-24">
      {/* Top App Bar */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white/8 dark:bg-slate-900/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">MARKS Tests</h1>
            <div className="w-5 h-5 bg-brand rounded-md flex items-center justify-center">
              <Star
                size={12}
                fill="white"
                className="text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6 mt-4">
        {/* Primary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onViewPYQs}
            className="p-6 rounded-[2rem] border border-indigo-500/30 bg-gradient-to-br from-slate-100/80 to-indigo-50/40 dark:from-slate-800/80 dark:to-indigo-950/40 relative overflow-hidden cursor-pointer group shadow-xl shadow-indigo-900/20"
          >
            {/* Glowing background effects */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors duration-500" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="pr-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">
                    PYQ Mock Tests
                  </h2>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black rounded-lg uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    NEW
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Practice with real previous year questions. Exam-simulated
                  environment for top ranks.
                </p>

                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center -space-x-2">
                    <img
                      src="https://picsum.photos/seed/p1/40/40"
                      className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800"
                      alt="user"
                      referrerPolicy="no-referrer"
                    />
                    <img
                      src="https://picsum.photos/seed/p2/40/40"
                      className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800"
                      alt="user"
                      referrerPolicy="no-referrer"
                    />
                    <img
                      src="https://picsum.photos/seed/p3/40/40"
                      className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800"
                      alt="user"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-medium text-indigo-400">
                    <strong className="text-slate-900 dark:text-white">
                      519+ students
                    </strong>{""}
                    took a PYQ Test in the last hour 🔥
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                <FileText size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onCreateTest}
            className="p-6 rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 dark:from-slate-800/80 dark:to-emerald-950/40 relative overflow-hidden cursor-pointer group shadow-xl shadow-emerald-900/20 mt-4"
          >
            {/* Glowing background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="pr-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                    Create Custom Test
                  </h2>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black rounded-lg uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    UPDATED
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Select subjects, chapters, and set your own timer. Build the
                  perfect practice session.
                </p>

                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center -space-x-2">
                    <img
                      src="https://picsum.photos/seed/u1/40/40"
                      className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800"
                      alt="user"
                      referrerPolicy="no-referrer"
                    />
                    <img
                      src="https://picsum.photos/seed/u2/40/40"
                      className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800"
                      alt="user"
                      referrerPolicy="no-referrer"
                    />
                    <img
                      src="https://picsum.photos/seed/u3/40/40"
                      className="w-6 h-6 rounded-full border-2 border-slate-100 dark:border-slate-800"
                      alt="user"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-medium text-emerald-400">
                    <strong className="text-slate-900 dark:text-white">
                      565+ students
                    </strong>{""}
                    took a Custom Test in the last hour 🔥
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Settings2 size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section: Test Series */}
        <div className="pt-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="bg-brand/10 px-3 py-1 rounded-full border border-brand/20 inline-flex mb-3">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest">
                  Premium Selection
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                Elite Test Series
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Curated by top-tier educators for maximum yield.
              </p>
            </div>
            <div className="hidden sm:block">
              <button className="text-brand text-xs font-bold uppercase tracking-wider hover:text-blue-400 transition-colors bg-brand/5 px-4 py-2 rounded-full border border-brand/20 hover:bg-brand/10">
                View All
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar -mx-6 px-6 snap-x">
            {testSeries.map((series) => (
              <motion.div
                key={series.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewTestSeries(series.id)}
                className="min-w-[320px] sm:min-w-[360px] bg-slate-50/40 dark:bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 overflow-hidden cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 shadow-xl snap-start flex flex-col"
              >
                <div className="h-44 relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand/20 group-hover:bg-transparent transition-colors z-10 mix-blend-overlay"></div>
                  <img
                    src={series.image}
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 via-slate-100/40 dark:via-slate-900/40 to-transparent z-10" />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1.5 bg-white/1 dark:bg-slate-900/10 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest border border-slate-900/20 dark:border-white/20 shadow-sm">
                      {series.students} Active
                    </span>
                  </div>
                </div>
                <div className="p-6 relative z-20 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2 leading-snug group-hover:text-brand transition-colors limit-line-2">
                      {series.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed line-clamp-2">
                      {series.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Full Access
                    </span>
                    <button className="w-10 h-10 rounded-full bg-slate-100/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-brand group-hover:text-slate-900 dark:hover:text-white dark:text-white group-hover:shadow-lg group-hover:shadow-brand/20 transition-all duration-300">
                      <ChevronRight
                        size={18}
                        strokeWidth={2.5}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestsHome;
