const express = require("express");
const PlayerController = require("../controller/userController");
const router = express.Router();

router
  .post("/postplayer", PlayerController.postPlayer)
  .get("/getplayers", PlayerController.getPlayers)
  .get("/deleteplayers", PlayerController.clearPlayers);

module.exports = router;
