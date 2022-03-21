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
const bcrypt_1 = __importDefault(require("bcrypt"));
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
// userSchema.pre("save", async function(next){
//     // const saltRounds = await bcrypt.genSalt();
//     // this.password = await bcrypt.hash(this.password, saltRounds);
//     next();
// })
userSchema.path("password").validate((value) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = yield bcrypt_1.default.genSalt();
    value = yield bcrypt_1.default.hash(value, saltRounds);
}));
exports.userModel = (0, mongoose_1.model)('User', userSchema);
