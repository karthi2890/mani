const express = require("express");
const router = express.Router();
const { Kaizen } = require("../models/kaizen");

router.post("/", async (req, res) => {
  if (req.body.eid !== "" || req.body.eid !== undefined) {
    const kaizenData = await Kaizen.aggregate([
      {
        $graphLookup: {
          from: "kaizens",
          startWith: "$reportsTo",
          connectFromField: "reportsTo",
          connectToField: "name",
          as: "reportingHierarchy"
        }
      },
      {
        $group: {
          _id: {
            name: "$name",
            employeeName: "$employeeName",
            reportsTo: "$reportsTo",
            logged: "$logged",
            implemented: "$implemented"
          },
          lastUpdatedDate: { $last: "$date" }
        }
      }
    ]);
    res.send({
      data: kaizenData
        .filter(x => x._id.reportsTo === req.body.eid)
        .map(x => {
          const data = {
            employeeName: x._id.employeeName,
            employeeId: x._id.name,
            logged: x._id.logged,
            implemented: x._id.implemented
          };
          return data;
        })
    });
  }
});

module.exports = router;
