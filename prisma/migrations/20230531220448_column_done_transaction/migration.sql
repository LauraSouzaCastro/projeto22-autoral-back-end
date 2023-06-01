/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `transactiontId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "appointmentId",
ADD COLUMN     "transactiontId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Appointment";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_transactiontId_fkey" FOREIGN KEY ("transactiontId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
