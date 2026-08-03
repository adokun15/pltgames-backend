import { NextFunction, Request, Response } from "express";
import { ManualSyncFromChallongeParticipantsService, BulkUpdateParticipantsService, CreateParticipantForTournamentService, FetchAllTournamentParticipantsService, FetchSingleTournamentParticipantService, LeaveParticipantAsTournamentService } from "./participants.service";

//Join Tournament controller: player
export const CreateParticipantController = async (req: Request, res: Response, next: NextFunction) => {
   //Econst { tournament_id }urnament Id;
   const { tournament_id } = req.query;
   const userId = req.userId;
   const { data } = req.body;
   
  try{
    const participant = await CreateParticipantForTournamentService(data, tournament_id as string, userId)
    res.status(201).json({
        status: true,
        data: { participant }
    }) 
}catch(e){
    next(e)
  }
} 

//LEAVE tOURNAMENT; player
export const LeaveTournamentAsParticipantController = async (req: Request, res: Response, next: NextFunction) => {
   //Extract tournament Id;
   const { tournament_id } = req.query;
   const { participant_id, username } = req.params;
   
  //Parse and check if parameters are valid;
  if(!tournament_id){};

  try{
    const info = await LeaveParticipantAsTournamentService( participant_id as string, tournament_id as string, username as string)
    res.status(201).json({
        status: true,
        data: { message: info }
    }) 
}catch(e){
    next(e)
  }
} 


export const AllParticipantsController = async (req: Request, res:Response, next: NextFunction) => {
   const { tournament_id } = req.query;
   const { page, per_page} = req.query;

   //Check if tournament_id query is a number!!

  //Check per_page and page limit;
  if(page && Number(page) < 1 && Number(page) > 100){
    //Error Exceeded 
  }
  
  if(Number(page) < 1 && Number(page) > 100){
    //Error Exceeded 
  }

  try{
    const participants = await FetchAllTournamentParticipantsService(tournament_id as string, { page: page as string, per_page: per_page as string})
    res.status(201).json({
        status: true,
        data: participants 
    }) 
}catch(e){
    next(e)
  }
} 

export const SingleParticipantController = async (req: Request, res: Response, next: NextFunction) => {
   //Extract tournament Id;
   const { tournament_id } = req.query;
   const { participant_id } = req.params;
   
   //Check if tournament_id and participant_id query is a number 

  try{
    const single_participant = await FetchSingleTournamentParticipantService(tournament_id as string, participant_id as string)
    res.status(201).json({
        status: true,
        data: single_participant 
    }) 
}catch(e){
    next(e)
  }
} 

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

/*CRON JOBS*/
export const BulkParticipantsUpdateController = async (req: Request, res:Response, next: NextFunction) => {
   //Extract params;
   const { participant_ids } = req.body;
   const { tournament_id } = req.query;
   
  //Parse and check if parameters are valid;
  if(!tournament_id ){
    //Throw error;
  }

  try{
    const participant = await BulkUpdateParticipantsService()
    res.status(201).json({
        status: true,
        data: { message: 'success' }
    }) 
}catch(e){
    next(e)
  }
} 


export const ManualSyncParticipantsController = async (req: Request, res:Response, next: NextFunction) => {
   //Use Special aut middleware for this
   
   //Use bot to manual sync this; application_tokeno' 
   try{
    const sync_participants = await ManualSyncFromChallongeParticipantsService()
    res.status(201).json({
        status: true,
        data: { sync_participants }
    }) 
}catch(e){
    next(e)
  }
} 