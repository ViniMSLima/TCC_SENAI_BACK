const mongoose = require("mongoose");
const config = require("config");
require("dotenv").config();

module.exports = function () {
  const db = config.get(process.env.MONGODB);
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`connected to ${db}`));
};