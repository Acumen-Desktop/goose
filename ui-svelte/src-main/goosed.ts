import { spawn } from "child_process";
import { createServer } from "net";
import os from "node:os";
import { getBinaryPath } from "./utils/binaryPath";
import log from "./utils/logger";
import type { ChildProcessByStdio } from "node:child_process";
import { Readable } from "node:stream";
import type {
  StartGooseParams,
  GooseProcess,
  GooseSpawnOptions,
  GooseResult,
} from "./types/process";

// Find an available port to start goosed on
const findAvailablePort = async (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(startPort, "127.0.0.1", () => {
      const { port } = server.address() as { port: number };
      server.close(() => {
        log.info(`Found available port: ${port}`);
        resolve(port);
      });
    });
  });
};

// Goose process manager. Take in the app, port, and directory to start goosed in.
// Check if goosed server is ready by polling the status endpoint
const checkServerStatus = async (
  port: number,
  maxAttempts: number = 60,
  interval: number = 100
): Promise<boolean> => {
  const statusUrl = `http://127.0.0.1:${port}/status`;
  log.info(`Checking server status at ${statusUrl}`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(statusUrl);
      if (response.ok) {
        log.info(`Server is ready after ${attempt} attempts`);
        return true;
      }
    } catch (error) {
      // Expected error when server isn't ready yet
      if (attempt === maxAttempts) {
        log.error(
          `Server failed to respond after ${maxAttempts} attempts:`,
          error
        );
      }
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return false;
};

export const startGoosed = async (
  app: StartGooseParams["app"],
  dir: StartGooseParams["dir"] = null,
  startPort: StartGooseParams["port"] = 0
): Promise<GooseResult> => {
  // we default to running goosed in home dir - if not specified
  const homeDir = os.homedir();
  if (!dir) {
    dir = homeDir;
  }

  // Find an available port
  const port = await findAvailablePort(startPort);

  // Get the path to the goosed binary
  const goosedPath = await getBinaryPath(app, "goosed");

  // Set up environment variables
  const processEnv = {
    ...process.env,
    GOOSE_PORT: port.toString(),
  };

  // Spawn the goosed process with the user's home directory as cwd
  const goosedProcess = spawn(goosedPath, ["agent"], {
    cwd: dir || undefined,
    env: processEnv,
  } as GooseSpawnOptions) as GooseProcess;

  goosedProcess.stdout.on("data", (data: Buffer) => {
    log.info(data.toString());
  });

  goosedProcess.stderr.on("data", (data: Buffer) => {
    log.error(data.toString());
  });

  goosedProcess.on("close", (code: number) => {
    log.info(`Goosed server exited with code ${code}`);
  });

  goosedProcess.on("error", (err: Error) => {
    log.error(`Failed to start goosed on port ${port} and dir ${dir}`, err);
  });

  // Wait for the server to start
  try {
    await checkServerStatus(port);
  } catch (error) {
    log.error(`Goosed server failed to start on port ${port}`);
    goosedProcess.kill();
    throw new Error(`Goosed server failed to start on port ${port}`);
  }

  // Clean up when app quits
  app.on("before-quit", () => {
    log.info("App quitting, terminating goosed server");
    goosedProcess.kill();
  });

  log.info(`Goosed server successfully started on port ${port}`);
  return [port, dir, goosedProcess];
};
