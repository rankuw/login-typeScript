import { Request, Response, NextFunction} from "express";
export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction){
    res.status = res.status ?? 400; 
    res.send(err.message);
    next();
}