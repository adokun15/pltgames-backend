//

import { ChallongeParticipantRequestHelper } from "@/utils/challonge/challongeRequestHelper";
import {
  ParticipantType,
  FilterParticipantTypes,
} from "@/utils/challonge/challongeTypes";
import {
  CleanupParticipants,
  CreateParticipant,
  GetAllBulkParticipants,
  GetAllParticipants,
  GetSingleParticipant,
  LeaveParticipant,
  SyncBulkParticipant,
} from "./repositories/participants.repositories";
import {
  GetAllTournaments,
  GetSingleTournament,
} from "@/tournaments/repositories/tournament.repositories";
import { GetUserFromDb } from "@/users/repositories/users.repository";
import ChallongeAPIError from "@/utils/exceptions/ChallongeError";
import NotFoundError from "@/utils/exceptions/NotFound";
import ValidationError from "@/utils/exceptions/ValidationError";
import BaseError from "@/utils/exceptions/baseError";

/* Join: Add data to database first: user/player role*/
export async function CreateParticipantForTournamentService(
  participant: ParticipantType,
  tournament_id: string,
  userId: string,
) {
  //Get the user
  const user = await GetUserFromDb(userId);

  //Get username from register users
  const { username } = user;

  const { name } = participant;

  //Check if user exist and is 'added'
  const existing_participant = await GetSingleParticipant({
    tournamentId: +tournament_id,
    p_username: username,
  });

  if (existing_participant && existing_participant.status === "added") {
    throw new ValidationError({}, "This participants has already been added!");
  }

  //Add to local db first: status: 'pending'
  const p = await CreateParticipant({
    tournamentId: tournament_id,
    p_name: name,
    p_meta: participant?.misc || null,
    p_username: username,
  });

  return p;
}

/* Leave: remove data from database first: user/player role*/
export async function LeaveParticipantAsTournamentService(
  tournament_id: string,
  username?: string,
  userId?: string,
) {
  const existing_participant = await GetSingleParticipant({
    tournamentId: +tournament_id,
    p_username: username,
  });
  console.log(existing_participant);

  if (existing_participant && existing_participant.status === "added") {
    //Check tournament state
    const t = await GetSingleTournament(tournament_id);

    //400 - Bad request
    if (t && (t.state !== "pending" || t.state !== "checking_in")) {
      throw new ValidationError({}, "User is already in the tournament!");
    }
  }

  //Get the user
  const user = await GetUserFromDb(userId);

  //404 - not found
  if (!user) {
    throw new NotFoundError("Account not found!");
  }

  //Get username from register users
  const { username: user_name_from_db } = user;

  //verify it matches
  if (user_name_from_db !== username) {
    throw new BaseError("AUTH_ERROR", 401, false, "Unauthorized access!");
  }

  //then decide what happens
  const p = await LeaveParticipant({
    tournamentId: tournament_id,
    p_username: username,
  });

  return p;
}

/*admin deletes single participant (super_admin): direct(challonge);*/
/**Clear all participants: at once (super_admin) */
/* Player: Update data limit(1) can only update once*/
//export async function UpdateSingleParticipantForTournamentService(arg: {participant_id: string, data: {name: string}, tournament_id: string}){}

//Automatically clean up db - batch update to challonge; every sunday;
export async function BulkCleanUpParticipantsService() {
  //participants who 'left' over 'a week ago';
  const users = await CleanupParticipants();

  if (!users) {
    // NO participants left for that week. Log to discord!
  }

  //log id, username, tournament to discord log
}

export async function BulkUpdateParticipantsService() {
  //Check user Role!

  //Check for atleast 256 via 'pending' status with latest 'update';
  const participants = await GetAllBulkParticipants();
  /*
    [{t_id: 1, t_name: tourney 1}, {t_id: 2, t_name: tourney 2}]
    { 1:{ t_name: tourney 1}, 2: { t_name: tourney 2} }
    */
  if (!participants) return [];

  //participants array
  const tp = participants.reduce((acc, participant) => {
    const { tournament_id, name, username, misc } = participant;

    if (!acc[tournament_id]) {
      acc[tournament_id] = [];
    }

    acc[tournament_id].push({ name, username, misc });

    return acc;
  }, {});

  let participant_log = [];

  //Update batches by tournament id
  for (const [tournament, participants] of Object.entries(tp)) {
    const pl = await ChallongeParticipantRequestHelper({
      method: "POST",
      path: `/tournaments/${tournament}/participants/bulk_add.json?community_id=${process.env.CHALLONGE_CLIENT_COMMUNITY_ID}`,
      authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
      authorization_version: "v1",
      body_content: {
        data: {
          type: "Participants",
          attributes: { participants },
        },
      },
    });

    if (+pl?.status === 404) {
      throw new NotFoundError(pl?.detail);
    }
    
    participant_log.push(pl)// 2d Array;
  }

  //Transform, 2d array to 1d
  const flattenedArray = participant_log.flat();

  //Update new local database;
  const synced = await SyncBulkParticipant(flattenedArray);
  return synced;
}

//Sync All From challonge to local database; per tournament update
export async function ManualSyncFromChallongeParticipantsService() {
  
  //UPCOMING TOURNAMENT!
  const tournaments = await GetAllTournaments({
    state: "pending", 
    limit: 25,
    orderBy: 'updated_at'
  });
  
  //Call per
  for (const t of tournaments) {
    //Fetch all participants from each tournament
    const pl = await ChallongeParticipantRequestHelper({
      path: `/tournaments/${t.challonge_tournament_id}/participants.json?community_id=${process.env.CHALLONGE_CLIENT_COMMUNITY_ID}&per_page=${t.max_signup}&page=0`,
      authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
      authorization_version: "v1",
    });
    
     if (+pl?.status === 404) {
        throw new NotFoundError(pl?.detail);
      }
    
    //Upload Challonge data is fresh
    await SyncBulkParticipant(pl);
  }
}

//Get all participants of a tournament
export async function FetchAllTournamentParticipantsService(
  tournament_id: string,
  params?: FilterParticipantTypes,
) {
  try {
    const ps = await GetAllParticipants(tournament_id);
    return ps;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
}

//Get single participant of a tournament
export async function FetchSingleTournamentParticipantService(
  tournament_id: string,
  participant: string,
) {
  const p = await GetSingleParticipant({
    tournamentId: +tournament_id,
    p_username: participant,
  });
  return p;
}
