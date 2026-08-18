import { Response, Request, NextFunction } from "express";
import {
  GetSingleUserByUserIdService,
  GetSingleUserByUserNameService,
} from "./users.service";
import { asyncHandler } from "@/utils/middleware/error";

//Public and Private; can only get certain data based on authenticated or not;
export const GetUserController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await GetSingleUserByUserIdService(req.userId as string);
    res.status(200).json({
      status: true,
      data: user,
    });
  },
);

export const GetSingleUserInfoController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    //if(!username) return

    const user = await GetSingleUserByUserNameService(username as string);
    res.status(200).json({
      status: true,
      data: user,
    });
  },
);
