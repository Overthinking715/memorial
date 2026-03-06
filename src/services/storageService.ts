import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'photos';

/**
 * 上传照片到 Supabase Storage
 * @param file - 图片文件
 * @returns 图片的公开 URL
 */
export async function uploadPhoto(file: File): Promise<string> {
    // 生成唯一文件名
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `colleagues/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (uploadError) {
        console.error('上传照片失败:', uploadError);
        throw uploadError;
    }

    // 获取公开 URL
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return data.publicUrl;
}
