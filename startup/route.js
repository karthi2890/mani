const cors = require("cors");
const express = require("express");
const menu = require("../routes/menu");
const csat = require("../routes/csat");
const sentiment = require("../routes/sentiment");
const wordCloud = require("../routes/wordCloud");
const serviceInfo = require("../routes/serviceInfo");
const innovation = require("../routes/innovation");
const stdTool = require("../routes/stdTool");
const kaizen = require("../routes/kaizen");
const nexThinkAppUsage = require("../routes/nexThinkAppUsage");
const enggOperation = require("../routes/enggOperation");
const enggChange = require("../routes/enggChange");
const enggChangeApprover = require("../routes/enggChangeApprover");
const enggProblem = require("../routes/enggProblem");
const enggSLA = require("../routes/enggSLA");
const stdEnggTool = require("../routes/stdEnggTool");
const bfalicense = require("../routes/bfalicense");
const pov = require("../routes/pov");
const error = require("../middleware/error");
const aysnc = require("../middleware/async");

module.exports = function(app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/menu", menu);
  app.use("/api/csat", csat);
  app.use("/api/stdTool", stdTool);
  app.use("/api/sentiment", sentiment);
  app.use("/api/wordCloud", wordCloud);
  app.use("/api/serviceInfo", serviceInfo);
  app.use("/api/innovation", innovation);
  app.use("/api/kaizen", kaizen);
  app.use("/api/nexThinkAppUsage", nexThinkAppUsage);
  app.use("/api/enggOperation", enggOperation);
  app.use("/api/enggChange", enggChange);
  app.use("/api/enggChangeApprover", enggChangeApprover);
  app.use("/api/enggProblem", enggProblem);
  app.use("/api/enggSLA", enggSLA);
  app.use("/api/stdEnggTool", stdEnggTool);
  app.use("/api/bfalicense", bfalicense);
  app.use("/api/pov", pov);
  app.use(error);
  app.use(aysnc);
};