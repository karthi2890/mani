const mongoose = require("mongoose");

const NexThinkAppUsage = mongoose.model(
  "NexThinkAppUsage",
  new mongoose.Schema({
    web_name: { type: String },
    cto_app_name: { type: String },
    cto_uid_number: { type: String },
    start_time: { type: Date },
    end_time: { type: Date },
    connections_duration: { type: Number },
    web_request_protocol: { type: String },
    device_name: { type: String },
    device_last_ip_address: { type: String },
    user_full_name: { type: String },
    time: { type: Date },
    engine_name: { type: String },
    app_name: { type: String },
    execution_binary_path: { type: String },
    binary_executable_name: { type: String },
    binary_version: { type: String }
  })
);

exports.NexThinkAppUsage = NexThinkAppUsage;
