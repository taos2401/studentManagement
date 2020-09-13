const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");

const app = express();

//require router
var authRouter = require("./router/auth.router");
var userRouter = require("./router/user.router");
var classRouter = require("./router/class.router");
var apiRouter = require("./api/router/index");

//require middleware
var checkToken = require("./middleware/checkToken.middleware");

//use middleware
app.set("views", "./views");
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//use Router
app.use("/", authRouter);
app.use("/", checkToken, userRouter);
app.use("/class", checkToken, classRouter);
app.use("/api", checkToken, apiRouter);

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
