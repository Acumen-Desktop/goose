import path from "node:path";
import Electron from "electron";
import log from "./logger";

export const getBinaryPath = (
  app: Electron.App,
  binaryName: string
): string => {
  const isDev = process.env.NODE_ENV === "development";
  const isPackaged = app.isPackaged;

  log.info(`Getting binary path for ${binaryName}`);
  log.info(`Environment: isDev=${isDev}, isPackaged=${isPackaged}`);
  log.info(`Current working directory: ${process.cwd()}`);

  let binaryPath;
  if (isDev && !isPackaged) {
    // In development, look for the binary in the React UI's bin directory
    binaryPath = path.join(
      process.cwd(),
      "..",
      "ui",
      "desktop",
      "src",
      "bin",
      process.platform === "win32" ? `${binaryName}.exe` : binaryName
    );
  } else {
    // In production, use the path relative to the app resources
    binaryPath = path.join(
      process.resourcesPath,
      "bin",
      process.platform === "win32" ? `${binaryName}.exe` : binaryName
    );
  }

  log.info(`Resolved binary path: ${binaryPath}`);
  return binaryPath;
};
