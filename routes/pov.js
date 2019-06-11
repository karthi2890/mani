const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { POV, validate } = require("../models/pov");

router.get("/", async (req, res) => {
  res.send({ data: await POV.find() });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.sendStatus(400).send(error[0].details.message);
  }
  let pov = new POV({
    title: req.body.title,
    description: req.body.description,
    attachment: req.body.attachment
  });
  res.send(await pov.save());
});

router.put("/", async (req, res) => {
  let pov = await POV.findById(req.body._id);
  if (!pov) return;
  pov.title = req.body.title;
  pov.description = req.body.description;
  pov.attachment = req.body.attachment;
  res.send(await pov.save());
});

router.delete("/", async (req, res) => {
  const result = await POV.deleteOne({ _id: req.body._id });
  res.send(result);
});

module.exports = router;
