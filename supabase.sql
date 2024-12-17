-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '',
  order_position INTEGER NOT NULL DEFAULT 0,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create rules table if it doesn't exist
CREATE TABLE IF NOT EXISTS rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  order_position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create factions table if it doesn't exist
CREATE TABLE IF NOT EXISTS factions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  discord_url TEXT NOT NULL,
  order_position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_position);
CREATE INDEX IF NOT EXISTS idx_rules_category_id ON rules(category_id);
CREATE INDEX IF NOT EXISTS idx_rules_order ON rules(order_position);
CREATE INDEX IF NOT EXISTS idx_factions_category_id ON factions(category_id);
CREATE INDEX IF NOT EXISTS idx_factions_order ON factions(order_position);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE factions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON rules;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON rules;
DROP POLICY IF EXISTS "Enable read access for all users" ON factions;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON factions;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON rules FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON factions FOR SELECT USING (true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Enable write access for authenticated users" ON categories 
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for authenticated users" ON rules
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for authenticated users" ON factions
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_rules_updated_at ON rules;
DROP TRIGGER IF EXISTS update_factions_updated_at ON factions;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factions_updated_at
  BEFORE UPDATE ON factions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();