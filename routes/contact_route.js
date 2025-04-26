const { Router } = require("express");
const ContactController = require("../controllers/contact_controller");
const {checkUserAccessToken} = require("../middlewares/check_user_access_token");

const router = Router();

router.post("/", checkUserAccessToken, ContactController.handleGetAllContacts);

module.exports = router;
