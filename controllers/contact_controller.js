const User = require("../models/user_model");

async function handleGetAllContacts(req, res) {
  try {
    console.log(req.user);
    const foundUsers = await User.find({ token: { $ne: req.user.token } });
    return res
      .status(200)
      .json({ code: 200, msg: "Contacts found!", data: foundUsers });
  } catch (e) {
    return res.status(500).json({
      code: 500,
      msg: "Internal server error",
      data: e.message,
    });
  }
}

module.exports = {
  handleGetAllContacts,
};
