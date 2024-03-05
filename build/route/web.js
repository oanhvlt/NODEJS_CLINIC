"use strict";

var _express = _interopRequireDefault(require("express"));
var _homeController = _interopRequireDefault(require("../controllers/homeController"));
var _userController = _interopRequireDefault(require("../controllers/userController"));
var _doctorController = _interopRequireDefault(require("../controllers/doctorController"));
var _patientController = _interopRequireDefault(require("../controllers/patientController"));
var _specialtyController = _interopRequireDefault(require("../controllers/specialtyController"));
var _clinicController = _interopRequireDefault(require("../controllers/clinicController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//mỗi khi truy cập vào 1 đường link sẽ chạy vào đây

var router = _express["default"].Router();
var initWebRoutes = function initWebRoutes(app) {
  router.get("/", _homeController["default"].getHomePage);
  router.get("/about", _homeController["default"].getAboutPage);
  router.get("/crud", _homeController["default"].getCRUD);
  router.post("/post-crud", _homeController["default"].postCRUD);
  router.get("/get-crud", _homeController["default"].displayGetCRUD);
  router.get("/edit-crud", _homeController["default"].getEditCRUD);
  router.post("/put-crud", _homeController["default"].putCRUD);
  router.get("/delete-crud", _homeController["default"].deleteCRUD);

  //Manage users
  router.post("/api/login", _userController["default"].handleLoginApi);
  router.get("/api/get-all-users", _userController["default"].handleGetAllUsers);
  //router.get("/api/get-users", userControlller.handleGetUsers);
  router.post("/api/create-new-user", _userController["default"].handleCreateNewUser);
  router.put("/api/edit-summary-user", _userController["default"].handleEditSummaryUser);
  router.put("/api/edit-user", _userController["default"].handleEditUser);
  router["delete"]("/api/delete-user", _userController["default"].handleDeleteUser);
  router.get('/api/allcode', _userController["default"].getAllCode);

  //manage doctors
  router.get("/api/top-doctors-home", _doctorController["default"].handleGetTopDoctors);
  router.get("/api/get-all-doctors", _doctorController["default"].handleGetAllDoctors);
  router.post("/api/save-doctor-details", _doctorController["default"].handleSaveDoctorDetails);
  router.get("/api/get-doctor-details-by-id", _doctorController["default"].handleGetDoctorDetailsById);
  router.post("/api/bulk-create-schedule", _doctorController["default"].handleBulkCreateSchedule);
  router.get("/api/get-schedule-by-date", _doctorController["default"].handleGetScheduleByDate);
  router.get("/api/get-extra-info-doctor-by-id", _doctorController["default"].handleGetExtraInfoDoctorById);
  router.get("/api/get-profile-doctor-by-id", _doctorController["default"].handleGetProfileDoctorById);
  router.get("/api/get-list-patient-for-doctor", _doctorController["default"].handleGetListPatientForDoctor);
  router.post("/api/send-remedy", _doctorController["default"].handleSendRemedy);

  //patient (client UI)
  router.post("/api/patient-book-appointment", _patientController["default"].handleBookAppointment);
  router.post("/api/verify-book-appointment", _patientController["default"].handleVerifyBookAppointment);
  //specialty
  router.post("/api/save-specialty", _specialtyController["default"].handleSaveSpecialty);
  router.get("/api/get-all-specialties", _specialtyController["default"].handleGetAllSpecialties);
  router.get("/api/get-specialty-doctor-by-id", _specialtyController["default"].handleGetSpecialtyDoctorById);
  //clinic
  router.post("/api/save-clinic", _clinicController["default"].handleSaveClinic);
  router.get("/api/get-all-clinics", _clinicController["default"].handleGetAllClinics);
  router.get("/api/get-clinic-doctor-by-id", _clinicController["default"].handleGetClinicDoctorById);
  return app.use("/", router);
};
module.exports = initWebRoutes;