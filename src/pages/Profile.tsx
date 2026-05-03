import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Shield, Bell, LogOut, ChevronRight, Star, ArrowLeft, CheckCircle2, Smartphone, Monitor, Globe, Trash2, X, Camera, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser, handleFirestoreError, OperationType } from '../context/UserContext';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const navigate = useNavigate();
  const { pointsEarned, userRank, streak, user, logout, theme, setTheme, notifications, setNotifications, profilePic, setProfilePic, activityHistory, dailyGoal } = useUser();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProfilePicOptions, setShowProfilePicOptions] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  const AVATAR_SEEDS = ['Felix', 'Aneka', 'Mimi', 'Jack', 'Oliver', 'Sophie', 'Leo', 'Mia', 'Max', 'Luna', 'Charlie', 'Bella'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress the image to JPEG with 0.7 quality to keep it well under 1MB
          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          setProfilePic(base64String);
          setShowProfilePicOptions(false);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAvatar = (seed: string) => {
    const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
    setProfilePic(avatarUrl);
    setShowAvatarSelection(false);
    setShowProfilePicOptions(false);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      if (user.uid === 'demo') {
        const newActivityData = Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          // Generate some fake activity for demo user
          if (i % 3 === 0 && d <= today.getDate()) {
            return {
              day: d,
              level: Math.floor(Math.random() * 4) + 1,
              questionsSolved: Math.floor(Math.random() * 30) + 5,
              accuracy: Math.floor(Math.random() * 40) + 60,
              timeSpent: Math.floor(Math.random() * 120) + 10,
              pointsEarned: Math.floor(Math.random() * 200) + 50,
              dateStr,
              goalCompleted: Math.random() > 0.5
            };
          }
          return {
            day: d,
            level: 0,
            questionsSolved: 0,
            accuracy: 0,
            timeSpent: 0,
            pointsEarned: 0,
            dateStr,
            goalCompleted: false
          };
        });
        setActivityData(newActivityData);
        return;
      }
      
      try {
        const q = query(collection(db, `users/${user.uid}/activity`));
        const querySnapshot = await getDocs(q);
        const activities: Record<string, any> = {};
        querySnapshot.forEach((doc) => {
          activities[doc.id] = doc.data();
        });

        const newActivityData = Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const dayData = activities[dateStr];
          
          if (dayData) {
            let level = 0;
            if (dayData.questionsSolved >= dailyGoal) level = 4; // Goal completed
            else if (dayData.questionsSolved >= dailyGoal * 0.75) level = 3;
            else if (dayData.questionsSolved >= dailyGoal * 0.5) level = 2;
            else if (dayData.questionsSolved > 0) level = 1;

            return {
              day: d,
              level,
              questionsSolved: dayData.questionsSolved,
              accuracy: dayData.accuracy,
              timeSpent: dayData.timeSpent,
              pointsEarned: dayData.pointsEarned || 0,
              dateStr,
              goalCompleted: dayData.questionsSolved >= dailyGoal
            };
          }

          return {
            day: d,
            level: 0,
            questionsSolved: 0,
            accuracy: 0,
            timeSpent: 0,
            pointsEarned: 0,
            dateStr,
            goalCompleted: false
          };
        });
        setActivityData(newActivityData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/activity`);
      }
    };

    fetchActivity();
  }, [user, dailyGoal]);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || 'Student Name',
    email: user?.email || 'student@example.com',
    phone: '',
    dob: '',
    gender: 'Male'
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  // Settings State
  const [settings, setSettings] = useState({
    targetExam: 'JEE Main',
    language: 'English',
    videoQuality: 'Auto'
  });

  const menuItems = [
    { id: 'personal', icon: <User size={20} />, label: 'Personal Info', color: 'text-blue-500' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications', color: 'text-orange-500' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', color: 'text-slate-400' },
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderView = () => {
    switch (activeView) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <div className="w-24 h-24 rounded-full border-4 border-brand p-1 relative group cursor-pointer overflow-hidden" onClick={() => setShowProfilePicOptions(true)}>
                  <img 
                    src={profilePic || `https://picsum.photos/seed/${user?.uid || 'user'}/200/200`}
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">Tap to change profile picture</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <input 
                type="tel" 
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                <input 
                  type="date" 
                  value={personalInfo.dob}
                  onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                <select 
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-brand text-white font-bold rounded-2xl mt-4 flex items-center justify-center gap-2">
              {showSuccess ? <CheckCircle2 size={20} /> : null}
              {showSuccess ? 'Saved Successfully' : 'Save Changes'}
            </button>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { id: 'push', title: 'Push Notifications', desc: 'Receive alerts on your device' },
                { id: 'emails', title: 'Email Updates', desc: 'Weekly progress reports' },
                { id: 'testReminders', title: 'Test Reminders', desc: 'Alerts before scheduled tests' },
                { id: 'newContent', title: 'New Content', desc: 'When new PYQs are added' },
                { id: 'marketing', title: 'Offers & Promotions', desc: 'Special discounts and offers' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <div 
                    onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id as keyof typeof notifications]})}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications[item.id as keyof typeof notifications] ? 'bg-brand' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id as keyof typeof notifications] ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-brand text-white font-bold rounded-2xl mt-4 flex items-center justify-center gap-2">
              {showSuccess ? <CheckCircle2 size={20} /> : null}
              {showSuccess ? 'Preferences Saved' : 'Save Preferences'}
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">App Theme</label>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Exam</label>
                <select 
                  value={settings.targetExam}
                  onChange={(e) => setSettings({...settings, targetExam: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>JEE Main</option>
                  <option>NEET</option>
                  <option>JEE Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Quality</label>
                <select 
                  value={settings.videoQuality}
                  onChange={(e) => setSettings({...settings, videoQuality: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="font-bold text-lg text-rose-500">Danger Zone</h3>
              <button className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl border border-white/5 hover:bg-slate-700 transition-colors">
                Clear App Cache
              </button>
              <button className="w-full py-4 bg-rose-500/10 text-rose-500 font-bold rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={20} />
                Delete Account
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      <AnimatePresence mode="wait">
        {activeView ? (
          <motion.div
            key="subview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-[#0f172a]"
          >
            <header className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-[#0f172a]/80 backdrop-blur-lg z-40">
              <button 
                onClick={() => setActiveView(null)}
                className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">
                {menuItems.find(m => m.id === activeView)?.label}
              </h1>
            </header>
            <main className="px-6 pt-4">
              {renderView()}
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-brand p-1 relative group cursor-pointer" onClick={() => setShowProfilePicOptions(true)}>
                  <img 
                    src={profilePic || `https://picsum.photos/seed/${user?.uid || 'user'}/200/200`}
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center border-4 border-[#0f172a]">
                  <Star size={14} fill="white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">{user?.name || 'Student Name'}</h1>
              <p className="text-slate-500 font-medium">{user?.email || 'JEE 2026 Aspirant'}</p>
              
              <div className="mt-6 flex gap-4 w-full max-w-xs">
                <div className="flex-1 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Rank</p>
                  <p className="text-lg font-bold text-brand">#{userRank}</p>
                </div>
                <div className="flex-1 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Points</p>
                  <p className="text-lg font-bold text-emerald-500">{pointsEarned}</p>
                </div>
              </div>
            </header>

            <main className="px-6 space-y-6">
              {/* Performance Growth / Points Profit */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div>
                    <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" />
                      Points Growth
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">30-day profit margin</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Profit</p>
                    <p className="text-xl font-black text-emerald-500">
                      +{activityData.reduce((acc, curr) => acc + curr.pointsEarned, 0)}
                    </p>
                  </div>
                </div>

                <div className="h-48 w-full mt-4 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData.filter(d => d.pointsEarned > 0 || d.day > new Date().getDate() - 14)}>
                      <defs>
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        stroke="#ffffff30" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <YAxis 
                        stroke="#ffffff30" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pointsEarned" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#profitGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity Calendar */}
              <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-slate-300">Activity Map</h3>
                  <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded-lg">{streak} Day Streak! 🔥</span>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Qs</p>
                    <p className="text-xl font-black text-white">{activityData.reduce((acc, curr) => acc + curr.questionsSolved, 0)}</p>
                  </div>
                  <div className="flex-1 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Acc</p>
                    <p className="text-xl font-black text-emerald-500">
                      {activityData.filter(d => d.level > 0).length > 0 ? Math.round(activityData.reduce((acc, curr) => acc + curr.accuracy, 0) / activityData.filter(d => d.level > 0).length) : 0}%
                    </p>
                  </div>
                  <div className="flex-1 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hours</p>
                    <p className="text-xl font-black text-blue-500">
                      {Math.round(activityData.reduce((acc, curr) => acc + curr.timeSpent, 0) / 60)}h
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-xs font-bold text-slate-500">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`blank-${i}`} />
                  ))}
                  {activityData.map((data) => {
                    let colorClass = 'bg-slate-700/50 text-slate-400';
                    if (data.level === 1) colorClass = 'bg-brand/20 text-brand';
                    if (data.level === 2) colorClass = 'bg-brand/40 text-white';
                    if (data.level === 3) colorClass = 'bg-brand/70 text-white';
                    if (data.level === 4) colorClass = 'bg-brand text-white';
                    
                    return (
                      <button 
                        key={data.day} 
                        onClick={() => setSelectedDay(selectedDay === data.day ? null : data.day)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative ${colorClass} ${selectedDay === data.day ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'}`}
                      >
                        {data.day}
                        {data.goalCompleted && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1e293b]" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <AnimatePresence>
                  {selectedDay !== null && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-slate-800/80 rounded-xl p-4 border border-white/10 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-white">Day {selectedDay} Activity</h4>
                        <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-white">
                          <X size={16} />
                        </button>
                      </div>
                      {(() => {
                        const data = activityData.find(d => d.day === selectedDay);
                        if (!data || data.level === 0) {
                          return <p className="text-sm text-slate-400">No activity recorded on this day.</p>;
                        }
                        return (
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                              <div className="text-lg font-black text-brand">{data.questionsSolved}</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">Qs Solved</div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                              <div className="text-lg font-black text-emerald-500">{data.accuracy}%</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                              <div className="text-lg font-black text-blue-500">{data.timeSpent}m</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">Time</div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-sm bg-slate-700/50" />
                      <div className="w-4 h-4 rounded-sm bg-brand/20" />
                      <div className="w-4 h-4 rounded-sm bg-brand/40" />
                      <div className="w-4 h-4 rounded-sm bg-brand/70" />
                      <div className="w-4 h-4 rounded-sm bg-brand" />
                    </div>
                    <span>More</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span>Goal Completed</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 overflow-hidden">
                {menuItems.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all ${i !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${item.color} opacity-80`}>{item.icon}</div>
                      <span className="font-bold text-slate-300">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-600" />
                  </button>
                ))}
              </div>

              <button 
                onClick={async () => {
                  try {
                    await logout();
                    navigate('/');
                  } catch (err) {
                    console.error('Failed to log out', err);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 p-5 bg-rose-500/10 text-rose-500 rounded-2xl font-bold hover:bg-rose-500/20 transition-all mt-8"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Picture Options Modal */}
      <AnimatePresence>
        {showProfilePicOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-8"
            onClick={() => setShowProfilePicOptions(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white text-center mb-6">Change Profile Picture</h3>
                
                <button 
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-2xl transition-colors text-white font-medium"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Camera size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Photo Gallery</div>
                    <div className="text-xs text-slate-400">Upload a photo from your device</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setShowProfilePicOptions(false);
                    setShowAvatarSelection(true);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-2xl transition-colors text-white font-medium"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <User size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Choose Avatar</div>
                    <div className="text-xs text-slate-400">Select a fun character</div>
                  </div>
                </button>

                {profilePic && (
                  <button 
                    onClick={() => {
                      setProfilePic(null);
                      setShowProfilePicOptions(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-colors text-rose-500 font-medium"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                      <Trash2 size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Remove Photo</div>
                    </div>
                  </button>
                )}

                <button 
                  onClick={() => setShowProfilePicOptions(false)}
                  className="w-full p-4 mt-2 bg-slate-700 rounded-2xl text-white font-bold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <h3 className="text-xl font-bold text-white">Choose Avatar</h3>
                <button 
                  onClick={() => setShowAvatarSelection(false)}
                  className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  {AVATAR_SEEDS.map((seed) => (
                    <button
                      key={seed}
                      onClick={() => handleSelectAvatar(seed)}
                      className="aspect-square rounded-2xl bg-slate-700/50 border-2 border-transparent hover:border-brand p-2 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
                    >
                      <img 
                        src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`} 
                        alt={seed}
                        className="w-16 h-16 rounded-full bg-slate-800"
                      />
                      <span className="text-xs font-bold text-slate-400">{seed}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
