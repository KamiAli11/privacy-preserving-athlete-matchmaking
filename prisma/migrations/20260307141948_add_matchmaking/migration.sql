-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "weightClass" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "medicalOk" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedById" TEXT NOT NULL,

    CONSTRAINT "MatchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedAthlete" (
    "matchRequestId" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,

    CONSTRAINT "RequestedAthlete_pkey" PRIMARY KEY ("matchRequestId","athleteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_licenseId_key" ON "Athlete"("licenseId");

-- AddForeignKey
ALTER TABLE "RequestedAthlete" ADD CONSTRAINT "RequestedAthlete_matchRequestId_fkey" FOREIGN KEY ("matchRequestId") REFERENCES "MatchRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedAthlete" ADD CONSTRAINT "RequestedAthlete_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
