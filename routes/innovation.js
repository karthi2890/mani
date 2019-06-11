const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Innovation } = require("../models/innovation");

router.get("/", async (req, res) => {
  res.send({
    data: await Innovation.find()
  });
});

module.exports = router;
