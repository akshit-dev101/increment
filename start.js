const { spawn } = require("child_process");

function startService() {
  const service = spawn("node", ["scheduler.js"], {
    detached: true,
    stdio: "inherit",
  });

  service.on("exit", (code) => {
    console.log(`Service exited with code ${code}. Restarting...`);
    startService();
  });
}

startService();
