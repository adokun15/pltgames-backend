//

import { ChallongeParticipantRequestHelper } from "@/utils/challonge/challongeRequestHelper";
import { ParticipantType, FilterParticipantTypes } from "@/utils/challonge/challongeTypes";
import { CleanupParticipants, CreateParticipant, GetAllBulkParticipants, GetAllParticipants, GetSingleParticipant, LeaveParticipant } from "./repositories/participants.repositories";
import { GetAllTournaments } from "@/tournaments/repositories/tournament.repositories";

/* Join: Add data to database first: user/player role*/
export async function CreateParticipantForTournamentService(participant: ParticipantType, tournament_id: string, user_id: string){
    //Add to local db first
    try{
      const { name, username, misc} = participant;
       const p = await CreateParticipant({
        tournamentId: tournament_id,
        p_name: name,
        p_meta: misc,
        p_username: username
       })

       return p;
    }catch(e){
        console.log(e)
    }
    
}


/* Leave: remove data from database first: user/player role*/
export async function LeaveParticipantAsTournamentService(participant_id: string, tournament_id: string, username?: string){
    try{
      //check tournament state first;
 
      //then decide what happens
       const p = await LeaveParticipant({
        tournamentId: tournament_id,
        p_id: participant_id,
        p_username: username
       })

       return p;
    }catch(e){
        console.log(e)
    }
  
}

/*admin deletes single participant (super_admin): direct(challonge);*/
/**Clear all participants: at once (super_admin) */
/* Player: Update data limit(1) can only update once*/
//export async function UpdateSingleParticipantForTournamentService(arg: {participant_id: string, data: {name: string}, tournament_id: string}){}

//Automatically clean up db- batch update to challonge; 
export async function BulkCleanUpParticipantsService(){
    //Check for unsynced data via status = 'pending' from local db;
   try{
     const users = await CleanupParticipants();
     //log id, username to discord log
     console.log(users);
  }
    catch(e){
      console.log(e)
    }
}

export async function BulkUpdateParticipantsService(){
    //Check for unsynced data via status = 'pending' from local db;
   try{
    const participants = await GetAllBulkParticipants({ status: 'pending'});
    
    if(participants.length === 0) {
      //lOG TO dISCORD!
      return {
        message: 'All data are synced and update to date!'
      }
    }

    //Group participants list by 'tournament_id'
    let obj = {} as {
      tournament_id : {
          name: string,
          seed: number,
          misc: string,
          email:string,
          username: string,
       }, 
    };

    participants.forEach(element => {
      const { tournament_id, ...others }= element;
      obj[tournament_id] = others; 
    });

    if(!obj) return;

    const data_log = [];

    //Update batches by tournament id
    Object.entries(obj).forEach(async([tournament, p]) => {
      await ChallongeParticipantRequestHelper({
        method: "POST",
        path: `/tournaments/${tournament}/participants.json`,
        authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
        authorization_version: "v1",
        body_content:{
           data: {
            type: "Participants",
            attributes: {
              participants: {
                name: p?.name,
                seed: p?.seed,
                misc: p?.misc,
                email: p?.email,
                username: p?.username
                }
            }
          }}
      })

    })
    
    //Logged Data to a Discord server 
    console.log(data_log)
  }
    catch(e){
      console.log(e)
    }
}

//Sync All From challonge to local database; per tournament update  
export async function ManualSyncFromChallongeParticipantsService(){
  //Get "active" tournament from db;
  /* Default date is 1 week back */
  /* per_page */
  const tournaments =  await GetAllTournaments({state: "active",  created_after: new Date()})

  if(tournaments.length === 0) return;
   
  tournaments.forEach(async (t) => {
    //if(t.current_participants_count >= t.max_signup) return;

    //Fetch all participants from the tournaments list
    const p = await ChallongeParticipantRequestHelper({
      path: `/tournaments/${t.challonge_tournament_id}/participants.json?per_page=${t.max_signup}&page=0`,
      authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
      authorization_version: "v1"
    }) 
    
    //filter and check challonge_updated_date is newer the db, update data;
    
    //Insert and update tournament participants
    //await UpdateBulkParticipants(p)   
    
  })
} 


//Get all participants of a tournament
export async function FetchAllTournamentParticipantsService(tournament_id: string, params?: FilterParticipantTypes){
    try{
        const ps = await GetAllParticipants(tournament_id)
        return ps 
       } catch (e){
         console.log(e)
         throw new Error(e)
       }
}

//Get single participant of a tournament
export async function FetchSingleTournamentParticipantService(tournament_id: string, participant_id: string){
 try{
        const p = await GetSingleParticipant({tournamentId: +tournament_id, p_id: +participant_id})
        return p; 
       } catch (e){
         console.log(e)
         throw new Error(e)
       }   
}