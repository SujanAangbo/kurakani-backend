const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: String,
    email_verified: Date,
    password: String,
    access_token: { type: String, required: true },
    avatar: { type: String, required: true },
    description: String,
    expire_date: Date,
    fcm_token: String,
    online: { type: Number, default: 1 },
    open_id: String,
    type: Number,
    token: { type: String, required: true },
    phone: String,
  },
  { timestamps: true, collection: "user" }
);

const User = model("user", userSchema);

module.exports = User;
