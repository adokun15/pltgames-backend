//Matches database: Update Matches & fetch match detail
import { FilterTournamentsTypes } from "@/utils/challonge/challongeTypes";

//Update FROM 'CHALLONGE' and SYNC LOCAL DATABASE DATA;
export async function BulkMatchUpdateService(arg: { match_ids: string[], tournament_id: number, round?: number | null}){
  //By admin; 
  //1. Fetch all match from challonge api
  
  //2. check sync time
  
  //3. Iterate and update all data at once; 
  // -- Advice: update matches per rounds if provided 
}

//Manage local database data: simulate real-time feel; 
export async function SingleMatchUpdateService(arg: { match_id: string, tournament_id: string }){
  //By organizer; 
}

//Get matches based on a tournament; Application-level
export async function FetchSingleTournamentMatchService(tournament_id: string){}

//Application-level
export async function FetchAllTournamentMatchesService(tournament_id: string,  params?: FilterTournamentsTypes){}