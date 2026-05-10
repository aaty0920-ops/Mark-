import React, { useEffect, useState } from"react";
import { motion } from"motion/react";
import {
  Trophy,
  ArrowLeft,
  Star,
  TrendingUp,
  Medal,
  Target,
  HelpCircle,
  ChevronRight,
  Zap,
} from"lucide-react";
import { useNavigate } from"react-router-dom";
import { useUser } from"../context/UserContext";
import { getTestReports, overallStats } from"../utils/analysis";
import { db } from"../firebase";
import { collection, query, orderBy, limit, getDocs } from"firebase/firestore";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("Today");
  const { pointsEarned, userRank, user } = useUser();
  const [localUserRank, setLocalUserRank] = useState(userRank);
  const [userAccuracy, setUserAccuracy] = useState("0.00");
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reports = getTestReports();
    const stats = overallStats(reports);
    setUserAccuracy(stats.accuracy);
  }, []);

  useEffect(() => {
    const fetchLeaders = async () => {
      if (user?.uid ==="demo") {
        const mockLeaders = [
          {
            id:"1",
            name:"Aarav Kumar",
            points: 1250,
            rank: 1,
            avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=Aarav",
            accuracy:"92.5",
          },
          {
            id:"2",
            name:"Priya Sharma",
            points: 1100,
            rank: 2,
            avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=Priya",
            accuracy:"89.0",
          },
          {
            id:"3",
            name:"Rohan Gupta",
            points: 1050,
            rank: 3,
            avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=Rohan",
            accuracy:"87.2",
          },
          {
            id:"4",
            name:"Demo Student",
            points: 150,
            rank: 42,
            avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=Demo",
            accuracy:"75.0",
          },
        ];
        setLeaders(mockLeaders);
        setLocalUserRank(42);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db,"users_public"),
          orderBy("points","desc"),
          limit(10),
        );
        const querySnapshot = await getDocs(q);
        const fetchedLeaders: any[] = [];
        let rank = 1;
        let currentUserRank = userRank;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id === user?.uid) {
            currentUserRank = rank;
          }
          fetchedLeaders.push({
            id: doc.id,
            name: data.name ||"Anonymous",
            points: data.points || 0,
            rank: rank++,
            avatar: `https://picsum.photos/seed/${doc.id}/100/100`,
            accuracy: (Math.random() * (99 - 60) + 60).toFixed(1), // Mock varying accuracies
          });
        });
        setLeaders(fetchedLeaders);
        setLocalUserRank(currentUserRank);
      } catch (error) {
        console.error("Error fetching leaders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  // Premium glow colors based on rank
  const getRankStyle = (rank: number) => {
    if (rank === 1)
      return {
        bg:"bg-emerald-500",
        glow:"shadow-[0_0_20px_rgba(16,185,129,0.3)]",
        border:"border-emerald-500/50",
        cardBg:"bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-800/80 dark:to-emerald-950/20",
      };
    if (rank === 2)
      return {
        bg:"bg-blue-500",
        glow:"shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        border:"border-blue-500/50",
        cardBg:"bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-slate-800/80 dark:to-blue-950/20",
      };
    if (rank === 3)
      return {
        bg:"bg-purple-500",
        glow:"shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        border:"border-purple-500/50",
        cardBg:"bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-slate-800/80 dark:to-purple-950/20",
      };
    return {
      bg:"bg-slate-100 dark:bg-slate-700",
      glow:"",
      border:"border-slate-900/5 dark:border-white/5",
      cardBg:"bg-slate-50/50 dark:bg-slate-800/50",
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white pb-32  relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center relative z-10">
        <div className="w-full flex justify-between items-center mb-6 absolute top-10 px-6 left-0 right-0">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 transition-all shadow-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 transition-all shadow-lg">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="relative mt-8 mb-6 group cursor-pointer">
          <div className="absolute inset-0 bg-brand/30 rounded-full blur-[30px] group-hover:bg-brand/40 transition-colors duration-500" />
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-brand/40 rounded-[2rem] flex items-center justify-center relative z-10 shadow-xl shadow-brand/20 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
            <Trophy
              className="text-brand filter drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]"
              size={48}
            />
          </div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-[#0f172a] z-20 shadow-lg">
            <Star
              size={16}
              fill="white"
              className="text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 drop-shadow-md">
          Legend League
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[260px] mx-auto leading-relaxed font-medium">
          You are now competing against 99%ilers! Stay in this league to earn
          rewards.
        </p>

        <div className="mt-8 flex bg-slate-50/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-[1.25rem] w-full max-w-xs mx-auto border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden relative">
          {["Today","This Week"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all duration-300 relative z-10 ${isActive ?"text-slate-900 dark:text-white" :"text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-brand rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] -z-10"
                    transition={{ type:"spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {tab}
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-6 space-y-4 relative z-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          leaders.map((leader, i) => {
            const style = getRankStyle(leader.rank);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-3xl border flex items-center justify-between transition-all group hover:scale-[1.02] cursor-pointer ${style.cardBg} ${style.border} ${style.glow}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg border border-slate-900/10 dark:border-white/10 shadow-inner ${style.bg} ${leader.rank <= 3 ?"text-slate-900 dark:text-white" :"text-slate-500 dark:text-slate-400"}`}
                  >
                    {leader.rank === 1 ? (
                      <Trophy
                        size={20}
                        className="fill-white/20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      />
                    ) : leader.rank === 2 ? (
                      <Medal
                        size={20}
                        className="fill-white/20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      />
                    ) : leader.rank === 3 ? (
                      <Medal
                        size={18}
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      />
                    ) : (
                      leader.rank
                    )}
                  </div>

                  <div className="relative">
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      className="w-12 h-12 rounded-[1rem] object-cover border-2 border-slate-200/50 dark:border-slate-700/50 group-hover:border-slate-500 transition-colors"
                      referrerPolicy="no-referrer"
                    />
                    {leader.rank <= 3 && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <Zap
                          size={8}
                          className="text-amber-900 fill-amber-900"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-base leading-tight ${leader.rank <= 3 ?"text-slate-900 dark:text-white" :"text-slate-600 dark:text-slate-300"}`}
                    >
                      {leader.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        <TrendingUp size={10} strokeWidth={3} />
                        RANK UP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5 bg-white/5 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-900/5 dark:border-white/5 shadow-inner">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white shadow-md ${leader.rank <= 3 ? style.bg :"bg-brand"}`}
                    >
                      M
                    </div>
                    <span className="font-black text-slate-700 dark:text-slate-200">
                      {leader.points}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                    <Target
                      size={12}
                      className={
                        leader.rank <= 3
                          ?"text-emerald-400"
                          :"text-slate-500 dark:text-slate-400"
                      }
                    />
                    {leader.accuracy}%
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        {/* User Rank Sticky Footer */}
        <div className="fixed bottom-24 left-6 right-6 z-40">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-xl border border-brand/40 p-4 rounded-[2rem] flex items-center justify-between shadow-[0_0_30px_rgba(37,99,235,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-[1rem] flex items-center justify-center font-black text-xl shadow-lg border border-rose-400/30">
                {localUserRank}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-[1rem] bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${user?.uid}/100/100`}
                    alt="You"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight">
                  You
                </h3>
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest">
                  Keep Pushing! 🔥
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5 bg-white/8 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-900/10 dark:border-white/10">
                <div className="w-5 h-5 bg-brand rounded-md flex items-center justify-center text-[10px] font-black text-white shadow-md">
                  M
                </div>
                <span className="font-black text-slate-900 dark:text-white text-lg leading-none">
                  {pointsEarned}
                </span>
              </div>
              <div className="flex items-center justify-between w-full px-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <Target size={12} className="text-brand" />
                  {userAccuracy}%
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-500 dark:text-slate-400"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
