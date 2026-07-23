-- CreateIndex for products
CREATE INDEX IF NOT EXISTS "products_createdAt_idx" ON "products"("createdAt");
CREATE INDEX IF NOT EXISTS "products_deletedAt_idx" ON "products"("deletedAt");
CREATE INDEX IF NOT EXISTS "products_subfamilyId_idx" ON "products"("subfamilyId");
CREATE INDEX IF NOT EXISTS "products_isActive_idx" ON "products"("isActive");
CREATE INDEX IF NOT EXISTS "products_status_idx" ON "products"("status");
CREATE INDEX IF NOT EXISTS "products_deletedAt_isActive_idx" ON "products"("deletedAt", "isActive");

-- CreateIndex for orders
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt");
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");

-- CreateIndex for order_items
CREATE INDEX IF NOT EXISTS "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX IF NOT EXISTS "order_items_productId_idx" ON "order_items"("productId");