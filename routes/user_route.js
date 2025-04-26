const { Router } = require("express");
const UserController = require("../controllers/user_controller");
const { checkSchema } = require("express-validator");
const upload = require("../services/image");

// validators
const userLoginValidationSchema = require("../validations/user_login_validation");

const router = Router();

router.post(
  "/login",
  checkSchema(userLoginValidationSchema),
  UserController.handleCreateUser,
);

router.put("/user/status", UserController.handleChangeUserStatus);
router.put("/user/profile", UserController.handleUpdateUserProfile);
router.put(
  "/user/update-profile",
  upload.single("image"),
  UserController.updateProfileImage
);

router.post(
  "/user/create",
  upload.single("image"),
  UserController.handleCreateUser
);
router.post("/user/", UserController.handleLoginUser);

router.get("/user/:id", UserController.handleGetUser);

module.exports = router;
