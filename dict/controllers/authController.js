"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const md5_1 = __importDefault(require("md5"));
function getToken(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60
    });
}
class AuthController {
    // @desc POST user
    // @route POST /api/signup
    // @access Public
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, password, name, age } = req.body;
            try {
                if (!userName || !password) {
                    throw new Error("Username and password required");
                }
                else {
                    const user = yield user_1.userModel.create({ userName, password, name, age });
                    const token = getToken(user._id);
                    res.cookie("jwt", token, {
                        maxAge: 60 * 60 * 1000
                    });
                    res.status(201).json({ userName: user.userName });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    // @desc POST user
    // @route POST /api/login
    // @access Public
    logIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, password } = req.body;
            try {
                if (!userName || !password) {
                    throw new Error("Username and password required");
                }
                else {
                    const user = yield user_1.userModel.findOne({ userName });
                    if (user) {
                        if (user.isActive === false) {
                            throw new Error(`No user with userName ${user.userName} found`);
                        }
                        const result = (user.password === (0, md5_1.default)(password.toString()));
                        if (result) {
                            const token = getToken(user._id);
                            res.cookie("jwt", token, {
                                maxAge: 60 * 60 * 1000
                            });
                            res.status(200).send(`Logged in as ${userName}`);
                        }
                        else {
                            throw new Error("Incorrect password");
                        }
                    }
                    else {
                        throw new Error("Incorrect User Name");
                    }
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    // @desc GET user
    // @route GET /api/userProfile
    // @access Private
    getUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.body.idFromAuth;
            try {
                if (id) {
                    const user = yield user_1.userModel.findOne(id);
                    res.status(200).json({ userName: user === null || user === void 0 ? void 0 : user.userName, name: user === null || user === void 0 ? void 0 : user.name, age: user === null || user === void 0 ? void 0 : user.age });
                }
                else {
                    throw new Error("Could not fetch user try again later");
                }
            }
            catch (err) {
                res.status(500);
                next(err);
            }
        });
    }
    // @desc PATCH user
    // @route PATCH /api/updateUserProfile
    // @access Private
    updateUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.body.idFromAuth.id;
            try {
                if (id) {
                    let userName = req.body.userName;
                    delete req.body.userName;
                    const user = yield user_1.userModel.findOne({ _id: id });
                    const arr = Object.keys(req.body);
                    for (const val of arr) {
                        user[val] = req.body[val];
                    }
                    const result = yield user.save();
                    // const result = await userModel.findOne({_id: id}, req.body);
                    res.status(201).send(`${result.userName} updated`);
                }
                else {
                    throw new Error("Could not update user try again...");
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    // @desc PATCH user
    // @route PATCH /api/deleteUser
    // @access Private
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.body.idFromAuth.id;
            try {
                if (id) {
                    const user = yield user_1.userModel.findOne({ _id: id });
                    if (user === null || user === void 0 ? void 0 : user.isActive) {
                        user.isActive = false;
                        yield user.save();
                        res.cookie("jwt", "", { maxAge: 1 });
                        res.status(201).send(`${user.userName} deactivated`);
                    }
                    else {
                        throw new Error(`${user === null || user === void 0 ? void 0 : user.userName} if already deactivated`);
                    }
                }
                else {
                    res.status(500);
                    throw new Error("Could not deactivate try again later");
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    // @desc PATCH user
    // @route PATCH /api/reactiveUser
    // @access Private
    reactiveUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, password } = req.body;
            try {
                if (!userName && !password) {
                    throw new Error("Username and password required");
                }
                else {
                    const user = yield user_1.userModel.findOne({ userName, password });
                    if (user) {
                        user.isActive = true;
                        yield user.save();
                        const token = getToken(user._id);
                        res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });
                        res.send(`${userName} reactivated`);
                    }
                    else {
                        res.status(500);
                        throw new Error("No user found");
                    }
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = AuthController;
