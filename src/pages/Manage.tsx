import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

// 格式化 years 字段显示
function formatYears(years: string): string {
  if (years.includes('~')) {
    const [start, end] = years.split('~');
    const fmtDate = (d: string) => d.replace(/-/g, '.');
    return `${fmtDate(start)} - ${fmtDate(end)}`;
  }
  return years; // 旧格式直接显示
}

export default function Manage() {
  const navigate = useNavigate();
  const { colleagues, deleteColleague, deviceId } = useAppContext();
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleagues = colleagues.filter(c =>
    c.name.includes(searchQuery) || c.title.includes(searchQuery)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-screen w-full bg-background-light font-sans text-ink overflow-hidden relative"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      <header className="flex items-center justify-between px-6 pt-14 pb-4 bg-background-light/90 backdrop-blur z-20 sticky top-0 border-b border-ash/10">
        <button onClick={() => navigate(-1)} className="text-ink h-10 w-10 flex items-center justify-center rounded-full active:bg-ash/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-display text-xl font-bold tracking-wider">管理故交</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-4">
        <div className="flex items-center bg-surface border border-ash/20 rounded-lg px-4 py-2.5 shadow-inner-pressed">
          <span className="material-symbols-outlined text-ash mr-2 text-[20px]">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-sm font-sans text-ink focus:ring-0 outline-none placeholder:text-ash"
            placeholder="寻觅故人姓名或印记..."
            type="text"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 relative z-10">
        <div className="space-y-1 mt-2">
          <AnimatePresence>
            {filteredColleagues.map((item, i) => {
              const isOwn = item.deviceId === deviceId;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden border-b border-ash/20"
                >
                  {isOwn && (
                    <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 gap-4">
                      <Link to={`/edit/${item.id}`} className="flex flex-col items-center justify-center text-ash hover:text-ink transition-colors">
                        <span className="material-symbols-outlined text-[22px]">edit</span>
                        <span className="text-[10px] mt-1">编辑</span>
                      </Link>
                      <button
                        onClick={() => deleteColleague(item.id)}
                        className="flex flex-col items-center justify-center text-ash hover:text-flame transition-colors"
                      >
                        <span className="material-symbols-outlined text-[22px]">delete</span>
                        <span className="text-[10px] mt-1">删除</span>
                      </button>
                    </div>
                  )}
                  <motion.div
                    drag={isOwn ? "x" : false}
                    dragConstraints={{ left: -120, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, info) => {
                      if (isOwn && info.offset.x < -50) {
                        setSwipedId(item.id);
                      } else {
                        setSwipedId(null);
                      }
                    }}
                    animate={{ x: swipedId === item.id ? -120 : 0 }}
                    className="relative bg-background-light z-10 flex items-center py-4 px-2"
                  >
                    <div className="h-12 w-12 rounded-full bg-surface border border-ash/20 flex items-center justify-center shadow-soft-lift mr-4 overflow-hidden">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} className="w-full h-full object-cover filter sepia-[0.2] contrast-[0.9]" />
                      ) : (
                        <span className={`material-symbols-outlined text-[24px] ${i === 0 ? 'text-primary' : 'text-ash'}`}>{item.icon}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-medium text-ink tracking-wide">{item.name}</h3>
                      <p className="font-sans text-xs text-ash mt-0.5">{item.title} · {formatYears(item.years)}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background-light via-background-light/90 to-transparent pt-16 pb-10 px-6 z-30 flex justify-center pointer-events-none">
        <Link to="/add" className="pointer-events-auto h-16 w-16 bg-primary hover:bg-primary-dark active:scale-95 flex items-center justify-center text-background-light transition-transform duration-300 shadow-seal border border-primary-dark/50 rounded-xl">
          <span className="material-symbols-outlined text-[32px] font-light">add</span>
        </Link>
      </div>
    </motion.div>
  );
}
