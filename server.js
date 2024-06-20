const express = require("express");
const cors = require("cors");
const Joi = require("joi");

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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Joi validation example
const schema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().min(18).max(99).required(),
  email: Joi.string().email().required(),
});

const data = {
  name: "John Doe",
  age: 25,
  email: "johndoe@example.com",
};

const { error, value } = schema.validate(data);
if (error) {
  console.log(error.details);
} else {
  console.log(value);
}