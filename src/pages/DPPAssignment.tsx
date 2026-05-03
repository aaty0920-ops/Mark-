import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle, Bookmark, AlertTriangle, MoreVertical } from 'lucide-react';

const MOCK_QUESTIONS = [
  {
    id: 1,
    text: 'A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?',
    options: ['g sin θ', 'g tan θ', 'g cos θ', 'g cot θ'],
    correctAnswer: 1,
    solution: 'For the block to not slip, the pseudo force (ma) must balance the component of weight along the incline.\nma cos θ = mg sin θ\na = g tan θ'
  },
  {
    id: 2,
    text: 'A charge q is placed at the center of a cube. Find the electric flux through one face.',
    options: ['q / 6ε₀', 'q / ε₀', 'q / 4ε₀', 'q / 2ε₀'],
    correctAnswer: 0,
    solution: 'Total flux = q/ε₀. A cube has 6 identical faces, so flux through one face = q / 6ε₀.'
  },
  {
    id: 3,
    text: 'A particle is moving in a circle of radius R with constant speed v. The magnitude of average acceleration after half revolution is:',
    options: ['v² / R', '2v² / πR', 'v² / πR', 'Zero'],
    correctAnswer: 1,
    solution: 'Change in velocity (Δv) = 2v. Time taken (Δt) = πR / v. Average acceleration = Δv / Δt = 2v² / πR.'
  }
];

export default function DPPAssignment() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterName = location.state?.chapterName || 'DPP Assignment';

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const toggleSolution = (questionId: number) => {
    setShowSolutions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarked(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-kanit flex flex-col pb-20">
      {/* Header */}
      <header className="px-4 py-3 border-b border-white/5 bg-slate-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-base line-clamp-1">{chapterName}</h1>
            <p className="text-xs text-slate-400">Assignment Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors hidden md:block" title="Menu">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Questions List */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 space-y-6">
        {MOCK_QUESTIONS.map((q, index) => {
          const selectedOption = userAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctAnswer;
          const showingSolution = showSolutions[q.id];

          return (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 md:p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-brand bg-brand/10 px-3 py-1 rounded-lg">
                  Q{index + 1}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-2 rounded-full transition-colors ${bookmarked[q.id] ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Bookmark size={16} fill={bookmarked[q.id] ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors">
                    <AlertTriangle size={16} />
                  </button>
                </div>
              </div>

              <h2 className="text-base md:text-lg font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                {q.text}
              </h2>

              <div className="space-y-3">
                {q.options.map((option, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isActuallyCorrect = q.correctAnswer === optIndex;
                  
                  let optionClass = "bg-slate-800 border-white/10 hover:border-brand/50 hover:bg-slate-800/80";
                  let icon = null;

                  if (isAnswered) {
                    if (isActuallyCorrect) {
                      optionClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
                      icon = <CheckCircle2 size={20} className="text-emerald-500" />;
                    } else if (isSelected) {
                      optionClass = "bg-rose-500/10 border-rose-500/50 text-rose-400";
                      icon = <XCircle size={20} className="text-rose-500" />;
                    } else {
                      optionClass = "bg-slate-800/50 border-white/5 opacity-50";
                    }
                  } else if (isSelected) {
                    optionClass = "bg-brand/10 border-brand text-brand";
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleOptionSelect(q.id, optIndex)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${optionClass}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          isAnswered && isActuallyCorrect ? 'bg-emerald-500/20 text-emerald-500' :
                          isAnswered && isSelected && !isActuallyCorrect ? 'bg-rose-500/20 text-rose-500' :
                          isSelected ? 'bg-brand text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span className="font-medium whitespace-pre-wrap">{option}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-6">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="w-full py-3 bg-slate-800 text-white border border-white/10 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                  >
                    {showingSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                  
                  {showingSolution && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-5 bg-slate-800/80 border border-white/5 rounded-xl"
                    >
                      <h4 className="text-sm font-bold text-brand mb-2">Official Solution</h4>
                      <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                        {q.solution}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </main>
    </div>
  );
}
