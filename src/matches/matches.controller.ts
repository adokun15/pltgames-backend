import { NextFunction, Request, Response } from "express";
import {
  BulkUpdateAllMatchesService,
  FetchAllTournamentMatchesService,
  FetchSingleTournamentMatchService,
  //  SingleMatchUpdateService
} from "./matches.service";
import { asyncHandler } from "@/utils/middleware/error";

//Control top route layer: Prevent abuse (ratelimit) and Unauthorized access;
export const AllMatchesController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Extract params;
    const { tournament_id, page, limit, state = "pending" } = req.query;

    //Parse and check if parameters are valid;
    //Check per_page and page limit;
    //Checks for Starte: Open / Pending
    //Checks for Participants_id

    const matches = await FetchAllTournamentMatchesService(
      tournament_id as string,
    );

    res.status(200).json({
      status: true,
      data: matches,
    });
  },
);

//Control top route layer: Prevent abuse (ratelimit);
export const SingleMatchController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Extract params;
    const { tournament_id } = req.query;
    const { match_id } = req.params;
    if (typeof match_id === "string" && typeof tournament_id === "string") {
      const match = await FetchSingleTournamentMatchService(
        tournament_id,
        match_id,
      );
      res.status(200).json({
        status: true,
        data: match,
      });
    }
  },
);

export const BulkMatchUpdateController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Extract params;
    const { tournament_id } = req.body;
    const userId = req.userId;

    //const { round } = req.query;

    const match = await BulkUpdateAllMatchesService({
      userId,
      tournamentId: tournament_id,
      //rounds: +round,
    });
    res.status(201).json({
      status: true,
      data: match,
    });
  },
);

/*
  export const UpdateMatchController = async (req: Request, res:Response, next: NextFunction) => {
     //Extract params;
     const { tournament_id } = req.body;
     const { match_id } = req.params;
     
    //Parse and check if parameters are valid;
    if(!tournament_id ){
      //Throw error;
    }
  
    try{
      const match = await SingleMatchUpdateService({ tournament_id, match_id : match_id as string })
      res.status(201).json({
          status: true,
          data: { match }
      }) 
  }catch(e){
      next(e)
    }
  } 
  */
