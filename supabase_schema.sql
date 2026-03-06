-- =============================================
-- 印记馆 - Supabase 数据库初始化脚本
-- 在 Supabase Dashboard → SQL Editor 中执行
-- =============================================

-- 1. 故交信息表
CREATE TABLE IF NOT EXISTS colleagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  years TEXT DEFAULT '',
  icon TEXT DEFAULT 'ink_pen',
  photo_url TEXT DEFAULT '',
  offerings TEXT[] DEFAULT '{}',
  incense_lit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 留言/别言表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colleague_id UUID NOT NULL REFERENCES colleagues(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT DEFAULT '匿名',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 为 messages 表的 colleague_id 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_colleague_id ON messages(colleague_id);

-- 4. 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON colleagues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security) 策略
-- 这里使用 anon key 公开访问，适合演示/个人项目
-- 生产环境请根据需求配置更严格的策略

ALTER TABLE colleagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读写（适合演示用途）
CREATE POLICY "Allow public read on colleagues" ON colleagues
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on colleagues" ON colleagues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on colleagues" ON colleagues
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on colleagues" ON colleagues
  FOR DELETE USING (true);

CREATE POLICY "Allow public read on messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete on messages" ON messages
  FOR DELETE USING (true);

-- 6. 插入默认数据（可选）
INSERT INTO colleagues (name, title, years, icon, photo_url, offerings, incense_lit) VALUES
  ('李明哲', '高级产品经理', '2018-2023', 'ink_pen', '', '{}', false),
  ('林晓', '资深设计师', '2019-2022', 'desk', '', '{}', false),
  ('王建', '前端开发', '2020-2023', 'keyboard', '', '{}', false);
