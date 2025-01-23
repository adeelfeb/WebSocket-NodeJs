const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Route to stream a file
app.get("/download", (req, res) => {
  const filePath = path.resolve(__dirname, "large-file.txt"); // Replace with your file path
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  readStream.on("end", () => {
    console.log("File streamed successfully.");
  });

  readStream.on("error", (err) => {
    console.error("Error streaming file:", err);
    res.status(500).send("Error streaming file.");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
