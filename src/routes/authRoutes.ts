import { Router, Request, Response, NextFunction } from "express";
import AuthController from "../controllers/authController";
import checkUser from "../middleware/authMiddleware";
const router: Router = Router();

const authController : AuthController= new AuthController();
router.post("/signup", checkUser, authController.signUp);
router.post("/login", checkUser, authController.logIn);
router.get("/userProfile", checkUser, authController.getUserDetails);
router.patch("/updateUserProfile", checkUser, authController.updateUserDetails);
router.patch("/deleteUser", checkUser, authController.deleteUser);
router.patch("/reactiveUser", authController.reactiveUser);

export default router;