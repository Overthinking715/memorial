import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as colleagueService from '../services/colleagueService';
import * as messageService from '../services/messageService';
import { uploadPhoto } from '../services/storageService';

export type OfferingType = 'flower' | 'orange' | 'coffee' | 'plant' | 'tea' | 'candle';

export interface Colleague {
  id: string;
  name: string;
  title: string;
  years: string;
  icon: string;
  photoUrl: string;
  offerings: OfferingType[];
  incenseLit: boolean;
}

export interface Message {
  id: string;
  colleagueId: string;
  content: string;
  author: string;
  deviceId: string;
  isPinned: boolean;
  createdAt: string;
}

interface AppState {
  // 故交数据
  colleagues: Colleague[];
  loading: boolean;
  error: string | null;
  addColleague: (c: Omit<Colleague, 'id'>) => Promise<Colleague | undefined>;
  updateColleague: (id: string, updates: Partial<Colleague>) => Promise<void>;
  deleteColleague: (id: string) => Promise<void>;
  selectedId: string;
  setSelectedId: (id: string) => void;
  addOffering: (id: string, offering: OfferingType) => Promise<void>;
  lightIncense: (id: string) => Promise<void>;
  // 留言数据
  messages: Message[];
  messagesLoading: boolean;
  fetchMessages: (colleagueId: string) => Promise<void>;
  addMessage: (colleagueId: string, content: string, author?: string) => Promise<void>;
  editMessage: (id: string, content: string, author?: string) => Promise<void>;
  removeMessage: (id: string) => Promise<void>;
  // 设备 ID
  deviceId: string;
  // 图片上传
  uploadColleaguePhoto: (file: File) => Promise<string>;
}

export const AppContext = createContext<AppState>({} as AppState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // 获取当前设备 ID
  const deviceId = messageService.getDeviceId();

  // 初始化：加载所有故交数据
  useEffect(() => {
    async function loadColleagues() {
      try {
        setLoading(true);
        setError(null);
        const data = await colleagueService.fetchColleagues();
        setColleagues(data);
        // 自动选中第一位
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('数据加载失败，请检查网络和 Supabase 配置');
      } finally {
        setLoading(false);
      }
    }
    loadColleagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新增故交
  const addColleague = useCallback(async (c: Omit<Colleague, 'id'>): Promise<Colleague | undefined> => {
    try {
      const newColleague = await colleagueService.createColleague(c);
      setColleagues(prev => [...prev, newColleague]);
      return newColleague;
    } catch (err) {
      console.error('新增失败:', err);
      setError('新增故交失败');
      return undefined;
    }
  }, []);

  // 更新故交
  const updateColleague = useCallback(async (id: string, updates: Partial<Colleague>) => {
    try {
      const updated = await colleagueService.updateColleagueById(id, updates);
      setColleagues(prev => prev.map(c => c.id === id ? updated : c));
    } catch (err) {
      console.error('更新失败:', err);
      setError('更新故交信息失败');
    }
  }, []);

  // 删除故交
  const deleteColleague = useCallback(async (id: string) => {
    try {
      await colleagueService.deleteColleagueById(id);
      setColleagues(prev => prev.filter(c => c.id !== id));
      if (selectedId === id) {
        setSelectedId(colleagues.find(c => c.id !== id)?.id || '');
      }
    } catch (err) {
      console.error('删除失败:', err);
      setError('删除故交失败');
    }
  }, [selectedId, colleagues]);

  // 添加供品（乐观更新：先更新 UI，再同步到后端）
  const addOffering = useCallback(async (id: string, offering: OfferingType) => {
    const colleague = colleagues.find(c => c.id === id);
    if (!colleague) return;
    const newOfferings = [...colleague.offerings, offering] as OfferingType[];
    // 立即更新 UI
    setColleagues(prev => prev.map(c =>
      c.id === id ? { ...c, offerings: newOfferings } : c
    ));
    // 后台同步到 Supabase
    try {
      await colleagueService.addOfferingToColleague(id, offering, colleague.offerings);
    } catch (err) {
      console.error('添加供品失败:', err);
      // 回滚
      setColleagues(prev => prev.map(c =>
        c.id === id ? { ...c, offerings: colleague.offerings } : c
      ));
    }
  }, [colleagues]);

  // 点燃心香（乐观更新：先更新 UI，再同步到后端）
  const lightIncense = useCallback(async (id: string) => {
    // 立即更新 UI
    setColleagues(prev => prev.map(c =>
      c.id === id ? { ...c, incenseLit: true } : c
    ));
    // 后台同步到 Supabase
    try {
      await colleagueService.lightIncenseForColleague(id);
    } catch (err) {
      console.error('点香失败:', err);
      // 回滚
      setColleagues(prev => prev.map(c =>
        c.id === id ? { ...c, incenseLit: false } : c
      ));
    }
  }, []);

  // 获取留言
  const fetchMessagesForColleague = useCallback(async (colleagueId: string) => {
    try {
      setMessagesLoading(true);
      const data = await messageService.fetchMessages(colleagueId);
      setMessages(data);
    } catch (err) {
      console.error('获取留言失败:', err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // 添加留言
  const addMessage = useCallback(async (colleagueId: string, content: string, author: string = '匿名') => {
    try {
      const newMsg = await messageService.createMessage(colleagueId, content, author);
      setMessages(prev => [newMsg, ...prev]);
    } catch (err) {
      console.error('添加留言失败:', err);
    }
  }, []);

  // 编辑留言
  const editMessage = useCallback(async (id: string, content: string, author?: string) => {
    try {
      const updated = await messageService.updateMessage(id, content, author);
      setMessages(prev => prev.map(m => m.id === id ? updated : m));
    } catch (err) {
      console.error('编辑留言失败:', err);
    }
  }, []);

  // 删除留言
  const removeMessage = useCallback(async (id: string) => {
    try {
      await messageService.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('删除留言失败:', err);
    }
  }, []);

  // 上传照片
  const uploadColleaguePhoto = useCallback(async (file: File): Promise<string> => {
    return await uploadPhoto(file);
  }, []);

  return (
    <AppContext.Provider value={{
      colleagues, loading, error,
      addColleague, updateColleague, deleteColleague,
      selectedId, setSelectedId,
      addOffering, lightIncense,
      messages, messagesLoading,
      fetchMessages: fetchMessagesForColleague, addMessage,
      editMessage, removeMessage,
      deviceId,
      uploadColleaguePhoto,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
