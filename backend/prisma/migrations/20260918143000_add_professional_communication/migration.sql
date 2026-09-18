-- CreateTable
CREATE TABLE "ProfessionalConversation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProfessionalConversation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProfessionalConversation_userId_professionalId_key" ON "ProfessionalConversation"("userId", "professionalId");
CREATE INDEX "ProfessionalConversation_professionalId_updatedAt_idx" ON "ProfessionalConversation"("professionalId", "updatedAt");
ALTER TABLE "ProfessionalConversation" ADD CONSTRAINT "ProfessionalConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalConversation" ADD CONSTRAINT "ProfessionalConversation_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ProfessionalMessage" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProfessionalMessage_conversationId_createdAt_idx" ON "ProfessionalMessage"("conversationId", "createdAt");
ALTER TABLE "ProfessionalMessage" ADD CONSTRAINT "ProfessionalMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ProfessionalConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalMessage" ADD CONSTRAINT "ProfessionalMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "SessionNote" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SessionNote_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SessionNote_appointmentId_professionalId_key" ON "SessionNote"("appointmentId", "professionalId");
CREATE INDEX "SessionNote_professionalId_updatedAt_idx" ON "SessionNote"("professionalId", "updatedAt");
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
