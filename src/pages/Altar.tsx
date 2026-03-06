import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import OfferingModal from '../components/OfferingModal';
import MessageModal from '../components/MessageModal';
import { useAppContext, OfferingType } from '../context/AppContext';

const offeringIcons: Record<OfferingType, { icon: string, color: string, bg: string }> = {
  flower: { icon: 'local_florist', color: 'text-pink-300', bg: 'bg-white' },
  orange: { icon: 'nutrition', color: 'text-white/50', bg: 'bg-orange-400' },
  coffee: { icon: 'coffee', color: 'text-amber-700', bg: 'bg-amber-100' },
  plant: { icon: 'potted_plant', color: 'text-green-600', bg: 'bg-green-100' },
  tea: { icon: 'emoji_food_beverage', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  candle: { icon: 'candle', color: 'text-flame', bg: 'bg-flame/20' }
};

export default function Altar() {
  const [showOffering, setShowOffering] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { colleagues, selectedId, setSelectedId, lightIncense, loading } = useAppContext();

  const selectedColleague = colleagues.find(c => c.id === selectedId) || colleagues[0];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-full flex flex-col items-center justify-center p-6 bg-background-light"
      >
        <span className="material-symbols-outlined text-primary animate-spin text-4xl">progress_activity</span>
        <p className="text-ash text-sm mt-4">加载中...</p>
      </motion.div>
    );
  }

  if (!selectedColleague) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-full flex flex-col items-center justify-center p-6 bg-background-light"
      >
        <div className="w-24 h-24 rounded-full bg-surface border border-ash/20 flex items-center justify-center mb-6 shadow-inner-pressed">
          <span className="material-symbols-outlined text-ash/50 text-4xl">inventory_2</span>
        </div>
        <h2 className="font-display text-xl text-ink font-bold mb-2 tracking-widest">空空如也</h2>
        <p className="text-ash text-sm text-center mb-8">还没有建立任何印记，去添加一位故交吧。</p>
        <Link to="/add" className="px-8 py-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors font-display tracking-widest">
          建立印记
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      transition={{ duration: 0.6 }}
      className="min-h-full flex flex-col relative"
    >
      <header className="px-6 pt-12 pb-4 flex justify-between items-start">
        <Link to="/manage" className="flex items-center gap-2 text-ash hover:text-ink transition-colors bg-surface/40 px-3 py-1.5 rounded-full border border-ash/10 backdrop-blur-md shadow-sm">
          <span className="material-symbols-outlined text-[18px]">recent_actors</span>
          <span className="text-xs font-sans tracking-wider font-medium">故交集</span>
        </Link>
        <div className="relative flex gap-3 px-4 py-6 bg-surface/30 backdrop-blur-md shadow-soft border border-white/50 rounded-b-md self-start -mt-4 mr-2">
          {/* 红色饰带 */}
          <div className="absolute top-0 right-4 w-1.5 h-12 bg-flame shadow-sm rounded-b-sm opacity-90"></div>

          {/* 左侧小字 */}
          <div className="writing-vertical-rl text-sm tracking-[0.4em] text-ash font-sans pt-8">
            三生有幸
          </div>

          {/* 右侧大字 */}
          <div className="writing-vertical-rl text-lg tracking-[0.3em] text-ink font-display font-bold border-r border-ash/20 pr-3">
            山水一程
          </div>

          {/* 底部仿古印章 */}
          <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-sm bg-[#FAF8F3] border border-seal/20 -rotate-12 flex items-center justify-center p-0.5 shadow-sm">
            <div className="w-full h-full border border-seal/30 rounded-sm flex items-center justify-center">
              <span className="font-display text-seal font-bold text-[10px] transform scale-90 whitespace-nowrap">缅怀</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative w-full max-w-md mx-auto flex flex-col items-center justify-center perspective-1000 mt-8">
        {/* Floating Tags */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] w-8 h-32 bg-surface/80 shadow-sm border border-ash/10 rounded-sm flex items-center justify-center"
          >
            <span className="writing-vertical-rl text-xs text-ash/80 font-hand">江湖再见</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[20%] right-[15%] w-8 h-40 bg-surface/80 shadow-sm border border-ash/10 rounded-sm flex items-center justify-center"
          >
            <span className="writing-vertical-rl text-xs text-ash/80 font-hand">前程似锦</span>
          </motion.div>
        </div>

        {/* Altar Centerpiece */}
        <div className="relative w-full px-6 flex items-end justify-center gap-4 mb-8">
          {/* Portrait Card */}
          <Link to={`/memorial/${selectedColleague.id}`} className="relative group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-6deg]" style={{ transform: 'rotate(-5deg)', zIndex: 20 }}>
            <div className="absolute -top-16 left-1/2 w-0.5 h-16 bg-ash/30 -translate-x-1/2 origin-bottom transform rotate-6"></div>
            <div className="w-28 h-40 bg-white rounded-xl shadow-float border border-surface overflow-hidden relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-ash/20 rounded-full"></div>
              <div className="pt-8 px-3 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-ash/10 mb-3 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  {selectedColleague.photoUrl ? (
                    <img src={selectedColleague.photoUrl} alt="Portrait" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-ash text-[32px] mt-4">{selectedColleague.icon}</span>
                  )}
                </div>
                <h3 className="text-ink font-display font-bold text-lg">{selectedColleague.name}</h3>
                <p className="text-ash text-[10px] font-sans tracking-wide uppercase mt-1">{selectedColleague.title}</p>
              </div>
            </div>
          </Link>

          {/* Incense Burner */}
          <div className="relative z-30 mb-[-10px]">
            {selectedColleague.incenseLit && (
              <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 w-20 h-40 pointer-events-none">
                {/* Main smoke plume */}
                <motion.div
                  initial={{ opacity: 0, y: 0, scaleX: 1, filter: 'blur(2px)' }}
                  animate={{
                    opacity: [0, 0.8, 0.4, 0],
                    y: -140,
                    scaleX: [1, 3, 5],
                    x: [0, -15, 10, -5],
                    filter: ['blur(2px)', 'blur(4px)', 'blur(8px)']
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute bottom-10 left-1/2 w-[3px] h-[100px] bg-gradient-to-t from-transparent via-white/60 to-transparent rounded-full origin-bottom"
                />
                {/* Secondary wisps */}
                <motion.div
                  initial={{ opacity: 0, y: 0, scaleX: 1, filter: 'blur(2px)' }}
                  animate={{
                    opacity: [0, 0.6, 0.2, 0],
                    y: -160,
                    scaleX: [1, 4, 6],
                    x: [0, 20, -10, 5],
                    filter: ['blur(2px)', 'blur(5px)', 'blur(10px)']
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                  className="absolute bottom-10 left-1/2 w-[2px] h-[120px] bg-gradient-to-t from-transparent via-white/40 to-transparent rounded-full origin-bottom"
                />
                {/* Tertiary wisps */}
                <motion.div
                  initial={{ opacity: 0, y: 0, scaleX: 1, filter: 'blur(1px)' }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    y: -120,
                    scaleX: [1, 5],
                    x: [0, -25, 15],
                    filter: ['blur(1px)', 'blur(6px)']
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut", delay: 2.5 }}
                  className="absolute bottom-10 left-1/2 w-[2px] h-[90px] bg-gradient-to-t from-transparent via-white/30 to-transparent rounded-full origin-bottom"
                />
              </div>
            )}
            <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 w-[2px] h-16 bg-[#5c4d3c] origin-bottom">
              {selectedColleague.incenseLit && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-flame shadow-[0_0_12px_rgba(255,87,34,0.8)] animate-pulse"></div>
              )}
            </div>
            <div className="w-32 h-16 bg-[#8c8c82] rounded-full relative shadow-lg flex items-center justify-center overflow-hidden">
              <div className="w-24 h-12 bg-[#b8b8b0] rounded-full shadow-inner opacity-90 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ash/50 shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Offerings */}
          <div className="relative z-20 mb-[-5px]">
            <div className="w-24 h-8 bg-[#e6e2d6] rounded-[50%] relative shadow-md flex items-center justify-center border-t border-white/50">
              <div className="absolute -top-5 flex gap-[-5px]">
                {selectedColleague.offerings.map((offering, idx) => {
                  const config = offeringIcons[offering];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`w-8 h-8 ${config.bg} rounded-full shadow-sm relative -mr-2 flex items-center justify-center ${config.color} transform ${idx % 2 === 0 ? 'rotate-12' : '-rotate-6 z-10'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{config.icon}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Colleagues List */}
        <div className="w-full max-w-[300px] mt-6 mb-2">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x no-scrollbar px-2">
            {colleagues.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`snap-center shrink-0 w-14 h-20 rounded shadow-sm border flex flex-col items-center justify-center gap-1 relative overflow-hidden cursor-pointer transition-all ${selectedId === c.id ? 'bg-white border-primary/40' : 'bg-surface/80 border-ash/10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
              >
                <div className="w-7 h-7 rounded-full bg-ash/10 overflow-hidden shadow-sm flex items-center justify-center">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-ash text-[16px]">{c.icon}</span>
                  )}
                </div>
                <span className={`text-[11px] font-display ${selectedId === c.id ? 'font-bold text-ink' : 'font-medium text-ash'}`}>{c.name}</span>
              </div>
            ))}

            <Link to="/add" className="snap-center shrink-0 w-14 h-20 bg-surface/50 rounded shadow-sm border border-dashed border-ash/30 flex flex-col items-center justify-center gap-1 relative overflow-hidden opacity-50 hover:opacity-100 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-ash text-[20px]">add</span>
              <span className="text-[10px] font-sans font-medium text-ash">添置</span>
            </Link>
          </div>
        </div>
        <p className="text-ash/60 text-xs mt-2 font-sans tracking-widest uppercase">为Ta点一颗赛博焚香 纪念过去的美好岁月</p>
      </main>

      <div className="w-full flex flex-col items-center justify-center pb-8 px-6 mt-4">
        <button
          onClick={() => lightIncense(selectedColleague.id)}
          className="group relative w-full max-w-xs h-14 bg-primary-alt hover:bg-[#5e7610] rounded-full flex items-center justify-center gap-3 shadow-lg shadow-primary-alt/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-white/90">scene</span>
          <span className="text-white font-display font-bold text-lg tracking-widest">点一炷心香</span>
        </button>
        <div className="mt-6 flex gap-8">
          <button onClick={() => setShowMessage(true)} className="flex flex-col items-center gap-1 group text-ash hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full border border-ash/30 flex items-center justify-center bg-white/50 group-hover:border-primary/50 group-hover:bg-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <span className="text-xs font-medium tracking-wide">写别言</span>
          </button>
          <button onClick={() => setShowOffering(true)} className="flex flex-col items-center gap-1 group text-ash hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full border border-ash/30 flex items-center justify-center bg-white/50 group-hover:border-primary/50 group-hover:bg-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">card_giftcard</span>
            </div>
            <span className="text-xs font-medium tracking-wide">敬供品</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showOffering && <OfferingModal onClose={() => setShowOffering(false)} targetId={selectedColleague.id} />}
        {showMessage && <MessageModal onClose={() => setShowMessage(false)} targetId={selectedColleague.id} />}
      </AnimatePresence>
    </motion.div>
  );
}
