const express = require("express");
const MachineController = require("../controller/machineController");
const router = express.Router();

router
  .get("/getmachines", MachineController.getMachines)
  .get("/getmachinesbysector/:sector", MachineController.getMachinesBySector)

  .post("/postmachine", MachineController.postMachine)

module.exports = router;
