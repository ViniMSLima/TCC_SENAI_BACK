const express = require("express");
const MachineController = require("../controller/machineController");
const router = express.Router();

router
  .get("/getmachines", MachineController.getMachines)

  .post("/getmachinesbyprocess", MachineController.getMachinesByProcess)
  .post("/postmachine", MachineController.postMachine)

module.exports = router;
