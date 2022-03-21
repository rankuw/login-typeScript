"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
const authController = new authController_1.default();
router.post("/signup", authMiddleware_1.default, authController.signUp);
router.post("/login", authMiddleware_1.default, authController.logIn);
router.get("/userProfile", authMiddleware_1.default, authController.getUserDetails);
router.patch("/updateUserProfile", authMiddleware_1.default, authController.updateUserDetails);
router.patch("/deleteUser", authMiddleware_1.default, authController.deleteUser);
router.patch("/reactiveUser", authController.reactiveUser);
exports.default = router;
