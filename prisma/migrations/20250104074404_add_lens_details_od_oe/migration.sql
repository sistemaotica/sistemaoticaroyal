/*
  Warnings:

  - You are about to drop the column `axis` on the `LensDetails` table. All the data in the column will be lost.
  - You are about to drop the column `cylindrical` on the `LensDetails` table. All the data in the column will be lost.
  - You are about to drop the column `dnp` on the `LensDetails` table. All the data in the column will be lost.
  - You are about to drop the column `dp` on the `LensDetails` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `LensDetails` table. All the data in the column will be lost.
  - You are about to drop the column `prism` on the `LensDetails` table. All the data in the column will be lost.
  - You are about to drop the column `spherical` on the `LensDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LensDetails" DROP COLUMN "axis",
DROP COLUMN "cylindrical",
DROP COLUMN "dnp",
DROP COLUMN "dp",
DROP COLUMN "height",
DROP COLUMN "prism",
DROP COLUMN "spherical",
ADD COLUMN     "longeOdAxis" TEXT,
ADD COLUMN     "longeOdCylindrical" TEXT,
ADD COLUMN     "longeOdDnp" TEXT,
ADD COLUMN     "longeOdPrism" TEXT,
ADD COLUMN     "longeOdSpherical" TEXT,
ADD COLUMN     "longeOeAxis" TEXT,
ADD COLUMN     "longeOeCylindrical" TEXT,
ADD COLUMN     "longeOeDnp" TEXT,
ADD COLUMN     "longeOePrism" TEXT,
ADD COLUMN     "longeOeSpherical" TEXT,
ADD COLUMN     "pertoOdAxis" TEXT,
ADD COLUMN     "pertoOdCylindrical" TEXT,
ADD COLUMN     "pertoOdDnp" TEXT,
ADD COLUMN     "pertoOdPrism" TEXT,
ADD COLUMN     "pertoOdSpherical" TEXT,
ADD COLUMN     "pertoOeAxis" TEXT,
ADD COLUMN     "pertoOeCylindrical" TEXT,
ADD COLUMN     "pertoOeDnp" TEXT,
ADD COLUMN     "pertoOePrism" TEXT,
ADD COLUMN     "pertoOeSpherical" TEXT;
