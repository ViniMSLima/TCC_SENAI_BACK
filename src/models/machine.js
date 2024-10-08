const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  AIAccuracy: {
    type: Number,
    required: true,
    minlength: 3,
  },
  Process: {
    type: String,
    required: true,
    minlength: 4,
  },
  Blue: {
    type: Number,
    required: false,
  },
  Red: {
    type: Number,
    required: false
  },
  Rejected: {
    type: Number,
    required: false,
    minlength: 2,
  },
  Sector: {
    type: String,
    required: true,
    minlength: 2,
  },
  Details: {
    type: String,
    required: false,
    minlength: 2,
  },
  Scanned: {
    type: Number,
    required: false,
    minlength: 2,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  removedAt: {
    type: Date,
    required: false,
  },
});

const Machine = mongoose.model("Machine", MachineSchema);
exports.Machine = Machine;
exports.MachineSchema = MachineSchema;