const express = require("express");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const app = express();
const PORT = 3000;

// Route to send a ZIP file
app.get("/download-zip", (req, res) => {
  const filePath = path.resolve(__dirname, "large-file.txt"); // Replace with your file path
  const zipFileName = "compressed-file.txt.gz"; // Gzipped file name

  res.writeHead(200, {
    "Content-Type": "application/gzip",
    "Content-Disposition": `attachment; filename="${zipFileName}"`,
  });

  const readStream = fs.createReadStream(filePath);
  const gzipStream = zlib.createGzip();

  readStream.pipe(gzipStream).pipe(res);

  gzipStream.on("end", () => {
    console.log("File compressed and streamed successfully.");
  });

  gzipStream.on("error", (err) => {
    console.error("Error compressing file:", err);
    res.status(500).send("Error compressing file.");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
