//Matches database: Update Matches & fetch match detail
import { FilterTournamentsTypes } from "@/utils/challonge/challongeTypes";
import { BulkMatchSync, GetAllMatches, GetSingleMatch } from "./repositories/matches.repository";
import { GetAllTournaments } from "@/tournaments/repositories/tournament.repositories";
import { ChallongeMatchesHelper } from "@/utils/challonge/challongeRequestHelper";

type idRound = {
  id: number,
  rounds?: number
}
//Update FROM 'CHALLONGE' and SYNC LOCAL DATABASE DATA;
export async function BulkUpdateAllMatchesService(tournamentId?: number | null, rounds?: number | null){
  //By admin role; 
  let idsWithRound: idRound[] = []  
  //let idsWithRoundWithRoundLeft: number[] = []  

  if(tournamentId && rounds) {
    //Update only this data
    idsWithRound.push({ id:tournamentId, rounds: rounds }); 
  }else{
    //Check if any ongoing tournament in the local db
    const tournament = await GetAllTournaments({ state: "open" })
    
    //Fetch all tournaments id
    tournament.forEach(t => idsWithRound.push({ id: +t.challonge_tournament_id, rounds }));
  }

  if(idsWithRound.length === 0) {
    //Throw no active tournament!
  };
  
  //Expensive `iterative query`; Iterate and update all data at once; 
  // -- Advice: update matches per rounds only if provided      
 for (const { id, rounds } of idsWithRound) {

  /*
    Pull only matches that are completed;
    Make use of page and perpage effective to know which 
    value you want to precisely pull;

    e.g page = 2, perpage = 20, state= complete pull the first complete matches;
    e.g page = { a round }, perpage = { number_of_match_in_that_round }, state=complete pull the second complete matches;
    */

    const req = {
     method: "POST",
        path: `/tournaments/${id}/matches.json`,
        authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
        authorization_version: "v1"
      }
      
      //---Fetch all ongoing tournament-matches from challonge api
    const matchesFromChallonge = await ChallongeMatchesHelper(req, id) 
    
    if (!("data" in matchesFromChallonge)) {
      throw new Error(matchesFromChallonge.error_description || "Failed to fetch matches");
    }

      //2. create or upsert previous matchId for a tournament
      return await BulkMatchSync(matchesFromChallonge.data)
 }
}


//Manage local database data: simulate real-time feel; 
//export async function SingleMatchUpdateService(arg: { match_id: string, tournament_id: string }){
  //By organizer; Upload score only by organizer; 
//}

//Get matches based on a tournament; Application-level
export async function FetchSingleTournamentMatchService(tournament_id: string, match_id: string){
  try{
    const match = await GetSingleMatch(tournament_id, match_id);
    return { match }
  }catch(e){
    console.log(e)
  }
}

//Application-level
export async function FetchAllTournamentMatchesService(tournament_id: string,  params?: string){
try{
  const matches = await GetAllMatches(tournament_id, params)
  return { matches }
}catch(e){
  console.log(e)
}
}