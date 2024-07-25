const express = require("express");
const PlayerController = require("../controller/userController");
const router = express.Router();

router
  .get("/getusers", PlayerController.getUsers)
  .get("/getuserbyboschid", PlayerController.getUserByBoschID)
  .get("/deleteusers", PlayerController.clearUsers)
  .get("/test", PlayerController.test)

  .post("/postuser", PlayerController.postUser)

  .delete("/deleteuser", PlayerController.deleteById);

module.exports = router;
