import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

interface MessageModalProps {
  onClose: () => void;
  targetId?: string;
}

export default function MessageModal({ onClose, targetId }: MessageModalProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { addMessage, colleagues, selectedId } = useAppContext();

  const colleagueId = targetId || selectedId;
  const colleague = colleagues.find(c => c.id === colleagueId);

  const handleSend = async () => {
    if (!content.trim() || !colleagueId || sending) return;

    setSending(true);
    try {
      await addMessage(colleagueId, content.trim(), author.trim() || '匿名');
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error('发送留言失败:', err);
      setSending(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm" onClick={onClose}></div>

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full h-[100dvh] flex flex-col max-w-md mx-auto bg-background-light shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 z-0 pointer-events-none"></div>

        <header className="flex items-end justify-between px-6 pt-10 pb-4 z-10 shrink-0">
          <div className="flex flex-col space-y-1">
            <span className="text-ash text-xs tracking-widest uppercase opacity-80">Memorial Letter</span>
            <h1 className="font-display font-bold text-2xl text-ink tracking-tight flex items-center gap-2">
              致：<span className="border-b-2 border-primary/20 pb-1 px-1 min-w-[3rem]">{colleague?.name || '故人'}</span>
              <span className="material-symbols-outlined text-primary/60 text-[20px] align-middle">edit_note</span>
            </h1>
          </div>
          <button onClick={onClose} className="group p-2 rounded-full hover:bg-ash/10 transition-colors duration-300">
            <span className="material-symbols-outlined text-ash group-hover:text-primary transition-colors text-3xl">close</span>
          </button>
        </header>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2"></div>

        <main className="flex-1 relative px-6 py-4 overflow-hidden flex flex-col">
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 bg-surface/60 rounded-lg px-3 py-2 border border-ash/20">
              <span className="text-[10px] text-ash tracking-wider">署名：</span>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-display text-ink focus:ring-0 outline-none placeholder:text-ash/40 w-24"
                placeholder="匿名"
                type="text"
              />
            </div>
            <div className="flex flex-col items-center border border-ash/30 px-3 py-2 rounded-lg bg-white/40 rotate-1 backdrop-blur-sm shadow-sm">
              <span className="text-[10px] text-ash tracking-widest uppercase">
                {new Date().toLocaleString('en', { month: 'long' })}
              </span>
              <span className="font-display text-xl font-bold text-primary">
                {new Date().getDate()}
              </span>
              <span className="text-[10px] text-ash">{new Date().getFullYear()}</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 w-full h-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none bg-transparent border-none p-0 text-lg text-ink font-hand focus:ring-0 outline-none placeholder:text-ash/40 tracking-wide leading-10"
              style={{
                backgroundImage: 'linear-gradient(transparent 95%, #D6D2C4 95%)',
                backgroundSize: '100% 2.5rem',
                backgroundAttachment: 'local'
              }}
              placeholder={"山水一程，三生有幸...\n在此写下您的寄语，字句皆是心意。"}
              spellCheck="false"
            ></textarea>
          </div>
        </main>

        <footer className="relative z-20 px-6 pb-10 pt-4 bg-gradient-to-t from-background-light via-background-light/95 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
              <span className="material-symbols-outlined text-xl">format_quote</span>
            </button>
            <div className="h-4 w-px bg-ash/30"></div>
            <div className="text-ash text-xs">
              {content.length > 0 ? `${content.length} 字` : ''}
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!content.trim() || sending}
            className="group relative"
          >
            <div className={`absolute inset-0 blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl ${!content.trim() || sending ? 'bg-ash' : 'bg-seal'}`}></div>
            <div className={`relative text-white w-16 h-16 rounded-xl shadow-seal flex flex-col items-center justify-center transform group-hover:scale-105 group-active:scale-95 transition-all duration-300 border-2 ${!content.trim() || sending
                ? 'bg-ash/50 border-ash/30 cursor-not-allowed'
                : sent
                  ? 'bg-primary border-primary-dark/50'
                  : 'bg-seal border-[#B87A74]'
              }`}>
              <div className="border border-white/30 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-lg flex items-center justify-center">
                {sending ? (
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                ) : sent ? (
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                ) : (
                  <span className="font-display font-bold text-2xl writing-vertical-rl">封缄</span>
                )}
              </div>
            </div>
          </button>
        </footer>
      </motion.div>
    </div>
  );

  // 确保只能在客户端渲染（防止 body 在某些服务端渲染场景下未定义）
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
