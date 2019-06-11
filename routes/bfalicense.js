const mongoose = require("mongoose");
const { BfaLicense } = require("../models/bfalicense");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send({ data: await BfaLicense.find() });
});

module.exports = router;
