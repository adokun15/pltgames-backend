import { NextFunction, Request, Response } from "express";
import { AutoSyncFromChallongeParticipantsService, BulkUpdateParticipantsService, CreateParticipantForTournamentService, FetchAllTournamentParticipantsService, FetchSingleTournamentParticipantService, LeaveParticipantAsTournamentService, UpdateSingleParticipantForTournamentService } from "./participants.service";

//Join Tournament controller: player
export const CreateParticipantController = async (req: Request, res: Response, next: NextFunction) => {
   //Extract tournament Id;
   const { tournament_id } = req.query;
   const { data } = req.body;
   
  //Parse and check if parameters are valid;
  if(!tournament_id){}

  try{
    const participant = await CreateParticipantForTournamentService(data, tournament_id as string,)
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
        data: { participants }
    }) 
}catch(e){
    next(e)
  }
} 

export const SingleParticipantController = async (req: Request, res: Response, next: NextFunction) => {
   //Extract tournament Id;
   const { tournament_id } = req.query;
   const { participant_id } = req.params;
   
  //Parse and check if parameters are valid;
  if(!tournament_id){
    //Throw error;
  }

  try{
    const single_participant = await FetchSingleTournamentParticipantService(tournament_id as string, participant_id as string)
    res.status(201).json({
        status: true,
        data: { single_participant }
    }) 
}catch(e){
    next(e)
  }
} 

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
    const participant = await BulkUpdateParticipantsService({ tournament_id: tournament_id as string , participant_ids: participant_ids as string[]})
    res.status(201).json({
        status: true,
        data: { message: 'success' }
    }) 
}catch(e){
    next(e)
  }
} 


export const SyncParticipantsController = async (req: Request, res:Response, next: NextFunction) => {
   //Use Special auth middleware for this

    //Fetch from Database (Challonge);
   
  //Then

  //Update Local Db
  try{
    const sync_participants = await AutoSyncFromChallongeParticipantsService()
    res.status(201).json({
        status: true,
        data: { sync_participants }
    }) 
}catch(e){
    next(e)
  }
} 