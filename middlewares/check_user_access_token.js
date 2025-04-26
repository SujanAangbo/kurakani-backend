const { getUser } = require("../services/authorization");
const User = require("../models/user_model");

async function checkUserAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const userToken = authHeader.split(" ")[1];

      if (!userToken) {
        return res.status(401).json({
          code: 401,
          msg: "User's access_token is missing",
          data: "Send user access token to continue!",
        });
      }
      const user = getUser(userToken);

      if (!user) {
        return res.status(404).json({
          code: 404,
          msg: "Token not found",
          data: "The token you send is expire or not valid token. Please provide correct and valid token",
        });
      }

      const foundUser = await User.findOne({ token: user.token });

      if (!foundUser) {
        return res.status(404).json({
          code: 404,
          msg: "User not found",
          data: "The token you send is expire or not valid token. Please provide correct and valid token",
        });
      }

      req.user = foundUser;
      next();
    } else {
      return res.status(401).json({
        code: 401,
        msg: "Authorization header missing or incorrect",
        data: "Please provide a valid Bearer token in the authorization header.",
      });
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res.status(500).json({
      code: 500,
      msg: "Internal server error",
      data: "Something went wrong. Please try again later.",
    });
  }
}

module.exports = {
  checkUserAccessToken,
};
