const express = require("express");
const user = require("../src/routes/user");
const machine = require("../src/routes/machine");

module.exports = function (app) 
{
  app
    .use(express.json())
    .use("/user", user)
    .use("/machine", machine)
};
