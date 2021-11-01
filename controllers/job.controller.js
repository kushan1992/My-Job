const Validator = require("fastest-validator");
const models = require("../models");

function save(req, res) {
  const job = {
    companyName: req.body.companyName,
    vacancyName: req.body.vacancyName,
    description: req.body.description,
    idUser: req.body.idUser,
  };

  const schema = {
    companyName: { type: "string", optional: false, max: "100" },
    vacancyName: { type: "string", optional: false, max: "500" },
    description: { type: "string", optional: false, max: "500" },
    idUser: { type: "number", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(job, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  } else {
    models.User.findByPk(req.body.idUser).then((result) => {
      if (result !== null) {
        models.Job.create(job)
          .then((result) => {
            res.status(201).json({
              message: "Job created successfully",
              job: result,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Something went wrong",
              error: error,
            });
          });
      } else {
        res.status(400).json({
          message: "Invalid user Id",
        });
      }
    });
  }
}

module.exports = {
  save: save,
};
