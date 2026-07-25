import { Response, Request} from "express";
import { ExchangeCodeForToken } from "./auth.service";

export const AuthCodeController = async(req: Request, res: Response) => {
 let { code } = req.params ;  
 try{
 //const token = await ExchangeCodeForToken(code)
 //return token
}catch(e){
  throw new Error();
}
}

export const RefreshAccessTokenController = (req: Request, res: Response) => {
  /*   
  try {
    const result = await ApplicationService(req.body);
    if(result.success){
      res.status(200).json(result)
    } else{
      res.status(400).json(result)
    }
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
    
  }

  */
}
