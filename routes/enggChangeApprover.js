const mongoose = require("mongoose");
const { EnggChangeApprover } = require("../models/enggChangeApprover");
const express = require("express");
const router = express.Router();

router.get("/awaitApproval", async (req, res) => {
  const changeRequestAwaitApproval = await EnggChangeApprover.aggregate([
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
        State: "Requested"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ]);
  res.send({
    data: {
      count:
        changeRequestAwaitApproval.length > 0
          ? changeRequestAwaitApproval[0].count
          : 0
    }
  });
});

module.exports = router;
