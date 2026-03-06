import { supabase } from '../lib/supabaseClient';

export interface MessageData {
    id: string;
    colleagueId: string;
    content: string;
    author: string;
    isPinned: boolean;
    createdAt: string;
}

interface MessageRow {
    id: string;
    colleague_id: string;
    content: string;
    author: string;
    is_pinned: boolean;
    created_at: string;
}

function rowToMessage(row: MessageRow): MessageData {
    return {
        id: row.id,
        colleagueId: row.colleague_id,
        content: row.content,
        author: row.author,
        isPinned: row.is_pinned,
        createdAt: row.created_at,
    };
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
 * 添加留言
 */
export async function createMessage(
    colleagueId: string,
    content: string,
    author: string = '匿名'
): Promise<MessageData> {
    const { data, error } = await supabase
        .from('messages')
        .insert({
            colleague_id: colleagueId,
            content,
            author,
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
