const mongoose = require("mongoose");

const BfaLicense = mongoose.model(
  "BfaLicense",
  new mongoose.Schema({
    BudgetType: { type: String },
    DomainOwner: { type: String },
    SBG: { type: String },
    Source: { type: String },
    Domain: { type: String },
    Region: { type: String },
    Country: { type: String },
    VendorName: { type: String },
    ServiceDescription: { type: String },
    // 2018AOP: {type : String},
    // 2017Budget: {type : String},
    NewRenewalAmount: { type: String },
    Savings: { type: String },
    //2019AOPBFA: {type : String},
    SavingsCategory: { type: String },
    SvcPeriodstart: { type: String },
    SvcPeriodend: { type: String },
    Businessfunded: { type: String },
    RenewalStatus: { type: String }
  })
);

exports.BfaLicense = BfaLicense;
