import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import {Password} from "../services/password"
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', 
[ 
  body("email").isEmail().withMessage("Email must be valid1"),
  body("password").trim().notEmpty().withMessage("You must supply a password")
],
validateRequest,
async (req: Request, res: Response) => {
  const {email, password} = req.body;
  const existingUser = await User.findOne({email});
  if (!existingUser){
    throw new BadRequestError('Invalid signin');
  }

  const passmatch = await Password.compare(existingUser.password, password);
  if (!passmatch) throw new BadRequestError('Invalid signin');

   // JWT

   const userJwt=jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.jwt_key! )

  // store in session
  req.session = {
    jwt: userJwt
  };


  res.status(200).send(existingUser);

});

export { router as signinRouter };
