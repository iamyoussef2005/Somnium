-- CreateTable
CREATE TABLE "Dream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "textContent" TEXT NOT NULL,
    "location" TEXT
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "DreamTheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dreamId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    CONSTRAINT "DreamTheme_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DreamTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_slug_key" ON "Theme"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DreamTheme_dreamId_themeId_key" ON "DreamTheme"("dreamId", "themeId");
