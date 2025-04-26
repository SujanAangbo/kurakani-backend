const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

// firebase setup
const admin = require("firebase-admin");
const serviceAccount = process.env.NODE_ENV === 'prod'
  ? require('/etc/secrets/firebaseServiceAccount.json')
  : require(path.join(__dirname, 'config', 'firebaseServiceAccount.json'));

admin.initializeApp({
  credential: admin.credential.cert(process.env.NODE_ENV === 'prod'
    ? '/etc/secrets/firebaseServiceAccount.json' : serviceAccount),
});

// user routes
const userRoute = require("./routes/user_route");
const contactRoute = require("./routes/contact_route");

// connect to database
// mongoose
//   .connect("mongodb://localhost:27017/kurakani")
//   .then(() => console.log("Connected to database"));

  mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to database"));

// creating servers
const app = express();
const server = http.createServer(app); // use this in socket

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));

app.get("/api/gegoData", (req, res) => res.json({
  'app_id': process.env.GEGO_APP_ID,
  'app_sign': process.env.GEGO_APP_SIGN,
}));

app.use("/api", userRoute);
app.use("/api/contact", contactRoute);

app.get("/", (req, res) => res.send("Hello World"));

app.post("/api/sendMessage", (req, res) => {
  const body = req.body;
  // if (!body.user) {
  //   return res
  //     .status(400)
  //     .json({
  //       code: 400,
  //       msg: "user id should be provided",
  //       data: "user field is required",
  //     });
  // }

  if (!body.fcm_token) {
    return res.status(400).json({
      code: 400,
      msg: "fcm_token should be provided",
      data: "fcm_token field is required",
    });
  }

  const message = {
    token: body.fcm_token,
    notification: body.notification,
    data: body.data,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Notificaiton sent successfully ", response);
      return res
        .status(201)
        .json({
          status: 201,
          msg: "Notification sent successfully",
          data: message,
        });
    })
    .catch((err) => {
      console.log(`error: ${err.message}`);
      return res.status(201).json({status: 400, msg: "Cannot send notification", data: err});
    });
});

server.listen(process.env.PORT, () => console.log("Server started at port 4000"));
