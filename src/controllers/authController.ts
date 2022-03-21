import { NextFunction, Request, Response } from "express";
import {Types} from "mongoose"
import { userModel, userInterface } from "../models/user";
import jwt from "jsonwebtoken"
import md5 from "md5";

function getToken(id: Types.ObjectId): String{
    return jwt.sign({id}, process.env.JWT_SECRET as string, {
        expiresIn: 60 * 60
    })
}
export default class AuthController{

    // @desc POST user
    // @route POST /api/signup
    // @access Public
    async signUp(req: Request, res: Response, next: NextFunction){
        const {userName, password, name, age} = req.body;
        try{
            if(!userName || !password) {
                throw new Error("Username and password required");
            }
            else{
                const user = await userModel.create({userName, password, name, age});
                const token: String = getToken(user._id);
                res.cookie("jwt", token, {
                    maxAge: 60 * 60 * 1000
                })
                res.status(201).json({userName: user.userName});
            }
        }catch(err){
            next(err);
        }
    }

    // @desc POST user
    // @route POST /api/login
    // @access Public
    async logIn(req: Request, res: Response, next: NextFunction){
        const {userName, password} = req.body;
        try{
            if(!userName || !password){
                throw new Error("Username and password required");
            }
            else{
                const user = await userModel.findOne({userName});
                
                if(user){
                    if(user.isActive === false){
                        throw new Error(`No user with userName ${user.userName} found`);
                    }
                    const result = (user.password === md5(password));
                    if(result){
                        const token : String = getToken(user._id);
                        res.cookie("jwt", token, {
                            maxAge: 60 * 60 * 1000
                        })
                        res.status(200).send(`Logged in as ${userName}`);
                    }
                    else{
                        throw new Error("Incorrect password");
                    }
                }else{
                    throw new Error("Incorrect User Name");
                }
            }
        }catch(err: any){
            next(err)
        }
    }

    // @desc GET user
    // @route GET /api/userProfile
    // @access Private
    async getUserDetails(req: Request, res: Response, next: NextFunction){
        let id: String = req.body.idFromAuth;
        try{
            if(id){
                const user: (userInterface|null) = await userModel.findOne(id);
                res.status(200).json({userName: user?.userName, name: user?.name, age: user?.age})
            }
            else{
                throw new Error("Could not fetch user try again later");
            }
        }catch(err: any){
            res.status(500);
            next(err);
        }
    }

    // @desc PATCH user
    // @route PATCH /api/updateUserProfile
    // @access Private
    async updateUserDetails(req: Request, res: Response, next: NextFunction){
    
        let id: String = req.body.idFromAuth.id;
        try{
            if(id){
                let userName = req.body.userName;
                delete req.body.userName;
                const user = await <any>userModel.findOne({_id: id});
                const arr: string[] = Object.keys(req.body);
                for(const val of arr){
                    user[val] = req.body[val];
                }
                const result = await user.save();
                // const result = await userModel.findOne({_id: id}, req.body);
                
                res.status(201).send(`${result.userName} updated`);
            
            }else{
                throw new Error("Could not update user try again...");
            }
        }catch(err: any){
            console.log(err);
            next(err);
        }
    }

    // @desc PATCH user
    // @route PATCH /api/deleteUser
    // @access Private
    async deleteUser(req: Request, res: Response, next: NextFunction){
        let id = req.body.idFromAuth.id;
        try{
            if(id){
                const user = await userModel.findOne({_id: id});
                if(user?.isActive){
                    user.isActive = false;
                    await user.save();

                    res.cookie("jwt", "", {maxAge: 1});
                    res.status(201).send(`${user.userName} deactivated`);
                }else{
                    throw new Error(`${user?.userName} if already deactivated`);
                }
            }else{
                res.status(500)
                throw new Error("Could not deactivate try again later");
            }
        }catch(err: any){
            console.log(err);
            next(err);
        }
    }

    // @desc PATCH user
    // @route PATCH /api/reactiveUser
    // @access Private
    async reactiveUser(req: Request, res: Response, next: NextFunction){
        const {userName, password} = req.body;
        try{
            if(!userName && !password){
                throw new Error("Username and password required");
            }
            else{
                const user = await userModel.findOne({userName, password});
                if(user){
                    user.isActive = true;
                    await user.save();
                    const token: String = getToken(user._id);
                    res.cookie('jwt', token, {maxAge: 60*60*1000});
                    res.send(`${userName} reactivated`);
                }else{
                    res.status(500);
                    throw new Error("No user found");
                }
            }
        }catch(err){
            next(err);
        }
    }
}

