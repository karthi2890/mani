const mongoose = require("mongoose");
const { EnggProblem } = require("../models/enggProblem");
const express = require("express");
const router = express.Router();

router.get("/report", async (req, res) => {
  const report = await EnggProblem.aggregate([
    {
      $group: {
        _id: { State: "$State" },
        count: { $sum: 1 }
      }
    }
  ]);
  res.send({
    data: {
      report: report.map(x => {
        const data = {
          state: x._id.State,
          stateCount: x.count
        };
        return data;
      })
    }
  });
});
router.get("/reportSummary", async (req, res) => {
  const currentYear = `${new Date().getFullYear()}-01-01`;
  const reportSummary = await EnggProblem.aggregate([
    {
      $addFields: {
        CreatedMonth: {
          $month: "$Created"
        }
      }
    },
    {
      $match: {
        Assignmentgroup: {
          $ne: ["DEV"]
        },
        Created: {
          $gte: new Date(currentYear)
        }
      }
    },
    {
      $group: {
        _id: { CreatedMonth: "$CreatedMonth" },
        count: { $sum: 1 }
      }
    }
  ]);
  res.send({
    data: {
      reportSummary: reportSummary.map(x => {
        const data = {
          month: x._id.CreatedMonth,
          count: x.count
        };
        return data;
      })
    }
  });
});
module.exports = router;
