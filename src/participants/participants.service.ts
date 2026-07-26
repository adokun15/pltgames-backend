//

import { ParticipantType, FilterParticipantTypes } from "@/utils/challonge/challongeTypes";

/* Join: Add data to database first: user/player role*/
export async function CreateParticipantForTournamentService(participant: ParticipantType, tournament_id: string){}


/* Leave: remove data from database first: user/player role*/
export async function LeaveParticipantAsTournamentService(participant_id: string, tournament_id: string, username?: string){}

/*admin deletes single participant (super_admin): direct(challonge);*/

/**Clear all participants: at once (super_admin) */

/* Player: Update data limit(1) can only update once*/
export async function UpdateSingleParticipantForTournamentService(arg: {participant_id: string, data: {name: string}, tournament_id: string}){}


//Manual&Automatics batch update to challonge; 
/*alter column: synced: true | false or synced_at: last_synced */
export async function BulkUpdateParticipantsService(arg :{participant_ids: string[], tournament_id: string}){
    //Check for unsynced data;

    //ALL synced: return;

    //Else puch new update;
}

//Sync All From challonge to  
export async function AutoSyncFromChallongeParticipantsService(){
    //Check for unsynced data;

    //tournaments_id?: string[]
    //ALL synced: return;
}



//Get all participants of a tournament
export async function FetchAllTournamentParticipantsService(tournament_id: string, params?: FilterParticipantTypes){
    
}

//Get single participant of a tournament
export async function FetchSingleTournamentParticipantService(tournament_id: string, participant_id: string){}