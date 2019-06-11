const { Sentiment, validate } = require('../models/sentiment');
const express = require('express');
const router = express.Router();



router.get('/csat', async (req, res) => {
    const sentimentCount = await Sentiment.aggregate([
        {
            $match: {
                sentimentScore: { $gte: 1 } //need to update to 4
            }
        },
        {
            $project: {
                month: { $month: "$createdOn" },
                year: { $year: "$createdOn" },
                sentimentScore: 1
            }
        },
        {
            $group: {
                _id: { month: "$month", year: "$year" },
                totalCount: { $sum: 1 }
            }
        }
    ])
    const totalCount = await Sentiment.aggregate([
        {
            $match: {
                sentimentScore: { $gte: 0 }
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    res.send({
        data: {
            "sentimentScore": sentimentCount.map(x => {
                const data = {
                    month: x._id.month,
                    year: x._id.year,
                    score: x.totalCount / totalCount[0].count
                }
                return data
            }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0))
        }
    });
});

router.get('/csatSentiment', async (req, res) => {
    if ((req.body.serviceOwner === "" && req.body.serviceGroup === "" && (req.body.timePeriod === "" || req.body.timePeriod === "YTD")) || (req.body.serviceOwner === undefined && req.body.serviceGroup === undefined && (req.body.timePeriod === undefined || req.body.timePeriod === "YTD"))) {
        const csatSentimentCount = await Sentiment.aggregate([
            {
                $sort: { createdOn: -1 }
            },
            {
                $project: {
                    day: { $dayOfMonth: "$createdOn" },
                    month: { $month: "$createdOn" },
                    year: { $year: "$createdOn" },
                    sentimentType: 1
                }
            },
            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year", sentimentType: "$sentimentType" },
                    totalCount: { $sum: 1 }
                }
            }
        ])
        res.send({
            data: {
                "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        day: x._id.day,
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }),
                "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        day: x._id.day,
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                })
                //.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0))
                ,
                "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
                    const data = {
                        day: x._id.day,
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                })
            }
        });
    }
    else {
        const csatSentimentCount = await Sentiment.aggregate([
            {
                $sort: { createdOn: -1 }
            },
            {
                $match: {
                    $or: [
                        { serviceOwner: { $in: req.body.serviceOwner } },
                        { serviceGroup: { $in: req.body.serviceGroup } }
                    ]
                }
            },
            {
                $project: {
                    day: { $dayOfMonth: "$createdOn" },
                    month: { $month: "$createdOn" },
                    year: { $year: "$createdOn" },
                    sentimentType: 1
                }
            },
            {
                $group: {
                    _id: { day: "$day", month: "$month", year: "$year", sentimentType: "$sentimentType" },
                    totalCount: { $sum: 1 }
                }
            }
        ])
        res.send({
            data: {
                "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        day: x._id.day,
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }),
                "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        day: x._id.day,
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }),
                "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
                    const data = {
                        day: x._id.day,
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                })
            }
        });
    }
});

router.get('/problemVsSentiment', async (req, res) => {
    if ((req.body.serviceOwner === "" && req.body.serviceGroup === "" && (req.body.timePeriod === "" || req.body.timePeriod === "YTD")) || (req.body.serviceOwner === undefined && req.body.serviceGroup === undefined && (req.body.timePeriod === undefined || req.body.timePeriod === "YTD"))) {
        const csatSentimentCount = await Sentiment.aggregate([
            {
                $project: {
                    month: { $month: "$createdOn" },
                    year: { $year: "$createdOn" },
                    sentimentType: 1
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year", sentimentType: "$sentimentType" },
                    totalCount: { $sum: 1 }
                }
            }
        ])
        res.send({
            data: {
                "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
                "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
                "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
                    const data = {
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0))
            }
        });
    }
    else {
        const csatSentimentCount = await Sentiment.aggregate([
            {
                $match: {
                    $or: [
                        { serviceOwner: { $in: req.body.serviceOwner } },
                        { serviceGroup: { $in: req.body.serviceGroup } }
                    ]
                }
            },
            {
                $project: {
                    month: { $month: "$createdOn" },
                    year: { $year: "$createdOn" },
                    sentimentType: 1
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year", sentimentType: "$sentimentType" },
                    totalCount: { $sum: 1 }
                }
            }
        ])
        res.send({
            data: {
                "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
                "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
                "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
                    const data = {
                        month: x._id.month,
                        year: x._id.year,
                        totalCount: x.totalCount
                    }
                    return data
                }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0))
            }
        });
    }
});

router.get('/csatMetrics', async (req, res) => {
    if ((req.body.serviceOwner === "" && req.body.serviceGroup === "" && (req.body.timePeriod === "" || req.body.timePeriod === "YTD")) || (req.body.serviceOwner === undefined && req.body.serviceGroup === undefined && (req.body.timePeriod === undefined || req.body.timePeriod === "YTD"))) {
        const goodScoreCount = await Sentiment.aggregate([
            {
                $match: {
                    sentimentScore: { $gte: 1 } //need to update to 4
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalCount = await Sentiment.aggregate([
            {
                $match: {
                    sentimentScore: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);
        const sentimentTypeCount = await Sentiment.aggregate([
            {
                $group: {
                    _id: { sentimentType: "$sentimentType" },
                    count: { $sum: 1 }
                }
            }
        ]);
        if (goodScoreCount.length > 0) {
            const csatScore = goodScoreCount[0].count / totalCount[0].count;
            res.send({
                data: {
                    "csatScore": csatScore,
                    "sentimentTypeCount": {
                        "positive": sentimentTypeCount.filter(x => x._id.sentimentType === "positive").map(x => x.count).shift(),
                        "negative": sentimentTypeCount.filter(x => x._id.sentimentType === "negative").map(x => x.count).shift(),
                        "neutral": sentimentTypeCount.filter(x => x._id.sentimentType === "nuetral").map(x => x.count).shift(),
                    }
                }
            });
        }
        else {
            res.send({
                data: {
                    "csatScore": 0
                }
            });
        }
    }
    else {
        const goodScoreCount = await Sentiment.aggregate([
            {
                $match: {
                    sentimentScore: { $gte: 1 }, //need to update to 4
                    $or: [
                        { serviceOwner: { $in: req.body.serviceOwner } },
                        { serviceGroup: { $in: req.body.serviceGroup } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalCount = await Sentiment.aggregate([
            {
                $match: {
                    sentimentScore: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);
        if (goodScoreCount.length > 0) {
            const csatScore = goodScoreCount[0].count / totalCount[0].count;
            res.send({
                data: {
                    "csatScore": csatScore
                }
            });
        }
        else {
            res.send({
                data: {
                    "csatScore": 0
                }
            });
        }
    }
})

router.get('/itPersona', async (req, res) => {
    if ((req.body.serviceOwner === "" && req.body.serviceGroup === "" && (req.body.timePeriod === "" || req.body.timePeriod === "YTD")) || (req.body.serviceOwner === undefined && req.body.serviceGroup === undefined && (req.body.timePeriod === undefined || req.body.timePeriod === "YTD"))) {
        const data = await Sentiment.aggregate([
            {
                $group: {
                    _id: { itProfile: "$itProfile", sentimentType: "$sentimentType" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        res.send({
            data: {
                positive: data.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        itProfile: x._id.itProfile,
                        count: x.count
                    }
                    return data
                }),
                negative: data.filter(y => y._id.sentimentType === "negative").map(x => {
                    const data = {
                        itProfile: x._id.itProfile,
                        count: x.count
                    }
                    return data
                }),
                neutral: data.filter(z => z._id.sentimentType === "nuetral").map(x => {
                    const data = {
                        itProfile: x._id.itProfile,
                        count: x.count
                    }
                    return data
                })
            }
        });
    }
    else {
        // const data =  res.send({
        //     data : await Sentiment.find()
        //     .or([{serviceOwner : { $regex: '.*' + req.body.serviceOwner + '.*', $options: 'i' }},{serviceGroup : { $regex: '.*' + req.body.serviceGroup + '.*', $options: 'i' }}])
        // });

        const data = await Sentiment.aggregate([
            {
                $match: {
                    $or: [
                        { serviceOwner: { $in: req.body.serviceOwner } },
                        { serviceGroup: { $in: req.body.serviceGroup } }
                    ]
                }
            },
            {
                $group: {
                    _id: { itProfile: "$itProfile", sentimentType: "$sentimentType" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        res.send({
            data: {
                positive: data.filter(x => x._id.sentimentType === "positive").map(x => {
                    const data = {
                        itProfile: x._id.itProfile,
                        count: x.count
                    }
                    return data
                }),
                negative: data.filter(y => y._id.sentimentType === "negative").map(x => {
                    const data = {
                        itProfile: x._id.itProfile,
                        count: x.count
                    }
                    return data
                }),
                neutral: data.filter(z => z._id.sentimentType === "nuetral").map(x => {
                    const data = {
                        itProfile: x._id.itProfile,
                        count: x.count
                    }
                    return data
                })
            }
        });
    }
})

router.get('/topProblemVsSentiments', async (req, res) => {
    if ((req.body.serviceOwner === "" && req.body.serviceGroup === "" && (req.body.timePeriod === "" || req.body.timePeriod === "YTD")) || (req.body.serviceOwner === undefined && req.body.serviceGroup === undefined && (req.body.timePeriod === undefined || req.body.timePeriod === "YTD"))) {
        const topProblems = await Sentiment.aggregate([
            {
                $match: {
                    serviceName: { "$exists": true, "$ne": null }
                }
            },
            {
                $project: {
                    serviceName: 1
                }
            },
            {
                $group: {
                    _id: { serviceName: "$serviceName" },
                    totalCount: { $sum: 1 }
                }
            },
            {
                $sort: {
                    totalCount: -1
                }
            },
            {
                $limit: 5
            }
        ])
        const topServiceName = topProblems.map(x => x._id.serviceName);
        const topProblemSentiment = await Sentiment.aggregate([
            {
                $match: {
                    serviceName: { $in: topServiceName }
                }
            },
            {
                $project: {
                    serviceName: 1,
                    sentimentType: 1
                }
            },
            {
                $group: {
                    _id: { serviceName: "$serviceName", sentimentType: "$sentimentType" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);
        let testdata = {};
        for (let i = 0; i < topProblemSentiment.length; i++) {
            testdata[topProblemSentiment[i].serviceName] = (testdata[topProblemSentiment[i].serviceName] || 0) + 1;
        }
        console.log(testdata)
        res.send({
            data: {
                topProblems: topProblems.map(x => {
                    const data = {
                        serviceName: x._id.serviceName,
                        totalCount: x.totalCount
                    }
                    return data;
                }),
                topProblemSentiment: topProblemSentiment.map(x => {
                    const data = {
                        serviceName: x._id.serviceName,
                        sentimentType: x._id.sentimentType,
                        totalCount: x.totalCount
                    }
                    return data;
                })
            }
        });
        // res.send({
        //     data: {
        //         "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
        //             const data = {
        //                 month: x._id.month,
        //                 year: x._id.year,
        //                 totalCount: x.totalCount
        //             }
        //             return data
        //         }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
        //         "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
        //             const data = {
        //                 month: x._id.month,
        //                 year: x._id.year,
        //                 totalCount: x.totalCount
        //             }
        //             return data
        //         }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
        //         "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
        //             const data = {
        //                 month: x._id.month,
        //                 year: x._id.year,
        //                 totalCount: x.totalCount
        //             }
        //             return data
        //         }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0))
        //     }
        // });
    }
    // else {
    //     const csatSentimentCount = await Sentiment.aggregate([
    //         {
    //             $match: {
    //                 $or: [
    //                     { serviceOwner: { $in: req.body.serviceOwner } },
    //                     { serviceGroup: { $in: req.body.serviceGroup } }
    //                 ]
    //             }
    //         },
    //         {
    //             $project: {
    //                 month: { $month: "$createdOn" },
    //                 year: { $year: "$createdOn" },
    //                 sentimentType: 1
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: { month: "$month", year: "$year", sentimentType: "$sentimentType" },
    //                 totalCount: { $sum: 1 }
    //             }
    //         }
    //     ])
    //     res.send({
    //         data: {
    //             "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
    //                 const data = {
    //                     month: x._id.month,
    //                     year: x._id.year,
    //                     totalCount: x.totalCount
    //                 }
    //                 return data
    //             }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
    //             "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
    //                 const data = {
    //                     month: x._id.month,
    //                     year: x._id.year,
    //                     totalCount: x.totalCount
    //                 }
    //                 return data
    //             }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)),
    //             "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
    //                 const data = {
    //                     month: x._id.month,
    //                     year: x._id.year,
    //                     totalCount: x.totalCount
    //                 }
    //                 return data
    //             }).sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0)).sort((a, b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0))
    //         }
    //     });
    // }
});

router.get('/country', async (req, res) => {
    if ((req.body.serviceOwner === "" && req.body.serviceGroup === "" && (req.body.timePeriod === "" || req.body.timePeriod === "YTD")) || (req.body.serviceOwner === undefined && req.body.serviceGroup === undefined && (req.body.timePeriod === undefined || req.body.timePeriod === "YTD"))) {
        const countryProblem = await Sentiment.aggregate([
            {
                $match: {
                    country: { "$exists": true, "$ne": null },
                    serviceName: { "$exists": true, "$ne": null }
                }
            },
            {
                $project: {
                    serviceName: 1,
                    country: 1
                }
            },
            {
                $group: {
                    _id: { country: "$country", serviceName: "$serviceName" },
                    totalCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalCount: -1 }
            }
        ])
        const countryScore = await Sentiment.aggregate([
            {
                $match: {
                    sentimentScore: { $gte: 0 } //need to update to 4
                }
            },
            {
                $project: {
                    country: 1
                }
            },
            {
                $group: {
                    _id: { country: "$country" },
                    totalCount: { $sum: 1 }
                }
            }
        ])
        const totalRecords = await Sentiment.aggregate([
            {
                $match: {
                    sentimentScore: { $gte: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])
        console.log(countryProblem.map(x => {
            const d = {
                country: x._id.country,
                serviceName: x._id.serviceName,
                totalCount: x.totalCount
            }
            return d;
        }));
        res.send({
            data: {
                countryScore: countryScore.map(x => {
                    const data = {
                        country: x._id.country,
                        score: x.totalCount / totalRecords[0].count
                    }
                    return data;
                })
            }
        });
        // res.send({
        //     data : {
        //         positive : csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x=>{
        //             const data = {
        //                 country : x._id.country,
        //                 serviceName : x._id.serviceName,
        //                 sentimentType : x._id.sentimentType,
        //                 totalCount : x.totalCount
        //             }
        //             return data;
        //         })
        //     }});
    }
    // else {
    //     const csatSentimentCount = await Sentiment.aggregate([
    //         {
    //             $sort: { createdOn: -1 }
    //         },
    //         {
    //             $match: {
    //                 $or: [
    //                     { serviceOwner: { $in: req.body.serviceOwner } },
    //                     { serviceGroup: { $in: req.body.serviceGroup } }
    //                 ]
    //             }
    //         },
    //         {
    //             $project: {
    //                 day: { $dayOfMonth: "$createdOn" },
    //                 month: { $month: "$createdOn" },
    //                 year: { $year: "$createdOn" },
    //                 sentimentType: 1
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: { day: "$day", month: "$month", year: "$year", sentimentType: "$sentimentType" },
    //                 totalCount: { $sum: 1 }
    //             }
    //         }
    //     ])
    //     res.send({
    //         data: {
    //             "positive": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
    //                 const data = {
    //                     day: x._id.day,
    //                     month: x._id.month,
    //                     year: x._id.year,
    //                     totalCount: x.totalCount
    //                 }
    //                 return data
    //             }),
    //             "negative": csatSentimentCount.filter(x => x._id.sentimentType === "positive").map(x => {
    //                 const data = {
    //                     day: x._id.day,
    //                     month: x._id.month,
    //                     year: x._id.year,
    //                     totalCount: x.totalCount
    //                 }
    //                 return data
    //             }),
    //             "neutral": csatSentimentCount.filter(x => x._id.sentimentType === "nuetral").map(x => {
    //                 const data = {
    //                     day: x._id.day,
    //                     month: x._id.month,
    //                     year: x._id.year,
    //                     totalCount: x.totalCount
    //                 }
    //                 return data
    //             })
    //         }
    //     });
    // }
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.sendStatus(400).send(error.details[0].message);

    let sentiment = new Sentiment({
        customerFeedback: req.body.customerFeedback,
        createdOn: req.body.createdOn,
        itProfile: req.body.itProfile,
        country: req.body.country,
        serviceNumber: req.body.serviceNumber,
        serviceName: req.body.serviceName,
        serviceOwner: req.body.serviceOwner,
        serviceGroup: req.body.serviceGroup,
        serviceLeader: req.body.serviceLeader,
        rating: req.body.rating,
        sentimentType: req.body.sentimentType,
        sentimentScore: req.body.sentimentScore
    })
    res.send(await sentiment.save());
})

module.exports = router;


