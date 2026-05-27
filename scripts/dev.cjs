const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");

const DEV_SERVER_URL = "http://127.0.0.1:5173";
const PROJECT_ROOT = path.resolve(__dirname, "..");
const VITE_CLI_PATH = path.join(PROJECT_ROOT, "node_modules", "vite", "bin", "vite.js");

let rendererProcess;
let electronProcess;

const start = async () => {
  rendererProcess = spawn(process.execPath, [VITE_CLI_PATH, "--host", "127.0.0.1", "--port", "5173", "--strictPort"], {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
  });

  rendererProcess.on("exit", (code) => {
    if (!electronProcess) {
      process.exit(code ?? 1);
    }
  });

  await waitForServer(DEV_SERVER_URL);

  const electronPath = require("electron");

  electronProcess = spawn(electronPath, [PROJECT_ROOT], {
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: DEV_SERVER_URL,
    },
    stdio: "inherit",
  });

  electronProcess.on("exit", (code) => {
    stopRenderer();
    process.exit(code ?? 0);
  });
};

const waitForServer = (url) =>
  new Promise((resolve, reject) => {
    const deadline = Date.now() + 30000;

    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() > deadline) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }

        setTimeout(check, 250);
      });
    };

    check();
  });

const stopRenderer = () => {
  if (rendererProcess && !rendererProcess.killed) {
    rendererProcess.kill("SIGTERM");
  }
};

process.on("SIGINT", () => {
  if (electronProcess && !electronProcess.killed) {
    electronProcess.kill();
  }

  stopRenderer();
  process.exit(130);
});

start().catch((error) => {
  stopRenderer();
  console.error(error);
  process.exit(1);
});
