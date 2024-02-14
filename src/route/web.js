//mỗi khi truy cập vào 1 đường link sẽ chạy vào đây
import express from 'express';
import homeController from "../controllers/homeController";
import userControlller from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);

    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    router.post("/api/login", userControlller.handleLoginApi);

    router.get("/api/get-all-users", userControlller.handleGetAllUsers);
    //router.get("/api/get-users", userControlller.handleGetUsers);
    router.post("/api/create-new-user", userControlller.handleCreateNewUser);
    router.put("/api/edit-user", userControlller.handleEditUser);
    router.delete("/api/delete-user", userControlller.handleDeleteUser);

    //
    router.get('/api/allcode', userControlller.getAllCode)

    //
    return app.use("/", router);
}

module.exports = initWebRoutes;