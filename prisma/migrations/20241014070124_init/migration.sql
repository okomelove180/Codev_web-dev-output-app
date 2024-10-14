-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Output" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "correctedContent" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Output_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedLink" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "likes_count" INTEGER,
    "isOfficial" BOOLEAN NOT NULL,
    "outputId" TEXT NOT NULL,

    CONSTRAINT "RelatedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedLink" ADD CONSTRAINT "RelatedLink_outputId_fkey" FOREIGN KEY ("outputId") REFERENCES "Output"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
