-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentOrderId" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';
