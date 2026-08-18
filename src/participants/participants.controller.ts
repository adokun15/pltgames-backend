import { NextFunction, Request, Response } from "express";
import {
  ManualSyncFromChallongeParticipantsService,
  BulkUpdateParticipantsService,
  CreateParticipantForTournamentService,
  FetchAllTournamentParticipantsService,
  FetchSingleTournamentParticipantService,
  LeaveParticipantAsTournamentService,
} from "./participants.service";
import { asyncHandler } from "@/utils/middleware/error";

//Join Tournament controller player
export const CreateParticipantController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { data, tournament_id } = req.body;

    //Validate Inputs;
    const participant = await CreateParticipantForTournamentService(
      data,
      tournament_id as string,
      userId,
    );

    console.log(participant);
    res.status(201).json({
      status: true,
      data: participant,
    });
  },
);

//LEAVE tOURNAMENT; player
export const LeaveTournamentAsParticipantController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { tournament_id } = req.body;
    const { username } = req.params;

    //validate input;

    const info = await LeaveParticipantAsTournamentService(
      tournament_id as string,
      username as string,
      userId,
    );
    res.status(201).json({
      status: true,
      data: info,
    });
  },
);

export const AllParticipantsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tournament_id, page, per_page } = req.query;

    //validate query's and tournament id

    const participants = await FetchAllTournamentParticipantsService(
      tournament_id as string,
      { page: page as string, per_page: per_page as string },
    );

    res.status(200).json({
      status: true,
      data: participants,
    });
  },
);

export const SingleParticipantController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Extract tournament Id;
    const { tournament_id } = req.query;
    const { username } = req.params;

    //Check if tournament_id and participant_id query is a number

    const single_participant = await FetchSingleTournamentParticipantService(
      tournament_id as string,
      username as string,
    );

    res.status(200).json({
      status: true,
      data: single_participant,
    });
  },
);

/*
//Possible to update once by authorizes user;
export const UpdateParticipantController = async (req: Request, res:Response, next: NextFunction) => {
   //Extract params;
   const { tournament_id } = req.query;
   const { data } = req.body;
   const { participant_id } = req.params;

  try{
    const participant = await UpdateSingleParticipantForTournamentService({participant_id: participant_id as string, data, tournament_id: tournament_id as string})
    res.status(201).json({
        status: true,
        data: { participant }
    }) 
}catch(e){
    next(e)
  }
} 
*/

/*CRON JOBS/admin*/
export const BulkParticipantsUpdateController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Authorize: Check

    //Check user roles
    const participants = await BulkUpdateParticipantsService();
    res.status(200).json({
      status: true,
      data: participants,
    });
  },
);

export const ManualSyncParticipantsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const synced_participants =
      await ManualSyncFromChallongeParticipantsService();
    res.status(200).json({
      status: true,
      data: synced_participants,
    });
  },
);
