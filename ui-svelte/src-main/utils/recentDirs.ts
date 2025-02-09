import { app } from "electron";
import path from "path";
import fs from "fs";

const RECENT_DIRS_FILE = path.join(app.getPath("userData"), "recent_dirs.json");
const MAX_RECENT_DIRS = 10;

export function loadRecentDirs(): string[] {
  try {
    if (fs.existsSync(RECENT_DIRS_FILE)) {
      const data = fs.readFileSync(RECENT_DIRS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load recent directories:", error);
  }
  return [];
}

export function addRecentDir(dir: string) {
  try {
    const recentDirs = loadRecentDirs();

    // Remove if already exists
    const index = recentDirs.indexOf(dir);
    if (index > -1) {
      recentDirs.splice(index, 1);
    }

    // Add to front
    recentDirs.unshift(dir);

    // Keep only the most recent N directories
    if (recentDirs.length > MAX_RECENT_DIRS) {
      recentDirs.length = MAX_RECENT_DIRS;
    }

    // Save to file
    fs.writeFileSync(RECENT_DIRS_FILE, JSON.stringify(recentDirs));
  } catch (error) {
    console.error("Failed to add recent directory:", error);
  }
}
