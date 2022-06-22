/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `bookmark` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `admin` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banned` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamesLost` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamesPlayed` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamesWon` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "admin" BOOLEAN NOT NULL,
ADD COLUMN     "banned" BOOLEAN NOT NULL,
ADD COLUMN     "gamesLost" INTEGER NOT NULL,
ADD COLUMN     "gamesPlayed" INTEGER NOT NULL,
ADD COLUMN     "gamesWon" INTEGER NOT NULL,
ADD COLUMN     "picture" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "bookmark";

-- CreateTable
CREATE TABLE "_relations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_relations_AB_unique" ON "_relations"("A", "B");

-- CreateIndex
CREATE INDEX "_relations_B_index" ON "_relations"("B");

-- AddForeignKey
ALTER TABLE "_relations" ADD CONSTRAINT "_relations_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_relations" ADD CONSTRAINT "_relations_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
