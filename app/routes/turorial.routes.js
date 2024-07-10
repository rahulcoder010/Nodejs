module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  const router = require("express").Router();

  router.route("/")
    .post(tutorials.create)
    .get(tutorials.findAll)
    .delete(tutorials.deleteAll);

  router.route("/published")
    .get(tutorials.findAllPublished);

  router.route("/:id")
    .get(tutorials.findOne)
    .put(tutorials.update)
    .delete(tutorials.delete);

  app.use("/api/tutorials", router);
};