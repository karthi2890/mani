const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { EnggSLA } = require("../models/enggSLA");

router.get("/breachSummary", async (req, res) => {
  const currentYear = new Date(`${new Date().getFullYear()}-01-01}`);
  const breachSummary = await EnggSLA.aggregate([
    {
      $addFields: {
        CreatedMonth: {
          $month: "$Opened"
        }
      }
    },
    {
      $match: {
        Opened: {
          $gt: currentYear
        },
        State: {
          $ne: ["Cancelled"]
        }
      }
    },
    {
      $group: {
        _id: { CreatedMonth: "$CreatedMonth", Hasbreached: "$Hasbreached" },
        count: { $sum: 1 }
      }
    }
  ]);

  res.send({
    data: breachSummary.map(x => {
      const data = {
        CreatedMonth: x._id.CreatedMonth,
        Hasbreached: x._id.Hasbreached,
        count: x.count
      };
      return data;
    })
  });
});
router.get("/breachSLACurrentMonth", async (req, res) => {
  const currentMonth = new Date(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01}`
  );
  const breachSLACurrentMonth = await EnggSLA.aggregate([
    {
      $match: {
        Opened: {
          $gt: currentMonth
        },
        State: {
          $ne: ["Cancelled"]
        },
        Hasbreached: {
          $eq: "TRUE"
        }
      }
    },
    {
      $project: {
        _id: 0,
        Number: 1,
        Application: 1,
        Actualelapsedpercentage: 1,
        BusinessCriticalIssue: 1,
        Assignedto: 1,
        Assignmentgroup: 1
      }
    }
  ]);

  res.send({
    data: breachSLACurrentMonth
  });
});
module.exports = router;
