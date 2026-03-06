import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export default function Hub() {
  const { colleagues } = useAppContext();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleagues = colleagues.filter(c => 
    c.name.includes(searchQuery) || c.title.includes(searchQuery)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="min-h-full flex flex-col relative"
    >
      <header className="flex items-center justify-between px-6 pt-14 pb-4 bg-background-light/90 backdrop-blur-md z-20 sticky top-0 border-b border-ash/10">
        <AnimatePresence mode="wait">
          {!isSearching ? (
            <motion.div 
              key="title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center justify-between w-full"
            >
              <div className="w-10"></div>
              <h1 className="font-display text-xl font-bold tracking-widest text-ink">印记馆</h1>
              <div className="w-10 flex justify-end">
                <button 
                  onClick={() => setIsSearching(true)}
                  className="text-ink h-10 w-10 flex items-center justify-center rounded-full active:bg-ash/10 transition-colors"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center w-full bg-surface border border-ash/20 rounded-full px-4 py-1.5 shadow-inner-pressed"
            >
              <span className="material-symbols-outlined text-ash mr-2 text-[20px]">search</span>
              <input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none p-0 text-sm font-sans text-ink focus:ring-0 outline-none placeholder:text-ash" 
                placeholder="寻觅故人姓名或印记..." 
                type="text" 
              />
              <button 
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className="text-ash hover:text-ink ml-2"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 px-6 pb-8 pt-6">
        <div className="grid grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredColleagues.map((colleague, index) => (
              <motion.div
                key={colleague.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to={`/memorial/${colleague.id}`} 
                  className="relative bg-surface rounded-xl shadow-soft-lift flex flex-col items-center justify-center h-64 group overflow-hidden border border-ash/20 cursor-pointer transition-transform duration-300 active:scale-95"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_70%)] opacity-80 mix-blend-overlay"></div>
                  <div className="absolute left-4 top-4 bottom-4 flex items-center justify-center z-10">
                    <span className="font-sans text-[11px] text-ash tracking-[0.3em] writing-vertical-rl">{colleague.title}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center relative z-10 w-full pl-6">
                    <span className="material-symbols-outlined text-[56px] text-primary/80 drop-shadow-md group-hover:-translate-y-1 transition-all duration-500">{colleague.icon}</span>
                  </div>
                  <div className="absolute right-4 top-4 bottom-4 flex items-center justify-center z-10">
                    <span className="font-display text-xl text-ink font-bold tracking-widest writing-vertical-rl">{colleague.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isSearching && (
            <Link to="/add" className="relative bg-transparent rounded-xl flex flex-col items-center justify-center h-64 border border-dashed border-ash/40 hover:bg-ash/5 cursor-pointer transition-colors duration-300 active:bg-ash/10">
              <div className="h-14 w-14 rounded-full border border-ash/30 flex items-center justify-center bg-background-light shadow-inner-pressed">
                <span className="material-symbols-outlined text-[28px] text-ash/80">add</span>
              </div>
              <span className="mt-4 font-display text-xs text-ash/80 tracking-widest">建立新印记</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
