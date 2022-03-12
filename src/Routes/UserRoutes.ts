import { Router } from "express"
import UserController from "../Controllers/UserController"
import { AuthController } from "../Controllers/AuthController"

var authController = new AuthController();

const UserRouter: Router = Router()
const userController = new UserController()
UserRouter.get("/get-all-users",authController.authorizeAdminJWT, userController.GetAllUsers)
UserRouter.get("/get-user", userController.GetUser)

UserRouter.post("/add-user", userController.RegisterUser)
UserRouter.post("/signin", userController.AuthenticateUser);
UserRouter.get("/sign-out",userController.SignOutUser);
UserRouter.put("/edit-user", userController.updateUser)

UserRouter.delete("/delete-user/:id",authController.authenticateJWT, userController.deleteUser)

export default UserRouter