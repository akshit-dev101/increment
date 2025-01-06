const fs = require("fs").promises;
const { execSync } = require("child_process");
const path = require("path");

class GitHubNumberUpdater {
  constructor() {
    this.scriptDir = __dirname;
    this.numberFile = path.join(this.scriptDir, "number.txt");
  }

  async readNumber() {
    try {
      const content = await fs.readFile(this.numberFile, "utf8");
      return parseInt(content.trim());
    } catch (error) {
      console.error("Error reading number:", error);
      throw error;
    }
  }

  async writeNumber(num) {
    try {
      await fs.writeFile(this.numberFile, num.toString());
    } catch (error) {
      console.error("Error writing number:", error);
      throw error;
    }
  }

  gitCommit() {
    try {
      // Stage the changes
      execSync("git add number.txt", { cwd: this.scriptDir });

      // Create commit with current date
      const date = new Date().toISOString().split("T")[0];
      execSync(`git commit -m "Update number: ${date}"`, {
        cwd: this.scriptDir,
      });
    } catch (error) {
      console.error("Error during git commit:", error);
      throw error;
    }
  }

  gitPush() {
    try {
      execSync("git push", { cwd: this.scriptDir });
      console.log("Changes pushed to GitHub successfully.");
    } catch (error) {
      console.error("Error pushing to GitHub:", error.stderr?.toString());
      throw error;
    }
  }

  async main() {
    try {
      const currentNumber = await this.readNumber();
      const newNumber = currentNumber + 1;
      await this.writeNumber(newNumber);
      this.gitCommit();
      this.gitPush();
    } catch (error) {
      console.error("Error in main execution:", error);
      process.exit(1);
    }
  }
}

// Run the script
const updater = new GitHubNumberUpdater();
updater.main();
