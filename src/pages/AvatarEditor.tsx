import React, { useState, useMemo, useEffect } from"react";
import { useNavigate } from"react-router-dom";
import { X, Save, RefreshCw, Undo2, Redo2 } from"lucide-react";
import { createAvatar } from"@dicebear/core";
import { avataaars } from"@dicebear/collection";
import { useUser, AvatarConfig } from"../context/UserContext";
import { motion } from"framer-motion";

const CATEGORIES = [
  { id:"skinColor", label:"Skin Tone", hasColor: false },
  { id:"top", label:"Hair", hasColor: true, colorKey:"hairColor" },
  { id:"eyes", label:"Eyes", hasColor: false },
  { id:"eyebrows", label:"Eyebrows", hasColor: false },
  { id:"mouth", label:"Mouth", hasColor: false },
  {
    id:"facialHair",
    label:"Facial Hair",
    hasColor: true,
    colorKey:"facialHairColor",
  },
  { id:"clothing", label:"Outfit", hasColor: true, colorKey:"clothesColor" },
  { id:"accessories", label:"Accessories", hasColor: false },
  { id:"backgroundColor", label:"Background", hasColor: false },
];

const OPTIONS = {
  skinColor: ["edb98a","fd9841","f8d25c","ffdbb4","d08b5b","ae5d29","614335",
  ],
  hairColor: ["2c1b18","4a3123","b58143","d6b370","724133","a55728","f59797","ecdcbf","c93305","e8e1e1",
  ],
  top: ["shortHairShortFlat","shortHairShortRound","shortHairShortWaved","shortHairSides","shortHairTheCaesar","shortHairTheCaesarAndSidePart","shortHairDreads01","shortHairDreads02","shortHairFrizzle","shortHairShaggyMullet","longHairBigHair","longHairBob","longHairBun","longHairCurly","longHairCurvy","longHairDreads","longHairFrida","longHairFro","longHairFroBand","longHairNotTooLong","longHairShavedSides","longHairMiaWallace","longHairStraight","longHairStraight2","longHairStraightStrand","eyepatch","hat","hijab","turban","winterHat1","winterHat2","winterHat3","winterHat4",
  ],
  facialHair: ["blank","beardMedium","beardLight","beardMajestic","moustaceMagnum","moustacheFancy",
  ],
  facialHairColor: ["2c1b18","4a3123","b58143","d6b370","724133","a55728","f59797","ecdcbf","c93305","e8e1e1",
  ],
  eyes: ["default","close","cry","dizzy","eyeRoll","happy","hearts","side","squint","surprised","wink","winkWacky",
  ],
  eyebrows: ["default","defaultNatural","angry","angryNatural","flatNatural","raisedExcited","raisedExcitedNatural","sadConcerned","sadConcernedNatural","unibrowNatural","upDown","upDownNatural",
  ],
  mouth: ["default","concerned","disbelief","eating","grimace","sad","screamOpen","serious","smile","smirk","twinkle","vomit",
  ],
  clothing: ["blazerAndShirt","blazerAndSweater","collarAndSweater","graphicShirt","hoodie","overall","shirtCrewNeck","shirtScoopNeck","shirtVNeck",
  ],
  clothesColor: ["262e33","65c9ff","5199e4","25557c","e6e6e6","929598","3c4f5c","b1e2ff","a7ffc4","ffdeb5","ffafb9","ffffb1","ff488e","ff5c5c","ffffff",
  ],
  accessories: ["blank","kurt","prescription01","prescription02","round","sunglasses","wayfarers",
  ],
  backgroundColor: ["b6e3f4","c0aede","d1d4f9","ffd5dc","ffdfbf","transparent","e2e8f0","f8fafc","fef08a","bbf7d0","fbcfe8",
  ],
};

const DEFAULT_CONFIG: AvatarConfig = {
  seed:"custom",
  backgroundColor: ["b6e3f4"],
  skinColor: ["edb98a"],
  hairColor: ["2c1b18"],
  facialHairColor: ["2c1b18"],
  clothesColor: ["262e33"],
  eyes: ["default"],
  eyebrows: ["default"],
  mouth: ["smile"],
  top: ["shortHairShortFlat"],
  accessories: ["blank"],
  facialHair: ["blank"],
  clothing: ["hoodie"],
  clothingGraphic: ["bat"],
};

export default function AvatarEditor() {
  const navigate = useNavigate();
  const { avatarConfig, setAvatarConfig, setProfilePic } = useUser();
  const [config, setConfig] = useState<AvatarConfig>(
    avatarConfig || DEFAULT_CONFIG,
  );
  const [activeCategory, setActiveCategory] = useState<string>("skinColor");

  // History for Undo/Redo
  const [history, setHistory] = useState<AvatarConfig[]>([
    avatarConfig || DEFAULT_CONFIG,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const avatarSvg = useMemo(() => {
    const avatar = createAvatar(avataaars, {
      ...(config as any),
      size: 256,
    });
    return avatar.toDataUri();
  }, [config]);

  const handleSave = async () => {
    setAvatarConfig(config);
    setProfilePic(avatarSvg);
    navigate("/app/profile");
  };

  const updateConfig = (key: keyof AvatarConfig, value: string) => {
    const newConfig = { ...config, [key]: [value] };
    setConfig(newConfig);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newConfig);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);
    }
  };

  const handleRandomize = () => {
    const randomConfig: any = { seed: Math.random().toString(36).substring(7) };
    Object.keys(OPTIONS).forEach((key) => {
      const options = OPTIONS[key as keyof typeof OPTIONS];
      randomConfig[key] = [options[Math.floor(Math.random() * options.length)]];
    });
    const newConfig = randomConfig as AvatarConfig;
    setConfig(newConfig);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newConfig);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col  text-slate-900 dark:text-white">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-10 bg-white/8 dark:bg-slate-900/80 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Avatar Editor</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand/90 text-white rounded-full font-bold transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </header>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[40vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-50 dark:bg-slate-800 rounded-full shadow-2xl border-4 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center"
        >
          <img
            src={avatarSvg}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Undo / Redo / Randomize Controls */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 transition-colors"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 transition-colors"
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleRandomize}
            className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical Color Palette */}
        {activeCategoryData?.hasColor && activeCategoryData.colorKey && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-full border border-slate-200 dark:border-slate-700 max-h-[60%] overflow-y-auto hide-scrollbar">
            {OPTIONS[activeCategoryData.colorKey as keyof typeof OPTIONS].map(
              (color) => (
                <button
                  key={color}
                  onClick={() =>
                    updateConfig(
                      activeCategoryData.colorKey as keyof AvatarConfig,
                      color,
                    )
                  }
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    config[
                      activeCategoryData.colorKey as keyof AvatarConfig
                    ]?.[0] === color
                      ?"border-slate-900 dark:border-white scale-110"
                      :"border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: `#${color}` }}
                />
              ),
            )}
          </div>
        )}
      </div>

      {/* Editor Controls */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe rounded-t-3xl">
        {/* Categories */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 dark:border-slate-700 px-2 pt-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-4 whitespace-nowrap text-sm font-bold transition-colors border-b-2 ${
                activeCategory === category.id
                  ?"border-brand text-brand"
                  :"border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-700 dark:text-slate-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Options Grid */}
        <div className="p-4 h-64 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {OPTIONS[activeCategory as keyof typeof OPTIONS].map((option) => {
              const isColor = activeCategory.toLowerCase().includes("color");
              const isSelected =
                config[activeCategory as keyof AvatarConfig]?.[0] === option;

              return (
                <button
                  key={option}
                  onClick={() =>
                    updateConfig(activeCategory as keyof AvatarConfig, option)
                  }
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ?"border-brand scale-105 shadow-lg shadow-brand/20"
                      :"border-slate-200 dark:border-slate-700 hover:border-slate-500"
                  }`}
                  style={
                    isColor && option !=="transparent"
                      ? { backgroundColor: `#${option}` }
                      : {}
                  }
                >
                  {!isColor && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5 dark:bg-slate-900/50">
                      {/* Render a mini preview of the option */}
                      <img
                        src={createAvatar(avataaars, {
                          ...(config as any),
                          [activeCategory]: [option],
                          backgroundColor: ["transparent"],
                          size: 80,
                        }).toDataUri()}
                        alt={option}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  )}
                  {isColor && option ==="transparent" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      None
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
