const express = require("express");
const router = express.Router();
const { NexThinkAppUsage } = require("../models/nexThinkAppUsage");
const { EnggApplication } = require("../models/enggApplication");

router.post("/", async (req, res) => {
  if (req.body.days > 0) {
    const timePeriodUsage = await NexThinkAppUsage.aggregate([
      {
        $match: {
          end_time: {
            $gte: new Date(
              new Date().getTime() - req.body.days * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      {
        $group: {
          _id: { cto_app_name: "$cto_app_name" }
        }
      }
    ]);

    const totalApp = await NexThinkAppUsage.aggregate([
      {
        $group: {
          _id: { cto_app_name: "$cto_app_name" }
        }
      }
    ]);
    res.send({
      data: {
        timePeriodUsageCount: totalApp.length - timePeriodUsage.length,
        totalAppCount: totalApp.length
      }
    });
  } else {
    res.sendStatus(400).send("Input: days, must be greater than 0");
  }
});

// router.post("/details", async (req, res) => {
//   if (req.body.days > 0) {
//     const detailedData = await NexThinkAppUsage.aggregate([
//       {
//         $match: {
//           end_time: {
//             $gte: new Date(
//               new Date().getTime() - req.body.days * 24 * 60 * 60 * 1000
//             )
//           }
//         }
//       },
//       {
//         $project: {
//           year: { $year: "$end_time" },
//           month: { $month: "$end_time" },
//           day: { $dayOfMonth: "$end_time" },
//           cto_app_name: 1,
//           SBG: 1,
//           SBU: 1,
//           Organization: 1,
//           connections_duration: 1
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: "$year",
//             month: "$month",
//             day: "$day",
//             cto_app_name: "$cto_app_name",
//             SBG: "$SBG",
//             SBU: "$SBU",
//             Organization: "$Organization"
//           },
//           totalDuration: { $sum: "$connections_duration" },
//           count: { $sum: 1 }
//         }
//       }
//     ]);
//     res.send(detailedData);
//   } else {
//     res.sendStatus(400).send("Input: days, must be greater than 0");
//   }
// });

//for grid
router.post("/details", async (req, res) => {
  if (req.body.days > 0) {
    const detailedUsedData = await NexThinkAppUsage.aggregate([
      // {
      //   $match: {
      //     end_time: {
      //       $gte: new Date(
      //         new Date().getTime() - req.body.days * 24 * 60 * 60 * 1000
      //       )
      //     }
      //   }
      // },
      {
        $project: {
          end_time: 1,
          // lastUsedDate:
          // {
          //   $dateToString: { format: "%Y-%m-%d", date: "$end_time" }
          // },
          cto_app_name: 1,
          SBG: 1,
          SBU: 1,
          Organization: 1,
          Domain: 1,
          connections_duration: 1,
          user_full_name: 1
        }
      },
      {
        $group: {
          _id: {
            //lastUsedDate: "$lastUsedDate",
            g_cto_app_name: "$cto_app_name",
            g_SBG: "$SBG",
            g_SBU: "$SBU",
            g_Organization: "$Organization",
            g_Domain: "$Domain",
            g_user_full_name: "$user_full_name"
          },
          g_lastUsedDate: { $max: "$end_time" },
          g_totalDuration: { $sum: "$connections_duration" }
        }
      },
      {
        $project: {
          g_cto_app_name: "$_id.g_cto_app_name",
          g_SBG: "$_id.g_SBG",
          g_SBU: "$_id.g_SBU",
          g_Organization: "$_id.g_Organization",
          g_Domain: "$_id.g_Domain",
          g_user_full_name: "$_id.g_user_full_name",
          g_lastUsedDate: "$g_lastUsedDate",
          g_totalDuration: "$g_totalDuration"
        }
      },
      {
        $group: {
          _id: {
            cto_app_name: "$g_cto_app_name",
            SBG: "$g_SBG",
            SBU: "$g_SBU",
            Organization: "$g_Organization",
            Domain: "$g_Domain"
          },
          lastUsedDate: { $max: "$g_lastUsedDate" },
          totalUsers: { $sum: 1 },
          totalDuration: { $sum: "$g_totalDuration" }
        }
      }
    ]);
    console.log(detailedUsedData);
    const UsedAppData = detailedUsedData.map(x => {
      const data = {
        cto_app_name: x._id.cto_app_name,
        SBG: x._id.SBG,
        SBU: x._id.SBU,
        Domain: x._id.Domain,
        Organization: x._id.Organization,
        lastUsedDate: x.lastUsedDate,
        totalDuration: x.totalDuration / 1000 / 60, //conversion of milli seconds to minutes.
        totalUsers: x.totalUsers
      };
      return data;
    });
    const usedAppNames = UsedAppData.map(x => x.cto_app_name); //list of used app names in array.

    let detailedUnsedData = await EnggApplication.find();
    for (let i = 0; i < usedAppNames.length; i++) {
      detailedUnsedData = detailedUnsedData.filter(
        x => x.BusinessApplicationName !== usedAppNames[i]
      );
    }
    const UnsedAppData = detailedUnsedData.map(x => {
      const data = {
        cto_app_name: x.BusinessApplicationName,
        SBG: x.SBG,
        SBU: x.SBU,
        Domain: x.Domain,
        Organization: x.Organization,
        lastUsedDate: "N/A",
        totalDuration: 0,
        totalUsers: 0
      };
      return data;
    });
    let finaldata = UsedAppData;
    for (let j = 0; j < UnsedAppData.length; j++) {
      finaldata.push(UnsedAppData[j]);
    }
    if (req.body.sbg) {
      finaldata = finaldata.filter(x => x.SBG === req.body.sbg);
    }
    if (req.body.sbu) {
      finaldata = finaldata.filter(x => x.SBU === req.body.sbu);
    }
    if (req.body.domain) {
      finaldata = finaldata.filter(x => x.Domain === req.body.domain);
    }
    res.send({
      data: finaldata
    });
  } else {
    res.sendStatus(400).send("Input: days, must be greater than 0");
  }
});

//for line graph
router.post("/usageGraph", async (req, res) => {
  if (req.body.days > 0) {
    const dateFormat = req.body.days > 31 ? "%Y-%m" : "%Y-%m-%d";
    const detailedUsedData = await NexThinkAppUsage.aggregate([
      {
        $match: {
          end_time: {
            $gte: new Date(
              new Date().getTime() - req.body.days * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      {
        $project: {
          lastUsedDate: {
            $dateToString: { format: dateFormat, date: "$end_time" }
          },
          cto_app_name: 1,
          connections_duration: 1
        }
      },
      {
        $group: {
          _id: { lastUsedDate: "$lastUsedDate", cto_app_name: "$cto_app_name" },
          totalDuration: { $sum: "$connections_duration" },
          count: { $sum: 1 }
        }
      }
    ]);
    const UsedAppData = detailedUsedData.map(x => {
      const data = {
        lastUsedDate: x._id.lastUsedDate,
        cto_app_name: x._id.cto_app_name,
        totalDuration: x.totalDuration / 1000 / 60, //conversion of milli seconds to minutes.
        count: x.count
      };
      return data;
    });
    res.send({
      data: UsedAppData
    });
  } else {
    res.sendStatus(400).send("Input: days, must be greater than 0");
  }
});

module.exports = router;
