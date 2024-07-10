const db = require("../models");
const Tutorial = db.tutorials;

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.title) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    // Create a Tutorial
    const tutorial = new Tutorial({
      title: req.body.title,
      description: req.body.description,
      published: req.body.published || false
    });

    // Save Tutorial in the database
    const data = await tutorial.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Tutorial."
    });
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  try {
    const title = req.query.title;
    const condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    const data = await Tutorial.find(condition);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  }
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Tutorial.findById(id);
    if (!data) {
      return res.status(404).send({ message: "Not found Tutorial with id " + id });
    }
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving Tutorial with id=" + id });
  }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const id = req.params.id;

    const data = await Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
    if (!data) {
      return res.status(404).send({
        message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
      });
    }
    res.send({ message: "Tutorial was updated successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error updating Tutorial with id=" + id });
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Tutorial.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data) {
      return res.status(404).send({
        message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
      });
    }
    res.send({ message: "Tutorial was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Tutorial with id=" + id });
  }
};

// Delete all Tutorials from the database.
exports.deleteAll = async (req, res) => {
  try {
    const data = await Tutorial.deleteMany({});
    res.send({ message: `${data.deletedCount} Tutorials were deleted successfully!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all tutorials."
    });
  }
};

// Find all published Tutorials
exports.findAllPublished = async (req, res) => {
  try {
    const data = await Tutorial.find({ published: true });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  }
};