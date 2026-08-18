import { NextFunction, Request, Response } from "express";
import {
  SyncTournamentsService,
  ViewAllTournamentsService,
  ViewSingleTournamentService,
} from "./tournaments.service";
import { asyncHandler } from "@/utils/middleware/error";

export const AllTournamentsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const tournaments = await ViewAllTournamentsService(filters);
    res.status(200).json({
      status: true,
      data: tournaments,
    });
  },
);

export const SingleTournamentController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournament_id } = req.params;

    const single_tournament = await ViewSingleTournamentService(
      tournament_id as string,
    );
    res.status(200).json({
      status: true,
      data: single_tournament,
    });
  },
);

/*CRON JOBS*/
//Use Special auth middleware for this
export const SyncTournamentsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Use challonge API_KEY to verify;
    //const key = req.headers["x-challonge-app-token"];
    //const ALLOWED_IPS = ["123.45.67.89"];

    //if (!key || key !== process.env.CHALLONGE_APPLICATION_TOKEN) {
    //  return res.status(401).json({ message: "Unauthorized access" });
    // }

    //Use ip address
    // if (!ALLOWED_IPS.includes(req.ip)) {
    //  return res.status(403).json({ message: "Forbidden" });
    //}
    const ts = await SyncTournamentsService();
    res.status(200).json({
      status: true,
      data: ts,
    });
  },
);

//Join Tournament controller: super_admin
/*export const CreateTournamentController = async (req: Request, res: Response, next: NextFunction) => {
       const { data } = req.body;
       
      try{
      const tournament = await CreateTournamentService()
       res.status(201).json({
            status: true,
            data: { tournament }
        }) 
    }catch(e){
        next(e)
      }
    } */
//By only admin / super_admin
/*export const DeactivateTournamentController = async (req: Request, res: Response, next: NextFunction) => {
           //Reason
            try{
          const tournament = await DeactivateTournamentService()
           res.status(201).json({
                status: true,
                data: { tournament }
            }) 
        }catch(e){
            next(e)
          }
        } 
        */

//Possible to update once by authorizes admin / super_admin;
/*export const UpdatetournamentController = asyncHander(async (req: Request, res:Response, next: NextFunction) => {
         //Extract params;
         const { data } = req.body;
         const { tournament_id } = req.params;
      
          const tournament = await UpdateTournamentService()
          res.status(201).json({
              status: true,
              data: { tournament }
          }) 
      ) 
      */
