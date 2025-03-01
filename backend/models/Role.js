const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    permissions: { type: [String], default: [] } 
});

module.exports = mongoose.model("Role", roleSchema);
