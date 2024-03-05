"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// const express = require('express');

var configViewEngine = function configViewEngine(app) {
  app.use(_express["default"]["static"]("./src/public"));
  app.set("view engine", "ejs"); //ejs: thư viện đã được install
  app.set("views", "./src/views"); //khai báo chính xác thư mục chứa file ejs
};
module.exports = configViewEngine;