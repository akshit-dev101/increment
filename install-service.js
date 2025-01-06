const Service = require("node-windows").Service;
const path = require("path");

// Create a new service object
const svc = new Service({
  name: "GitHubNumberUpdater",
  description: "Updates number and pushes to GitHub daily",
  script: path.join(__dirname, "scheduler.js"),
});

// Listen for service install/uninstall events
svc.on("install", function () {
  console.log("Service installed successfully");
  svc.start();
});

svc.on("uninstall", function () {
  console.log("Service uninstalled successfully");
});

// Install the service
svc.install();
