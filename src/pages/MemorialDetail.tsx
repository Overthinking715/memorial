import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import OfferingModal from '../components/OfferingModal';
import MessageModal from '../components/MessageModal';
import { useAppContext } from '../context/AppContext';

export default function MemorialDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { colleagues, messages, messagesLoading, fetchMessages } = useAppContext();

  const [showOffering, setShowOffering] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [animatingLikes, setAnimatingLikes] = useState<Set<string>>(new Set());

  const colleague = colleagues.find(c => c.id === id);

  // 加载该故交的留言
  useEffect(() => {
    if (id) {
      fetchMessages(id);
    }
  }, [id, fetchMessages]);

  // 供品关闭时刷新（温度会因 offerings 变化而更新）
  const handleOfferingClose = () => {
    setShowOffering(false);
  };

  // 当留言模态框关闭时，刷新留言列表
  const handleMessageClose = () => {
    setShowMessage(false);
    if (id) {
      fetchMessages(id);
    }
  };

  // 点赞动效
  const handleLike = (msgId: string) => {
    const newLiked = new Set(likedMessages);
    if (newLiked.has(msgId)) {
      newLiked.delete(msgId);
    } else {
      newLiked.add(msgId);
      // 触发弹跳动画
      setAnimatingLikes(prev => new Set(prev).add(msgId));
      setTimeout(() => {
        setAnimatingLikes(prev => {
          const next = new Set(prev);
          next.delete(msgId);
          return next;
        });
      }, 600);
    }
    setLikedMessages(newLiked);
  };

  if (!colleague) {
    return (
      <div className="flex flex-col h-screen w-full bg-background-light font-sans text-ink items-center justify-center">
        <p className="text-ash">未找到该印记</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary underline">返回</button>
      </div>
    );
  }

  // 共燃温情：基于供品数量动态计算，0 起步，每个供品 +7°C，上限 100
  const warmth = Math.min(colleague.offerings.length * 7, 100);
  const warmthPercent = warmth; // 直接用作进度条百分比

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-screen w-full bg-background-light font-sans text-ink overflow-hidden relative"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background-light/80 backdrop-blur-md border-b border-paper-stroke/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface/50 text-ink active:scale-95 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-display font-bold text-ink opacity-90 tracking-widest">职场印记</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface/50 text-ink active:scale-95 transition-transform">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative z-10">
        <div className="px-5 pt-6 pb-2">
          <div className="relative bg-surface rounded-xl p-1 shadow-float overflow-hidden group transition-all duration-500 hover:shadow-lg">
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            <div className="relative flex flex-col items-center pt-8 pb-6 px-4 bg-white/40 border border-white/50 rounded-lg backdrop-blur-sm">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-soft overflow-hidden flex items-center justify-center bg-ash/10">
                  {colleague.photoUrl ? (
                    <img src={colleague.photoUrl} alt="Avatar" className="w-full h-full object-cover filter sepia-[0.2] contrast-[0.9]" />
                  ) : (
                    <span className="material-symbols-outlined text-[48px] text-ash">{colleague.icon}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-paper-stroke">
                  <div className="bg-[#A65D57] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-inner">
                    <span className="material-symbols-outlined text-[12px]">award_star</span>
                    <span>项目元老</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold text-ink mb-1 tracking-tight">{colleague.name}</h2>
              <p className="text-primary font-sans text-sm font-medium mb-4">{colleague.title}</p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                <div className="bg-background-light/60 rounded-lg p-2 text-center border border-paper-stroke/50">
                  <p className="text-[10px] text-ash uppercase tracking-wider mb-0.5">同行时光</p>
                  <p className="font-display font-bold text-ink text-base">{colleague.years}</p>
                </div>
                <div className="bg-background-light/60 rounded-lg p-2 text-center border border-paper-stroke/50 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 h-1 bg-flame/20 w-full">
                    <motion.div
                      className="h-full bg-flame rounded-r-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${warmthPercent}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                  <p className="text-[10px] text-ash uppercase tracking-wider mb-0.5">共燃温情</p>
                  <p className="font-display font-bold text-flame text-base flex justify-center items-center gap-1">
                    <motion.span
                      key={warmth}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {warmth}°C
                    </motion.span>
                    {warmth > 0 && (
                      <span className="material-symbols-outlined text-[14px] animate-pulse">local_fire_department</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30"></div>
          <span className="mx-3 text-xs font-display text-primary/80 italic">
            留声 · 寄语 ({messagesLoading ? '...' : messages.length})
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30"></div>
        </div>

        <div className="px-4 pb-8 columns-2 gap-4 space-y-4">
          {messagesLoading ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12">
              <span className="material-symbols-outlined text-primary animate-spin text-3xl">progress_activity</span>
              <p className="text-ash text-sm mt-3">加载留言中...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="break-inside-avoid bg-white/50 rounded-lg p-6 shadow-soft border border-paper-stroke text-center col-span-2">
              <span className="material-symbols-outlined text-ash/30 text-4xl mb-2">mail</span>
              <p className="text-ash text-sm">还没有留言，做第一个送上祝福的人吧。</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isLiked = likedMessages.has(msg.id);
              const isAnimating = animatingLikes.has(msg.id);
              return (
                <div
                  key={msg.id}
                  className={`break-inside-avoid rounded-lg p-4 shadow-soft border hover:-translate-y-1 transition-transform duration-300 relative cursor-pointer ${msg.isPinned
                      ? 'bg-[#FAF8F3] border-flame/20 shadow-float'
                      : 'bg-white border-paper-stroke'
                    }`}
                >
                  {msg.isPinned && (
                    <span className="absolute -top-1.5 right-4 text-flame rotate-12">
                      <span className="material-symbols-outlined text-[16px] bg-white rounded-full p-0.5 border border-flame/20">push_pin</span>
                    </span>
                  )}
                  {idx === 0 && !msg.isPinned && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 rounded-t-lg"></div>
                  )}
                  <p className={`text-ink text-sm leading-relaxed mb-3 ${msg.isPinned ? 'font-hand text-xl leading-normal' : 'font-display'}`}>
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between border-t border-paper-stroke/30 pt-2">
                    <span className="text-[10px] text-ash font-medium">
                      {msg.author} · {formatDate(msg.createdAt)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(msg.id); }}
                      className="relative group/like p-1 -m-1 rounded-full hover:bg-flame/5 transition-colors"
                    >
                      <motion.span
                        className={`material-symbols-outlined text-[16px] transition-colors duration-300 ${isLiked ? 'text-flame' : 'text-ash/30 group-hover/like:text-flame/60'
                          }`}
                        style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                        animate={isAnimating ? {
                          scale: [1, 1.6, 0.9, 1.2, 1],
                        } : { scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        favorite
                      </motion.span>
                      {/* 点赞粒子效果 */}
                      <AnimatePresence>
                        {isAnimating && (
                          <>
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-flame"
                                style={{ top: '50%', left: '50%' }}
                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                animate={{
                                  scale: [0, 1, 0],
                                  x: Math.cos((i * 60 * Math.PI) / 180) * 16,
                                  y: Math.sin((i * 60 * Math.PI) / 180) * 16,
                                  opacity: [1, 1, 0],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-center pb-8 pt-2">
          <span className="material-symbols-outlined text-ash/30 text-xl">more_horiz</span>
        </div>
      </main>

      {/* 底部操作栏：精简为「说点什么」输入框 + 一个「送出心意」按钮 */}
      <div className="absolute bottom-0 left-0 w-full bg-background-light/95 backdrop-blur-xl border-t border-paper-stroke px-4 py-3 pb-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div onClick={() => setShowMessage(true)} className="flex-1 bg-surface/60 rounded-full h-12 flex items-center px-5 shadow-inner-pressed border border-transparent focus-within:border-primary/30 transition-colors cursor-text">
            <span className="material-symbols-outlined text-ash/60 mr-2 text-[20px]">edit</span>
            <span className="text-ash/60 text-sm font-medium">说点什么...</span>
          </div>
          <button
            onClick={() => setShowOffering(true)}
            className="h-12 px-5 rounded-full flex items-center justify-center gap-2 bg-primary text-white shadow-lg hover:bg-primary-dark active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
            <span className="font-display font-bold text-sm tracking-wider whitespace-nowrap">送出心意</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showOffering && <OfferingModal onClose={handleOfferingClose} targetId={colleague.id} />}
        {showMessage && <MessageModal onClose={handleMessageClose} targetId={colleague.id} />}
      </AnimatePresence>
    </motion.div>
  );
}
