"use strict";

var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _viewEngine = _interopRequireDefault(require("./config/viewEngine"));
var _web = _interopRequireDefault(require("./route/web"));
var _index = _interopRequireDefault(require("./models/index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//file chạy server

//import connectDB from "./config/connectDB";
require('dotenv').config(); //khai báo thư viện dotenv

var app = (0, _express["default"])();

//strict - origin - when - cross - origin
// Add headers before the routes are defined 
app.use(function (req, res, next) {
  //this is midleware

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//config app before use route

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

//limit: '50mb': allow upload large file/image
app.use(_bodyParser["default"].json({
  limit: '50mb'
}));
app.use(_bodyParser["default"].urlencoded({
  limit: '50mb',
  extended: true
}));

//khai báo view 
(0, _viewEngine["default"])(app);
//khai báo route 
(0, _web["default"])(app);

//connect DB before listen
//connectDB();
_index["default"].connectDB;

//GET PORT đã khai bao tại file .env
var port = process.env.PORT || 6969; //If PORT === undefined => port = 6969

app.listen(port, function () {
  console.log("Backend Nodejs is running on the port: ", port);
});