-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intentions" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "title" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Intentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entries" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryIntention" (
    "entryId" INTEGER NOT NULL,
    "intentionId" INTEGER NOT NULL,

    CONSTRAINT "EntryIntention_pkey" PRIMARY KEY ("entryId","intentionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Entries_hash_key" ON "Entries"("hash");

-- AddForeignKey
ALTER TABLE "Intentions" ADD CONSTRAINT "Intentions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entries" ADD CONSTRAINT "Entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryIntention" ADD CONSTRAINT "EntryIntention_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryIntention" ADD CONSTRAINT "EntryIntention_intentionId_fkey" FOREIGN KEY ("intentionId") REFERENCES "Intentions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
