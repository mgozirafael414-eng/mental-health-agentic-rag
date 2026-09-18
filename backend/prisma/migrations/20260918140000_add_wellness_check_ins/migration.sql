-- CreateTable
CREATE TABLE "WellnessCheckIn" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mood" INTEGER NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "energyLevel" INTEGER NOT NULL,
    "sleepHours" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WellnessCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WellnessCheckIn_userId_createdAt_idx" ON "WellnessCheckIn"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "WellnessCheckIn" ADD CONSTRAINT "WellnessCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
