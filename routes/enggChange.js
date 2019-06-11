const mongoose = require("mongoose");
const { EnggChange } = require("../models/enggChange");
const express = require("express");
const router = express.Router();

// router.get("/changeRequestAwaitApproval", async (req, res) => {
//   const changeRequestAwaitApproval = await EnggChange.aggregate([
//     {
//       $addFields: {
//         CreatedMonth: {
//           $month: "$Created"
//         }
//       }
//     },
//     {
//       $match: {
//         Businessservice: "Engineering / NPI Applications",
//         Assignmentgroup: {
//           $ne: ["DEV"]
//         },
//         State: "Requested"
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         count: { $sum: 1 }
//       }
//     }
//   ]);
//   res.send({
//     data: {
//       count:
//         changeRequestAwaitApproval.length > 0
//           ? changeRequestAwaitApproval[0].count
//           : 0
//     }
//   });
// });
router.get("/changeRequests", async (req, res) => {
  const changeRequest = await EnggChange.aggregate([
    {
      $group: {
        _id: { State: "$State" },
        stateCount: { $sum: 1 }
      }
    }
  ]);
  res.send({
    data: {
      changeRequest: changeRequest.map(x => {
        const data = {
          state: x._id.State,
          stateCount: x.stateCount
        };
        return data;
      })
    }
  });
});

router.get("/changeRequestSummary", async (req, res) => {
  const currentYear = `${new Date().getFullYear()}-01-01`;
  const changeRequestSummary = await EnggChange.aggregate([
    {
      $addFields: {
        CreatedMonth: {
          $month: "$Created"
        }
      }
    },
    {
      $match: {
        Businessservice: "Engineering / NPI Applications",
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
      changeRequestSummary: changeRequestSummary.map(x => {
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
