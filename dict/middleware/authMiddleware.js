"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function checkUser(req, res, next) {
    // const token: (string|undefined) = req.headers.authorization; 
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.cookie("jwt", "", { maxAge: 1 });
                res.status(400).send("Invalid token login again");
            }
            else if (req.method === "POST") {
                res.status(400).send("User already logged in...");
            }
            else {
                req.body.idFromAuth = decodedToken;
                next();
            }
        });
    }
    else {
        if (req.method === "POST") {
            next();
        }
        else {
            res.status(400).send(`Login before you use ${req.url.slice(1)}`);
        }
    }
}
exports.default = checkUser;
