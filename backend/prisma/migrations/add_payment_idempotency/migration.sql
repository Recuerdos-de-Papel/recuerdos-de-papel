-- CreateTable
CREATE TABLE IF NOT EXISTS "payment_idempotencies" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_idempotencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "payment_idempotencies_paymentId_key" ON "payment_idempotencies"("paymentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "payment_idempotencies_orderId_idx" ON "payment_idempotencies"("orderId");