import { Response, Request} from "express";
import { ExchangeCodeForToken } from "./auth.service";

export const AuthCodeController = async(req: Request, res: Response) => {
 const  code  = req.params?.code;  
 try{
 const token = await ExchangeCodeForToken(code as string)
 res.cookie('access_token', token.accessToken, { httpOnly: process.env.NODE_ENV === "production"})
 res.json(token)
}catch(e){
  throw new Error(e);
}
}
