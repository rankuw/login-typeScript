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
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const md5_1 = __importDefault(require("md5"));
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: [true, "UserName is required..."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required..."]
    },
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    age: {
        type: Number
    }
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            // const saltRounds = await bcrypt.genSalt();
            // this.password = await bcrypt.hash(this.password, saltRounds);
            console.log(this.password);
            this.password = (0, md5_1.default)(this.password);
            console.log(this.password);
        }
        next();
    });
});
// userSchema.path("password").validate(async function(this: userInterface) {
//     const saltRounds = await bcrypt.genSalt();
//     console.log("Validating password");
//     this.password = await <Promise<String>>bcrypt.hash(this.password as string, saltRounds);
// })
exports.userModel = (0, mongoose_1.model)('User', userSchema);
