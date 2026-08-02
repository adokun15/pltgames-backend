//import { CreateTournamentType } from "@/utils/challonge/challongeTypes";

import { ChallongeTournamentRequestHelper } from "@/utils/challonge/challongeRequestHelper";
import { GetAllTournaments, GetSingleTournament, SyncBulkTournament } from "./repositories/tournament.repositories"

interface TournamentsFilter {
  //search?: string,//Added Later
  OrderBy?: string, //p.price
  direction?: string | 'DESC',
  offset?: number | 0,
  limit?: number | 10
}


//Views: Public; 
export async function ViewAllTournamentsService(filter?:TournamentsFilter ){
   try{
    const tournaments = await GetAllTournaments();
    return { tournaments }
   } catch (e){
     console.log(e)
     throw new Error(e)
   }
}

//View Single Tournament
export async function ViewSingleTournamentService(
    tournamentId: string
){
    try{
    const tournament = await GetSingleTournament(tournamentId);
    return  tournament 
    } catch (e){
     console.log(e)
     throw new Error(e)
    }
}

//CronJob (2twice, daily); 
// / Manually (by super_admin);
export async function SyncTournamentsService(){    
    //Perform an transaction: get and update;
    

    /*
     per_page: 20
     page: 1
     created_before: ""
     created_after: ""
     state: "in_progess", "ended", "pending"
    
    */
    //From challonge pull 'active' tournament
    const ts = await ChallongeTournamentRequestHelper({
    path: `/tournaments.json`,
    authorization: process.env.CHALLONGE_APPLICATION_TOKEN,
    authorization_version: "v1"
    })
    
    if(!Array.isArray(ts)){
        throw new Error(ts.error)
    }
    
    //To Local db;
    await SyncBulkTournament(ts)
}

//Views: private; / 
//export async function ViewAllUserTournamentsService(){}
//export async function ViewUserTournamentService(){}

//Action:  skipping
//export async function CreateTournamentService(arg: CreateTournamentType){
    //Talk to Challonge directly
 
    /* 
    This will be done manually on the Challonge App: 
    Organizer may submit their request to the challonge bot 
    which will be sent to another 'channel' gor me to approve;
    
    By approving, i will sync the the game from 'challonge' to our local
    db for display;
    */
 
    /*{
         keywords: data?.name?.split(" "),
         reports: [],
         tournamentId: data?.tournamentId,
         game: {
           name: game_info?.data()?.game_name,
           format: data?.format, //solo, 1v1, Duo
           type: data?.type, //round-round, single elimination, br
           style: game_info?.data()?.game_type, //shooting or Soccer
         },
         owner_id: data?.owner_id,
         tournamentTitle: data?.name,
         startDate: data?.startDate,
         access: data?.access, //member / public
         entryType: data?.entryType, //free, paid
         max_slot: data?.max_slot,
         group: data?.group,
         prize_pool: data?.prize_pool, // { cuts }
         fee: data?.fee, // entry fee
         createdAt: data?.createdAt,
         updatedAt: data?.createdAt,
         owner_id: data?.owner_id,
         hub_id: data?.hub_id,
         //mode: "",//Team DeathMatch, Br, Clach Squad
         //teams: [],
         //participants: [],//
         total_amount: 0, //Wiil Be gotten from Escrow Id(later)
         status: "draft", //draft, upcoming, ongoing, ended/cancelled
         escrowId: "", //Wallet Payment Goes To
         poster: "", //Tournament Banner
         prizes: [], //[0.5, 0.3, 0.2],
         rules: [], // List of rule
         gameroom: "",
         venue: "", //Location Of Communication
         endDate: "", //When WILL tournament End
         registrationDeadline: "", // When WILL REGISTRATION cLOSE
         slot: 0,
         description: "",
         forcefully_cancelled: false,
       };
   }
 */
//};

/* This will be created later, as we just trying to  */
//export async function UpdateTournamentService(){};
//export async function DeactivateTournamentService(){};
