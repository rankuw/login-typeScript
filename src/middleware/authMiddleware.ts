import {Request, Response,  NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../models/user";
import {Types} from "mongoose";


export default function checkUser(req: Request, res: Response, next: NextFunction): void{
    // const token: (string|undefined) = req.headers.authorization; 
    const token: (string|undefined) = req.cookies.jwt;
    console.log(token);
    if(token){
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decodedToken) => {
            if(err){
                res.cookie("jwt", "", {maxAge: 1});
                res.status(400).send("Invalid token login again");
            }
            
            else if(req.method === "POST"){
                res.status(400).send("User already logged in...");
            }
            else{
                req.body.idFromAuth = decodedToken;
                next();
            }
            
        })
    }else{
        if(req.method === "POST"){
            next();
        }
        else{
            res.status(400).send(`Login before you use ${req.url.slice(1)}`);
        }
    }
}