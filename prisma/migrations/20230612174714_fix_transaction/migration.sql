/*
  Warnings:

  - You are about to drop the column `date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTransaction` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeTransaction` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "date",
DROP COLUMN "type",
ADD COLUMN     "dateTransaction" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "typeTransaction" "TransactionType" NOT NULL,
ALTER COLUMN "done" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
