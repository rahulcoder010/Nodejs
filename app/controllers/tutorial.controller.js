const db = require("../models");
const Tutorial = db.tutorials;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Generate Swagger documentation for an API endpoint
exports.generateSwaggerDocumentation = (req, res) => {
  const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Tutorial API",
      version: "1.0.0",
      description: "API documentation for the Tutorial API"
    },
    paths: {
      "/api/tutorials": {
        get: {
          summary: "Retrieve all tutorials",
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Tutorial"
                    }
                  }
                }
              }
            },
            500: {
              description: "Internal server error"
            }
          }
        },
        post: {
          summary: "Create a new tutorial",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tutorial"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Tutorial"
                  }
                }
              }
            },
            400: {
              description: "Bad request"
            },
            500: {
              description: "Internal server error"
            }
          }
        }
      },
      "/api/tutorials/{id}": {
        get: {
          summary: "Retrieve a tutorial by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Tutorial"
                  }
                }
              }
            },
            404: {
              description: "Tutorial not found"
            },
            500: {
              description: "Internal server error"
            }
          }
        },
        put: {
          summary: "Update a tutorial by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tutorial"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Tutorial"
                  }
                }
              }
            },
            400: {
              description: "Bad request"
            },
            404: {
              description: "Tutorial not found"
            },
            500: {
              description: "Internal server error"
            }
          }
        },
        delete: {
          summary: "Delete a tutorial by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Tutorial"
                  }
                }
              }
            },
            404: {
              description: "Tutorial not found"
            },
            500: {
              description: "Internal server error"
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Tutorial: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            description: {
              type: "string"
            },
            published: {
              type: "boolean"
            }
          }
        }
      }
    }
  };

  res.setHeader("Content-Type", "application/x-yaml");
  res.send(jsyaml.dump(swaggerDocument));
};