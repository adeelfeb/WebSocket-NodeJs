const express = require("express");
const path = require("path");
const cluster = require("node:cluster");
const os = require("os");

// Get the number of CPU cores available
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  // Primary process: Responsible for managing worker processes
  console.log(`Primary process ${process.pid} is running`);

  // Fork worker processes equal to the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events to handle crashes or restarts
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`);
    // Optionally, restart the worker process
    console.log("Starting a new worker...");
    cluster.fork();
  });
} else {
  // Worker process: Handles incoming requests
  const PORT = 8000;
  const app = express();

  app.use(express.static(path.resolve("./public")));

  app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
  });

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${PORT}`);
  });
}
