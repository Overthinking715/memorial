import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';

const availableIcons = [
  { name: '钢笔', icon: 'ink_pen' },
  { name: '经典马克杯', icon: 'coffee_maker' },
  { name: '桌面时钟', icon: 'desk' },
  { name: '机械键盘', icon: 'keyboard' },
  { name: '专业手册', icon: 'menu_book' },
  { name: '降噪耳机', icon: 'headset_mic' },
];

export default function AddMemorial() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addColleague, updateColleague, colleagues, uploadColleaguePhoto } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('ink_pen');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const colleague = colleagues.find(c => c.id === id);
      if (colleague) {
        setName(colleague.name);
        setTitle(colleague.title);
        // 兼容旧格式 "2018-2023" 和新格式 "2018-03-15~2023-06-30"
        if (colleague.years.includes('~')) {
          const [start, end] = colleague.years.split('~');
          setStartDate(start || '');
          setEndDate(end || '');
        } else {
          const [start, end] = colleague.years.split('-');
          // 旧格式只有年份，补全为该年 1 月 1 日
          setStartDate(start ? `${start}-01-01` : '');
          setEndDate(end ? `${end}-01-01` : '');
        }
        setSelectedIcon(colleague.icon);
        setPhotoUrl(colleague.photoUrl);
      }
    }
  }, [id, colleagues, isEditing]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadColleaguePhoto(file);
      setPhotoUrl(url);
    } catch (err) {
      console.error('照片上传失败:', err);
      // Fallback to base64 if storage upload fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !title || saving) return;

    // 用 ~ 分隔日期，避免与日期中的 - 冲突
    const yearsValue = `${startDate}~${endDate}`;

    setSaving(true);
    try {
      if (isEditing) {
        await updateColleague(id, {
          name,
          title,
          years: yearsValue,
          icon: selectedIcon,
          photoUrl
        });
        navigate('/manage');
      } else {
        await addColleague({
          name,
          title,
          years: yearsValue,
          icon: selectedIcon,
          photoUrl,
          offerings: [],
          incenseLit: false
        });
        navigate('/hub');
      }
    } catch (err) {
      console.error('保存失败:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-screen w-full bg-background-light font-sans text-ink overflow-hidden relative"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      <header className="flex items-center justify-between px-6 pt-14 pb-4 bg-background-light z-20 sticky top-0">
        <button onClick={() => navigate(-1)} className="text-ink h-10 w-10 flex items-center justify-center rounded-full active:bg-ash/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-display text-xl font-bold tracking-wider">{isEditing ? '修改印记' : '立碑记印'}</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 relative z-10">
        <div className="flex justify-center mt-6 mb-8">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-32 h-40 rounded-lg bg-surface border border-ash/30 shadow-inner-pressed flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary animate-spin text-3xl">progress_activity</span>
                <span className="text-xs text-ash">上传中...</span>
              </div>
            ) : photoUrl ? (
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover filter sepia-[0.2] contrast-[0.9]" />
            ) : (
              <>
                <span className="material-symbols-outlined text-ash text-4xl">add_photo_alternate</span>
                <span className="text-xs text-ash mt-2">上传照片</span>
              </>
            )}
            <div className="absolute bottom-2 right-2 bg-background-light/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-ash/20 pb-2">
            <label className="block font-display text-xs text-ash mb-1 tracking-widest uppercase">姓名</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-none p-0 text-lg font-display text-ink focus:ring-0 outline-none placeholder:text-ash/50"
              placeholder="输入同事姓名"
              type="text"
            />
          </div>
          <div className="border-b border-ash/20 pb-2">
            <label className="block font-display text-xs text-ash mb-1 tracking-widest uppercase">职衔</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none p-0 text-lg font-display text-ink focus:ring-0 outline-none placeholder:text-ash/50"
              placeholder="例如：资深架构师"
              type="text"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 border-b border-ash/20 pb-2">
              <label className="block font-display text-xs text-ash mb-1 tracking-widest uppercase">入职日期</label>
              <input
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-base font-display text-ink focus:ring-0 outline-none placeholder:text-ash/50"
                type="date"
              />
            </div>
            <div className="flex-1 border-b border-ash/20 pb-2">
              <label className="block font-display text-xs text-ash mb-1 tracking-widest uppercase">离职日期</label>
              <input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-base font-display text-ink focus:ring-0 outline-none placeholder:text-ash/50"
                type="date"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-lg text-ink font-bold mb-4">代表器物</h2>
          <p className="font-sans text-xs text-ash mb-4">选择一件物品来象征他/她的职业精神</p>
          <div className="grid grid-cols-3 gap-3">
            {availableIcons.map((item, i) => {
              const isSelected = selectedIcon === item.icon;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedIcon(item.icon)}
                  className={`relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${isSelected
                    ? 'bg-surface border-2 border-primary shadow-soft-lift'
                    : 'bg-surface border border-transparent hover:border-ash/30'
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-primary">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div className="h-12 w-12 mb-2 rounded-full bg-background-light flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[28px] ${isSelected ? 'text-primary' : 'text-ash'}`}>{item.icon}</span>
                  </div>
                  <span className="font-display text-sm text-ink font-bold">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background-light via-background-light to-transparent pt-12 pb-8 px-6 z-30">
        <button
          onClick={handleSave}
          disabled={!name || !title || saving}
          className={`w-full h-14 rounded-full shadow-lg flex items-center justify-center gap-2 text-white transition-all duration-300 ${name && title && !saving
            ? 'bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-primary/30'
            : 'bg-ash/50 cursor-not-allowed'
            }`}
        >
          {saving ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : null}
          <span className="font-display font-bold text-lg tracking-widest">
            {saving ? '保存中...' : (isEditing ? '保存修改' : '建立印记')}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
