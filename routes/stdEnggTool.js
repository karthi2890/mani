const mongoose = require("mongoose");
const { StdEnggTool } = require("../models/stdEnggTool");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  let data = await StdEnggTool.find();
  //   let category = new Set();
  //   let value = "";
  //   for (let i = 0; i < data.length; i++) {
  //     value = `${[data[i].standardCategory.trim()]}$$$${
  //       data[i].subCategory ? data[i].subCategory.trim() : ""
  //     }`;
  //     category.add(value);
  //   }
  //   let finaldata = [];
  //   for (let item of category) {
  //     category = item.substring(0, item.indexOf("$$$"));
  //     subCategory =
  //       item.substring(item.indexOf("$$$") + 3, item.length).length > 0
  //         ? item.substring(item.indexOf("$$$") + 3, item.length)
  //         : undefined;
  //     finaldata.push({
  //       category,
  //       subCategory: subCategory ? subCategory : "",
  //       tools: data.filter(x =>
  //         !subCategory || subCategory === ""
  //           ? x.standardCategory === category
  //           : x.subCategory === subCategory && x.standardCategory === category
  //       )
  //     });
  // console.log(category);
  // console.log(subCategory);
  // console.log(finaldata);
  // data = data.filter(x =>
  //   !subCategory || subCategory === ""
  //     ? x.standardCategory !== category
  //     : x.subCategory !== subCategory && x.standardCategory !== category
  // );
  //}
  res.send({
    data
    //data: finaldata
  });
});

module.exports = router;
