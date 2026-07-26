import { NextFunction, Request, Response } from "express";
import { BulkMatchUpdateService, FetchAllTournamentMatchesService, FetchSingleTournamentMatchService, SingleMatchUpdateService } from "./matches.service";

//Control top route layer: Prevent abuse (ratelimit) and Unauthorized access;
export const AllMatchesController = async (req: Request, res:Response, next: NextFunction) => {
   //Extract params;
   const { tournament_id } = req.query;
   const { page, per_page, state = "pending", participant_id} = req.query;

  //Parse and check if parameters are valid;
  if(!tournament_id){
    //Throw error;
  }

  //Check per_page and page limit;
  if(page && Number(page) < 1 && Number(page) > 100){
    //Error Exceeded 
  }
  
  if(Number(page) < 1 && Number(page) > 100){
    //Error Exceeded 
  }

  //Checks for Participants_id 
  
  //Checks for Starte: Open / Pending 

  try{
    const matches = await FetchAllTournamentMatchesService(tournament_id as string)
    res.status(201).json({
        status: true,
        data: { matches }
    }) 
}catch(e){
    next(e)
  }
} 

//Control top route layer: Prevent abuse (ratelimit);
export const SingleMatchController = async (req: Request, res:Response, next: NextFunction) => {
   //Extract params;
   const { tournament_id } = req.params;
   
  //Parse and check if parameters are valid;
  if(!tournament_id){
    //Throw error;
  }

  try{
    const match = await FetchSingleTournamentMatchService(tournament_id as string)
    res.status(201).json({
        status: true,
        data: { match }
    }) 
}catch(e){
    next(e)
  }
} 

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

export const BulkMatchUpdateController = async (req: Request, res:Response, next: NextFunction) => {
   //Extract params;
   const { tournament_id, match_ids } = req.body;
   const { round } = req.query;
   
  //Parse and check if parameters are valid;
  if(!tournament_id ){
    //Throw error;
  }

  try{
    const match = await BulkMatchUpdateService({ tournament_id, match_ids: match_ids as string[], round: Number(round)})
    res.status(201).json({
        status: true,
        data: { message: 'success' }
    }) 
}catch(e){
    next(e)
  }
} 