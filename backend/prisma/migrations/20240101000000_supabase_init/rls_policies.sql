-- Políticas RLS para Supabase PostgreSQL

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE subfamilies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para categories (público lectura)
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para families
CREATE POLICY "Public can view families" ON families FOR SELECT USING (true);
CREATE POLICY "Admin can manage families" ON families FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para subfamilies
CREATE POLICY "Public can view subfamilies" ON subfamilies FOR SELECT USING (true);
CREATE POLICY "Admin can manage subfamilies" ON subfamilies FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para products
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para addresses
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid()::text = user_id::text);

-- Políticas para favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid()::text = user_id::text);

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Políticas para order_items
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id::text = auth.uid()::text)
);

-- Políticas para promotions
CREATE POLICY "Public can view active promotions" ON promotions FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage promotions" ON promotions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para flyers
CREATE POLICY "Public can view active flyers" ON flyers FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage flyers" ON flyers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para settings
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage settings" ON settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas para admin_logs
CREATE POLICY "Admin can view logs" ON admin_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admin can create logs" ON admin_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Crear buckets de storage si no existen
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('products', 'products', true),
  ('promotions', 'promotions', true),
  ('flyers', 'flyers', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para products
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admin can update product images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'products' AND 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admin can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'products' AND 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas de storage para flyers
CREATE POLICY "Public can view flyers" ON storage.objects FOR SELECT USING (bucket_id = 'flyers');
CREATE POLICY "Admin can manage flyers" ON storage.objects FOR ALL USING (
  bucket_id = 'flyers' AND 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Políticas de storage para avatars
CREATE POLICY "Users can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[0]
);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[0]
);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[0]
);

-- Políticas de storage para promotions
CREATE POLICY "Public can view promotion images" ON storage.objects FOR SELECT USING (bucket_id = 'promotions');
CREATE POLICY "Admin can manage promotion images" ON storage.objects FOR ALL USING (
  bucket_id = 'promotions' AND 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);