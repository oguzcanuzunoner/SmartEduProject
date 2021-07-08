const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const pageRoute = require("./routers/pageRoute");
const courseRoute = require("./routers/courseRoute");
const categoryRoute = require("./routers/categoryRoute");
const userRoute = require("./routers/userRoute");
const app = express();

//Connect DB
mongoose
  .connect("mongodb://localhost/smartedu-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected Successfuly");
  });

//Template Engine
app.set("view engine", "ejs");

//Global Variable

global.userIN = null;

//Middlewares
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/smartedu-db" }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

//Routers
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/users", userRoute);
app.use("/categories", categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
