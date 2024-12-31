const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const redis = require("redis");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const redisClient = redis.createClient();

// GET request
app.get("/api/files/:filename", (req, res) => {
  const { filename } = req.params;

  // Check if data exists in cache
  redisClient.get(filename, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (data) {
      // Data exists in cache, return it
      res.send(data);
    } else {
      // Data does not exist in cache, read from file
      fs.readFile(filename, "utf8", (err, fileData) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          // Set data in cache
          redisClient.set(filename, fileData);
          res.send(fileData);
        }
      });
    }
  });
});

// POST request
app.post("/api/files/:filename", (req, res) => {
  const { filename } = req.params;
  const fileData = req.body.data;

  // Update file
  fs.writeFile(filename, fileData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      // Invalidate cache for the file
      redisClient.del(filename);
      res.send("File updated successfully");
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});