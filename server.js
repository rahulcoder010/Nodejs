const express = require("express");
const cors = require("cors");
const redis = require("redis");
const { promisify } = require("util");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Redis connection
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// simple route
app.get("/", async (req, res) => {
  const cacheData = await getAsync("cacheData");
  if (cacheData) {
    res.json(JSON.parse(cacheData));
  } else {
    const data = { message: "Welcome to bezkoder application." };
    await setAsync("cacheData", JSON.stringify(data));
    res.json(data);
  }
});

app.post("/", async (req, res) => {
  const data = req.body;
  await setAsync("cacheData", JSON.stringify(data));
  res.json(data);
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});