import { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext, OfferingType } from '../context/AppContext';

const offeringsList: { type: OfferingType; name: string; desc: string; icon: string }[] = [
  { type: 'flower', name: '白菊', desc: '君子之交', icon: 'local_florist' },
  { type: 'orange', name: '甜橙', desc: '前程似锦', icon: 'nutrition' },
  { type: 'coffee', name: '热咖', desc: '感谢相伴', icon: 'coffee' },
  { type: 'plant', name: '多肉', desc: '坚韧常在', icon: 'potted_plant' },
  { type: 'tea', name: '清茶', desc: '淡泊明志', icon: 'emoji_food_beverage' },
  { type: 'candle', name: '烛火', desc: '薪火相传', icon: 'candle' },
];

export default function OfferingModal({ onClose, targetId }: { onClose: () => void, targetId: string }) {
  const [selectedOffering, setSelectedOffering] = useState<OfferingType | null>(null);
  const [isOffering, setIsOffering] = useState(false);
  const { addOffering } = useAppContext();

  const handleOffer = () => {
    if (selectedOffering && targetId) {
      setIsOffering(true);
      // Add a slight delay for the animation to play before closing
      setTimeout(async () => {
        await addOffering(targetId, selectedOffering);
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm" onClick={onClose}></div>

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-background-light rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex-none pt-5 pb-2 flex justify-center w-full cursor-grab active:cursor-grabbing" onClick={onClose}>
          <div className="h-1.5 w-12 rounded-full bg-ash/30"></div>
        </div>

        <div className="flex-none px-8 pb-4 text-center">
          <h2 className="font-display text-ink text-[28px] font-bold tracking-tight leading-tight">选择一份心意</h2>
          <p className="font-display text-ash text-sm mt-1 italic opacity-80">寄托思念，温润如初</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-2">
          <div className="grid grid-cols-2 gap-4 pb-24">
            {offeringsList.map((offering) => {
              const isSelected = selectedOffering === offering.type;
              return (
                <button
                  key={offering.type}
                  onClick={() => setSelectedOffering(offering.type)}
                  className={`group relative flex flex-col items-center p-5 rounded-2xl bg-white transition-all duration-300 shadow-sm ${isSelected
                      ? 'border-2 border-flame shadow-glow transform scale-[1.02]'
                      : 'border border-[#EBE6DA] hover:border-primary/50'
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-flame animate-pulse">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div className={`h-16 w-16 mb-3 rounded-full flex items-center justify-center transition-transform duration-300 ${isSelected ? 'bg-flame/10' : 'bg-background-light group-hover:scale-105'
                    }`}>
                    <span
                      className={`material-symbols-outlined text-[32px] transition-colors ${isSelected ? 'text-flame' : 'text-ash group-hover:text-primary'
                        }`}
                      style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {offering.icon}
                    </span>
                  </div>
                  <span className="font-display text-lg text-ink font-bold mb-1">{offering.name}</span>
                  <span className={`font-sans text-xs ${isSelected ? 'text-flame font-medium' : 'text-ash/80'}`}>
                    {offering.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background-light via-background-light to-transparent pt-12 pb-8 px-6">
          <button
            onClick={handleOffer}
            disabled={!selectedOffering || isOffering}
            className={`relative w-full h-14 rounded-full shadow-lg flex items-center justify-center gap-2 text-white transition-all duration-300 group overflow-hidden ${selectedOffering
                ? 'bg-primary-alt hover:bg-[#5e7610] active:scale-[0.98] shadow-primary-alt/30'
                : 'bg-ash/50 cursor-not-allowed'
              }`}
          >
            {isOffering && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/30 skew-x-12"
              />
            )}
            <motion.span
              animate={isOffering ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
              className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform"
            >
              flight_takeoff
            </motion.span>
            <motion.span
              animate={isOffering ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
              className="font-display font-bold text-lg tracking-wide"
            >
              敬奉案头
            </motion.span>

            {isOffering && (
              <motion.span
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute font-display font-bold text-lg tracking-widest"
              >
                心意已达
              </motion.span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
