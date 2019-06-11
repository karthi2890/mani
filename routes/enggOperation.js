const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { EnggOperation } = require("../models/enggOperation");
//Incidents for today or "N" number of days
router.post("/incidents", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    let incidentsForTimePeriod = await EnggOperation.aggregate([
      {
        $match: {
          Created: {
            $gte: fromDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 }
        }
      }
    ]);
    if (incidentsForTimePeriod.length > 0)
      res.send({
        data: {
          totalCount: incidentsForTimePeriod[0].totalCount
        }
      });
    else
      res.send({
        data: {
          totalCount: 0
        }
      });
  }
});
//Current month incidents.
router.post("/incidentsCurrentMonth", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    let incidentsForTimePeriod = await EnggOperation.aggregate([
      {
        $match: {
          Created: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: { Priority: "$Priority" },
          priorityCount: { $sum: 1 }
        }
      }
    ]);

    incidentsForTimePeriod = incidentsForTimePeriod.map(x => {
      const data = {
        priority: x._id.Priority,
        priorityCount: x.priorityCount
      };
      return data;
    });

    let totalCount = 0;
    if (incidentsForTimePeriod) {
      for (let i = 0; i < incidentsForTimePeriod.length; i++) {
        totalCount += incidentsForTimePeriod[i].priorityCount;
      }
    }
    res.send({
      data: {
        fromDate,
        totalCount,
        incidents: incidentsForTimePeriod
      }
    });
  }
});
//Unassigned Incidents older than "N" days.
router.post("/unAssignedIncidents", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    let unincidentsForTimePeriod = await EnggOperation.aggregate([
      {
        $match: {
          Created: {
            $gte: fromDate
          },
          State: "New",
          AssignedTo: ""
        }
      },
      {
        $group: {
          _id: { Priority: "$Priority" },
          priorityCount: { $sum: 1 }
        }
      }
    ]);

    unincidentsForTimePeriod = unincidentsForTimePeriod.map(x => {
      const data = {
        priority: x._id.Priority,
        priorityCount: x.priorityCount
      };
      return data;
    });

    let totalCount = 0;
    if (unincidentsForTimePeriod) {
      for (let i = 0; i < unincidentsForTimePeriod.length; i++) {
        totalCount += unincidentsForTimePeriod[i].priorityCount;
      }
    }
    res.send({
      data: {
        totalCount,
        incidents: unincidentsForTimePeriod
      }
    });
  }
});

//NPI engg - Sev 1/2 & Sev 3/4 Summary
router.post("/sevSummary", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    const sevSummaryForTimePeriod = await EnggOperation.aggregate([
      {
        $match: {
          //Priority: { $in: ["1 - Critical", "2 - High"] },
          Created: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: { Priority: "$Priority" },
          priorityCount: { $sum: 1 }
        }
      }
    ]);

    res.send({
      data: {
        fromDate,
        sevSummary: sevSummaryForTimePeriod.map(x => {
          const data = {
            priority: x._id.Priority,
            priorityCount: x.priorityCount
          };
          return data;
        })
      }
    });
  }
});
//Severity Counts - this year
router.post("/sevCountThisYear", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    const sevCountThisYear = await EnggOperation.aggregate([
      {
        $match: {
          Created: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: { Priority: "$Priority" },
          priorityCount: { $sum: 1 }
        }
      }
    ]);

    res.send({
      data: {
        sevCountThisYear: sevCountThisYear.map(x => {
          const data = {
            priority: x._id.Priority,
            priorityCount: x.priorityCount
          };
          return data;
        })
      }
    });
  }
});
//Re-assignment Counts - this month
router.post("/reassignmentCount", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    const reassignCount = await EnggOperation.aggregate([
      {
        $match: {
          ReassignmentCount: { $gt: 1 },
          Created: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: { ReassignmentCount: "$ReassignmentCount" },
          ReassignmentCount_total: { $sum: 1 }
        }
      }
    ]);

    res.send({
      data: {
        fromDate,
        reassignCount: reassignCount.map(x => {
          const data = {
            ReassignmentCount: x._id.ReassignmentCount,
            ReassignmentCount_total: x.ReassignmentCount_total
          };
          return data;
        })
      }
    });
  }
});
//Re-Open Counts - this Year
router.post("/reOpenCount", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    const reOpenCount = await EnggOperation.aggregate([
      {
        $match: {
          ReopenCount: { $gt: 0 },
          Created: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: { ReopenCount: "$ReopenCount" },
          ReopenCount_total: { $sum: 1 }
        }
      }
    ]);
    res.send({
      data: {
        reOpenCount: reOpenCount.map(x => {
          const data = {
            ReopenCount: x._id.ReopenCount,
            ReopenCount_total: x.ReopenCount_total
          };
          return data;
        })
      }
    });
  }
});
//Ageing
router.get("/ageing", async (req, res) => {
  const ageingSameDay = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(
            `${new Date().getFullYear()}-${new Date().getMonth() +
              1}-${new Date().getDate()}`
          )
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing2Days = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing2_5Days = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing5_7Days = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing1_2Weeks = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing2_4Weeks = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing1_2Months = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          $gte: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing2MonthAbove = await EnggOperation.aggregate([
    {
      $match: {
        State: { $in: ["New", "In Progress", "On Hold"] },
        Created: {
          // $gte: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: { Priority: "$Priority" },
        count: { $sum: 1 }
      }
    }
  ]);
  const ageing = {
    ageingSameDay: ageingSameDay.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing2Days: ageing2Days.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing2_5Days: ageing2_5Days.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing5_7Days: ageing5_7Days.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing1_2Weeks: ageing1_2Weeks.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing2_4Weeks: ageing2_4Weeks.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing1_2Months: ageing1_2Months.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    }),
    ageing2MonthAbove: ageing2MonthAbove.map(x => {
      const data = {
        priority: x._id.Priority,
        count: x.count
      };
      return data;
    })
  };
  res.send({
    data: ageing
  });
});
//Incident Duration Summary
router.post("/durationSummary", async (req, res) => {
  let fromDate = new Date(req.body.fromDate);
  const durationSummary = await EnggOperation.aggregate([
    {
      $addFields: {
        CurrentMonth: { $month: "$Created" }
      }
    },
    {
      $match: {
        Created: {
          $gte: new Date(fromDate)
        }
      }
    },
    {
      $group: {
        _id: { CurrentMonth: "$CurrentMonth" },
        average: { $avg: "$BusinessDuration" }
      }
    }
  ]);
  res.send({
    data: {
      durationSummary: durationSummary.map(x => {
        const data = {
          CurrentMonth: x._id.CurrentMonth,
          average: x.average
        };
        return data;
      })
    }
  });
});
//Incident Category - this month
router.post("/incidentCategory", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    const incidentCategory = await EnggOperation.aggregate([
      {
        $match: {
          Created: {
            $gte: new Date(fromDate)
          }
        }
      },
      {
        $group: {
          _id: { Category: "$Category" },
          count: { $sum: 1 }
        }
      }
    ]);
    res.send({
      data: {
        incidentCategory: incidentCategory.map(x => {
          const data = {
            category: x._id.Category,
            count: x.count
          };
          return data;
        })
      }
    });
  }
});
//---------------details----------------------

router.post("/incidentDetail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              Created: {
                $gte: fromDate
              }
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1
            }
          }
        ])
      }
    });
  }
});
//unassigned details
router.post("/unassignedDetail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              Created: {
                $gte: fromDate
              },
              State: "New",
              AssignedTo: ""
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1
            }
          }
        ])
      }
    });
  }
});
//sev12 details
router.post("/sev12Detail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              Created: {
                $gte: fromDate
              },
              Priority: { $in: ["1 - Critical", "2 - High"] }
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1
            }
          }
        ])
      }
    });
  }
});
//sev34 details
router.post("/sev34Detail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              Created: {
                $gte: fromDate
              },
              Priority: { $in: ["3 - Moderate", "4 - Low"] }
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1
            }
          }
        ])
      }
    });
  }
});
//sevCount details
router.post("/sevCountDetail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              Created: {
                $gte: fromDate
              }
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1
            }
          }
        ])
      }
    });
  }
});
//Re-assignment Count details
router.post("/reassignmentCountDetail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              ReassignmentCount: { $gt: 1 },
              Created: {
                $gte: fromDate
              }
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1,
              ReassignmentCount: 1
            }
          }
        ])
      }
    });
  }
});
//Re-Open Count details
router.post("/reOpenCountDetail", async (req, res) => {
  if (req.body.fromDate) {
    let fromDate = new Date(req.body.fromDate);
    res.send({
      data: {
        incidents: await EnggOperation.aggregate([
          {
            $match: {
              ReopenCount: { $gt: 0 },
              Created: {
                $gte: fromDate
              }
            }
          },
          {
            $project: {
              _id: 0,
              Number: 1,
              Application: 1,
              Created: 1,
              CreatedBy: 1,
              Description: 1,
              ImpactedSBGs: 1,
              IncidentState: 1,
              Location: 1,
              Priority: 1,
              Severity: 1,
              ShortDescription: 1,
              State: 1,
              ReopenCount: 1
            }
          }
        ])
      }
    });
  }
});

module.exports = router;
