CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up legacy tables
DROP TABLE IF EXISTS link_tags;
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS tags;

-- Tag table (per user)
CREATE TABLE IF NOT EXISTS mypocket_tag (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, label)
);

-- Link table (per user)
CREATE TABLE IF NOT EXISTS mypocket_link (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(4096) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  note VARCHAR(512) DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, url)
);

-- Link tag junction table
CREATE TABLE IF NOT EXISTS mypocket_link_tag (
  link_id UUID NOT NULL REFERENCES mypocket_link(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES mypocket_tag(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (link_id, tag_id)
);

-- Indexes for performance
-- Composite indexes cover single-column queries, so we only need composite ones
CREATE INDEX IF NOT EXISTS idx_mypocket_link_user_created ON mypocket_link(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mypocket_tag_user_label ON mypocket_tag(user_id, label);
CREATE INDEX IF NOT EXISTS idx_mypocket_link_tag_link_id ON mypocket_link_tag(link_id);
CREATE INDEX IF NOT EXISTS idx_mypocket_link_tag_tag_id ON mypocket_link_tag(tag_id);

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_mypocket_tag_updated_at
  BEFORE UPDATE ON mypocket_tag
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mypocket_link_updated_at
  BEFORE UPDATE ON mypocket_link
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE mypocket_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE mypocket_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE mypocket_link_tag ENABLE ROW LEVEL SECURITY;

-- Tag policies (user can only see/edit own tags)
CREATE POLICY "Users can view own tag"
  ON mypocket_tag FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own tag"
  ON mypocket_tag FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own tag"
  ON mypocket_tag FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own tag"
  ON mypocket_tag FOR DELETE
  USING ((select auth.uid()) = user_id);

-- Link policies (user can only see/edit own links)
CREATE POLICY "Users can view own link"
  ON mypocket_link FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own link"
  ON mypocket_link FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own link"
  ON mypocket_link FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own link"
  ON mypocket_link FOR DELETE
  USING ((select auth.uid()) = user_id);

-- Link tag policies (user can manage tags on own links)
CREATE POLICY "Users can view own link tag"
  ON mypocket_link_tag FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mypocket_link
      WHERE mypocket_link.id = mypocket_link_tag.link_id
      AND mypocket_link.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own link tag"
  ON mypocket_link_tag FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM mypocket_link
      WHERE mypocket_link.id = mypocket_link_tag.link_id
      AND mypocket_link.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own link tag"
  ON mypocket_link_tag FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM mypocket_link
      WHERE mypocket_link.id = mypocket_link_tag.link_id
      AND mypocket_link.user_id = (select auth.uid())
    )
  );

-- Function to allow users to delete their own account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

