import { NextFunction, Request, Response } from "express";
import { CreateTournamentService, DeactivateTournamentService, SyncTournamentsService, UpdateTournamentService, ViewAllTournamentsService, ViewSingleTournamentService } from "./tournaments.service";

//Join Tournament controller: super_admin
export const CreateTournamentController = async (req: Request, res: Response, next: NextFunction) => {
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
} 

//By only admin / super_admin
export const DeactivateTournamentController = async (req: Request, res: Response, next: NextFunction) => {
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

export const AllTournamentsController = async (req: Request, res:Response, next: NextFunction) => {
   const { page, per_page, state} = req.query;

  //Check per_page and page limit;
  if(page && Number(page) < 1 && Number(page) > 100){
    //Error Exceeded 
  }
  
  if(Number(page) < 1 && Number(page) > 100){
    //Error Exceeded 
  }

  try{
    const tournaments = await ViewAllTournamentsService()
    res.status(201).json({
        status: true,
        data: { tournaments }
    }) 
}catch(e){
    next(e)
  }
} 

export const SingleTournamentController = async (req: Request, res: Response, next: NextFunction) => {
   //Extract tournament Id;
   const { tournament_id } = req.params;
   
  try{
    const single_tournament = await ViewSingleTournamentService();
    res.status(200).json({
        status: true,
        data: { single_tournament }
    }) 
}catch(e){
    next(e)
  }
} 

//Possible to update once by authorizes admin / super_admin;
export const UpdatetournamentController = async (req: Request, res:Response, next: NextFunction) => {
   //Extract params;
   const { data } = req.body;
   const { tournament_id } = req.params;

  try{
    const tournament = await UpdateTournamentService()
    res.status(201).json({
        status: true,
        data: { tournament }
    }) 
}catch(e){
    next(e)
  }
} 


/*CRON JOBS*/
export const SyncTournamentsController = async (req: Request, res:Response, next: NextFunction) => {
   //Use Special auth middleware for this
   //Fetch from Database (Challonge);
   //Then
   //Update Local Db 
  try{
    const tournament = await SyncTournamentsService()
    res.status(201).json({
        status: true,
        data: { message: 'success' }
    }) 
}catch(e){
    next(e)
  }
} 