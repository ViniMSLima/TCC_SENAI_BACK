const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router
  .get("/getusers", userController.getUsers)
  .get("/getuserbyboschid", userController.getUserByBoschID)
  .get("/deleteusers", userController.clearUsers)

  .post("/userlogin", userController.userLogin)
  .post("/postuser", userController.postUser)
  .post("/getauthuser", userController.getAuthUser)
  .post("/newpassword/:boschID", userController.updateByBoschId)

  .delete("/clearusers", userController.clearUsers)
  .delete("/deleteuser", userController.deleteById);
module.exports = router;
