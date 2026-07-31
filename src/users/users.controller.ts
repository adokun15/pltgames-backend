import { Response, Request, NextFunction} from "express";
import { GetSingleUserByUserIdService, GetSingleUserByUserNameService,  } from "./users.service";

//Public and Private; can only get certain data based on authenticated or not;
export const GetUserController = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const user = await GetSingleUserByUserIdService(req.userId as string)
    res.status(200).json( {
      status: true,
      data : user,
  }) 
  } catch(e){
    next(e)
  }
}

export const GetSingleUserInfoController = async(req: Request, res: Response, next: NextFunction) => {
  const {username} = req.params;

  if(!username) return 

  try{
    const user = await GetSingleUserByUserNameService(username as string)
    res.status(200).json( {
      status: true,
    data : user,
  }) 
  } catch(e){
    next(e)
  }
}

