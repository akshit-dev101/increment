const cron = require("node-cron");
const { GitHubNumberUpdater } = require("./update_number");
const fs = require("fs");
const path = require("path");

class ServiceRunner {
  constructor() {
    this.logFile = path.join(__dirname, "service.log");
    this.isRunning = false;
    this.minHours = 2;
    this.maxHours = 4;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(this.logFile, logMessage);
  }

  getNextInterval() {
    // Generate random interval between minHours and maxHours in milliseconds
    const minMs = this.minHours * 60 * 60 * 1000;
    const maxMs = this.maxHours * 60 * 60 * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  async runUpdate() {
    try {
      if (this.isRunning) {
        this.log("Update already in progress, skipping");
        return;
      }

      this.isRunning = true;
      this.log("Starting update");

      const updater = new GitHubNumberUpdater();
      await updater.main();

      this.log("Update completed successfully");

      // Schedule next update
      const nextInterval = this.getNextInterval();
      const nextUpdate = new Date(Date.now() + nextInterval);
      this.log(`Next update scheduled for: ${nextUpdate.toISOString()}`);

      setTimeout(() => this.runUpdate(), nextInterval);
    } catch (error) {
      this.log(`Error during update: ${error.message}`);
      this.log(error.stack);
    } finally {
      this.isRunning = false;
    }
  }

  start() {
    // Handle unexpected errors
    process.on("uncaughtException", (error) => {
      this.log(`Uncaught Exception: ${error.message}`);
      this.log(error.stack);
    });

    process.on("unhandledRejection", (error) => {
      this.log(`Unhandled Rejection: ${error.message}`);
      this.log(error.stack);
    });

    // Keep the process running even if an error occurs
    process.on("exit", (code) => {
      this.log(`Process exit with code: ${code}`);
      process.exit(1);
    });

    // Run first update immediately
    this.log("Service started. Running first update...");
    this.runUpdate();

    // Prevent the Node.js process from exiting
    setInterval(() => {}, 1000);
  }
}

// Create and start the service
const service = new ServiceRunner();
service.start();
