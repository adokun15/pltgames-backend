/*
This file called for every authorize request by the browser or discord bot;
*/ 


import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { GetSessionInDb } from "@/auth/repositories/sessions.repository";

export async function  AuthorizationClientRequest(req:Request, res: Response) {
  try {
    const authToken = req.cookies?.access_token;

    if (!authToken) return res.status(401).end();

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    
    ///req.userId = decoded;
  } catch(e) {
    const refresh_token = req.cookies?.refresh_token as string;
    const session = await GetSessionInDb( refresh_token );

    if (!session) throw new Error("Unauthorized Access. Login again!");

    //Check expires_at date;
      const now = new Date();

     if (new Date(session?.expires_at) > now) {
        throw new Error('Session has expired. Login again!')   
     }    

    // issue new access
    const newToken = jwt.sign(
      { user_id: session?.challonge_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", newToken, { httpOnly: true });

   // req.userId = session?.challonge_id;
  }
}

//Discord decoding request; Checking if it real
export const AuthorizationBotRequest = () => {}