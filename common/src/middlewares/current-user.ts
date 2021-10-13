import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserPayload {
    id:string;
    email:string;
}
// modifying existing definitions
declare global {
    namespace Express {
        interface Request {
            currentUser?:JwtPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    if (!req.session?.jwt){
        return next();
      }
      try {
      const payload = jwt.verify(req.session.jwt, process.env.jwt_key!) as UserPayload ;
        req.currentUser = payload;
      } catch (err) {
      
      }
      
      next();

  };
  