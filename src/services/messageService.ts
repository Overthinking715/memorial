import { supabase } from '../lib/supabaseClient';

export interface MessageData {
    id: string;
    colleagueId: string;
    content: string;
    author: string;
    deviceId: string;
    isPinned: boolean;
    createdAt: string;
}

interface MessageRow {
    id: string;
    colleague_id: string;
    content: string;
    author: string;
    device_id: string;
    is_pinned: boolean;
    created_at: string;
}

function rowToMessage(row: MessageRow): MessageData {
    return {
        id: row.id,
        colleagueId: row.colleague_id,
        content: row.content,
        author: row.author,
        deviceId: row.device_id || '',
        isPinned: row.is_pinned,
        createdAt: row.created_at,
    };
}

/**
 * 获取或生成设备唯一 ID（用于标识留言归属）
 */
export function getDeviceId(): string {
    const KEY = 'memorial_device_id';
    let id = localStorage.getItem(KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(KEY, id);
    }
    return id;
}

/**
 * 获取某位故交的所有留言
 */
export async function fetchMessages(colleagueId: string): Promise<MessageData[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('colleague_id', colleagueId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('获取留言失败:', error);
        throw error;
    }

    return (data as MessageRow[]).map(rowToMessage);
}

/**
 * 添加留言（附带设备 ID）
 */
export async function createMessage(
    colleagueId: string,
    content: string,
    author: string = '匿名'
): Promise<MessageData> {
    const deviceId = getDeviceId();
    const { data, error } = await supabase
        .from('messages')
        .insert({
            colleague_id: colleagueId,
            content,
            author,
            device_id: deviceId,
        })
        .select()
        .single();

    if (error) {
        console.error('添加留言失败:', error);
        throw error;
    }

    return rowToMessage(data as MessageRow);
}

/**
 * 编辑留言（只能编辑自己的）
 */
export async function updateMessage(
    id: string,
    content: string,
    author?: string
): Promise<MessageData> {
    const updates: Record<string, unknown> = { content };
    if (author !== undefined) updates.author = author;

    const { data, error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('编辑留言失败:', error);
        throw error;
    }

    return rowToMessage(data as MessageRow);
}

/**
 * 删除留言
 */
export async function deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('删除留言失败:', error);
        throw error;
    }
}
