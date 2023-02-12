var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
require("dotenv").config();

var indexRouter = require("./src/routes/index");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routeHandlers
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // return the error
  res.status(err.status || 500);
  res.json("Page not found");
});

module.exports = app;
