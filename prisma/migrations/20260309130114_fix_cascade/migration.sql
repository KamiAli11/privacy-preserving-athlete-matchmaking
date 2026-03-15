-- DropForeignKey
ALTER TABLE "RequestedAthlete" DROP CONSTRAINT "RequestedAthlete_athleteId_fkey";

-- AddForeignKey
ALTER TABLE "RequestedAthlete" ADD CONSTRAINT "RequestedAthlete_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
