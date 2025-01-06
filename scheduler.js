const cron = require("node-cron");
const { GitHubNumberUpdater } = require("./update_number");

// Schedule the task to run daily at a random time
const randomHour = Math.floor(Math.random() * 24);
const randomMinute = Math.floor(Math.random() * 60);

cron.schedule(`${randomMinute} ${randomHour} * * *`, () => {
  console.log(`Running update at ${randomHour}:${randomMinute}`);
  const updater = new GitHubNumberUpdater();
  updater.main();
});

console.log(
  `Scheduler started. Will run daily at ${randomHour}:${randomMinute}`
);
