import { supabase } from '../lib/supabaseClient';
import type { OfferingType } from '../context/AppContext';
import { getDeviceId } from './messageService';

// 数据库行类型（snake_case）
export interface ColleagueRow {
    id: string;
    name: string;
    title: string;
    years: string;
    icon: string;
    photo_url: string;
    offerings: string[];
    incense_lit: boolean;
    device_id: string;
    created_at: string;
    updated_at: string;
}

// 前端用的驼峰类型
export interface ColleagueData {
    id: string;
    name: string;
    title: string;
    years: string;
    icon: string;
    photoUrl: string;
    offerings: OfferingType[];
    incenseLit: boolean;
    deviceId: string;
}

// 数据库行 → 前端数据 转换
function rowToColleague(row: ColleagueRow): ColleagueData {
    return {
        id: row.id,
        name: row.name,
        title: row.title,
        years: row.years,
        icon: row.icon,
        photoUrl: row.photo_url,
        offerings: (row.offerings || []) as OfferingType[],
        incenseLit: row.incense_lit,
        deviceId: row.device_id || '',
    };
}

// 前端数据 → 数据库行 转换
function colleagueToRow(data: Partial<ColleagueData>): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (data.name !== undefined) row.name = data.name;
    if (data.title !== undefined) row.title = data.title;
    if (data.years !== undefined) row.years = data.years;
    if (data.icon !== undefined) row.icon = data.icon;
    if (data.photoUrl !== undefined) row.photo_url = data.photoUrl;
    if (data.offerings !== undefined) row.offerings = data.offerings;
    if (data.incenseLit !== undefined) row.incense_lit = data.incenseLit;
    if (data.deviceId !== undefined) row.device_id = data.deviceId;
    return row;
}

/**
 * 获取所有故交
 */
export async function fetchColleagues(): Promise<ColleagueData[]> {
    const { data, error } = await supabase
        .from('colleagues')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('获取故交列表失败:', error);
        throw error;
    }

    return (data as ColleagueRow[]).map(rowToColleague);
}

/**
 * 新增故交
 */
export async function createColleague(
    colleague: Omit<ColleagueData, 'id' | 'deviceId'>
): Promise<ColleagueData> {
    const row = colleagueToRow({ ...colleague, deviceId: getDeviceId() });
    const { data, error } = await supabase
        .from('colleagues')
        .insert(row)
        .select()
        .single();

    if (error) {
        console.error('新增故交失败:', error);
        throw error;
    }

    return rowToColleague(data as ColleagueRow);
}

/**
 * 更新故交信息
 */
export async function updateColleagueById(
    id: string,
    updates: Partial<ColleagueData>
): Promise<ColleagueData> {
    const row = colleagueToRow(updates);
    const { data, error } = await supabase
        .from('colleagues')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('更新故交失败:', error);
        throw error;
    }

    return rowToColleague(data as ColleagueRow);
}

/**
 * 删除故交
 */
export async function deleteColleagueById(id: string): Promise<void> {
    const { error } = await supabase
        .from('colleagues')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('删除故交失败:', error);
        throw error;
    }
}

/**
 * 添加供品
 */
export async function addOfferingToColleague(
    id: string,
    offering: OfferingType,
    currentOfferings: OfferingType[]
): Promise<OfferingType[]> {
    const newOfferings = [...currentOfferings, offering];
    const { error } = await supabase
        .from('colleagues')
        .update({ offerings: newOfferings })
        .eq('id', id);

    if (error) {
        console.error('添加供品失败:', error);
        throw error;
    }

    return newOfferings;
}

/**
 * 点燃心香
 */
export async function lightIncenseForColleague(id: string): Promise<void> {
    const { error } = await supabase
        .from('colleagues')
        .update({ incense_lit: true })
        .eq('id', id);

    if (error) {
        console.error('点香失败:', error);
        throw error;
    }
}
