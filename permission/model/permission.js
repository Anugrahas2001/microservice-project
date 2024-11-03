const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  role: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("Permission", PermissionSchema);
