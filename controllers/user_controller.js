const { validationResult } = require("express-validator");
const User = require("../models/user_model");
const { generateToken } = require("../services/authorization");
const ShortUniqueId = require("short-unique-id");
const { hashPassword, checkPassword } = require("../services/encrypt_password");
const {updateImage} = require("../services/image");

async function handleUserLogin(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    console.log("result", result);
    return res
      .status(400)
      .json({ code: -1, msg: "Invalid Body", data: result });
  }

  try {
    const body = req.body;

    console.log(body);

    const foundUser = await User.findOne({ token: body.token });

    if (!foundUser) {
      // write logic when there is new user
      console.log("fcm_token: ", body.fcm_token);
      const newUser = User({
        name: body.name,
        email: body.email,
        password: body.password,
        avatar: body.avatar,
        description: body.description,
        fcm_token: body.fcm_token,
        open_id: body.open_id,
        type: body.type,
        token: body.token,
        phone: body.phone,
      });

      console.log("user: ", newUser);
      const token = generateToken(newUser);
      newUser.access_token = token;

      const createdUser = await newUser.save();
      return res
        .status(201)
        .json({ code: 0, msg: "User created successfully", data: createdUser });
    }

    // write logic when the user is old
    const token = generateToken(foundUser);
    // foundUser.access_token = token;

    const updatedUser = await User.findOneAndUpdate(
      { access_token: foundUser.access_token },
      { access_token: token, fcm_token: body.fcm_token },
      { new: true }
    );

    return res
      .status(200)
      .json({ code: 0, msg: "Login success", data: updatedUser });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ code: -1, msg: "Unable to login", data: e.message });
  }
}

async function handleGetUser(req, res) {
  const id = req.params.id;

  const foundUser = await User.findOne({ token: id });

  if (!foundUser) {
    return res.status(404).json({ code: 404, msg: "User not found", data: {} });
  }
  return res
    .status(200)
    .json({ code: 200, msg: "User found", data: foundUser });
}

async function handleChangeUserStatus(req, res) {
  const body = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { token: body.id },
    { online: body.online },
    { new: true }
  );

  return res
    .status(200)
    .json({ code: 200, msg: "updated user status", data: updatedUser });
}

async function handleUpdateUserProfile(req, res) {
  const avatar = req.body.image;
  const name = req.body.name;
  const email = req.body.email;
  const description = req.body.description;
  const phone = req.body.phone;
  const id = req.body.user;

  const updatedField = {
    name: name,
    email: email,
    description: description,
    phone: phone,
  };

  if (avatar != null) {
    updatedField["avatar"] = avatar;
  }

  console.log("fields", updatedField);
  console.log("id", id);

  const updatedUser = await User.findOneAndUpdate({ token: id }, updatedField, {
    new: true,
  });

  console.log("updated user: ", updatedUser);

  if (!updatedUser) {
    return res
      .status(400)
      .json({ code: 400, msg: "Unable to update", data: "No data found" });
  }
  console.log(updatedUser);

  return res
    .status(200)
    .json({ code: 200, msg: "Update successfully", data: updatedUser });
}

async function handleCreateUser(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const fcm_token = req.body.fcm_token;
  const phone = req.body.phone;

  const hashedPassword = await hashPassword(password);

  let image = "";

  if (req.file) {
    image = req.file.filename;
  } else {
    image = "dfljsad";
  }

  const foundUser = await User.findOne({ email: email });

  if (foundUser) {
    return res.status(200).json({ code: -1, msg: "User already exists" });
  }

  console.log("hashed password ${hashedPassword}");

  const uid = new ShortUniqueId({ length: 16 });

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    fcm_token: fcm_token,
    phone: phone,
    avatar: image,
    description: "",
    token: uid.rnd(),
  });

  const token = generateToken(newUser);
  newUser.access_token = token;

  const createdUser = await newUser.save();
  return res
    .status(201)
    .json({ code: 0, msg: "User created successfully", data: createdUser });
}

async function handleLoginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const fcm_token = req.body.fcm_token;

  const foundUser = await User.findOne({ email: email });

  if (!foundUser) {
    return res.status(200).json({ code: -1, msg: "User not found" });
  }

  const isPassword = await checkPassword(password, foundUser.password);

  console.log(isPassword);

  if (isPassword) {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { fcm_token: fcm_token },
      { new: true }
    );
    return res
      .status(200)
      .json({ code: 0, msg: "User found successfully", data: updatedUser });
  } else {
    return res.status(200).json({ code: -1, msg: "Invalid password" });
  }
}

async function updateProfileImage(req, res) {

  const path = req.file.filename;

  return res
    .status(200)
    .json({ code: 0, msg: "profile picture updated successfully", data: path });
}

module.exports = {
  handleUserLogin,
  handleGetUser,
  handleChangeUserStatus,
  handleUpdateUserProfile,
  handleCreateUser,
  handleLoginUser,
  updateProfileImage,
};
