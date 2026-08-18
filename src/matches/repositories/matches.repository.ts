import { matchResType } from "@/utils/challonge/challongeTypes";
import pool from "@/utils/database";
//MATCHES 
type MatchFromChallonge = {
        challonge_match_id: string,
        tournament_id: number,
        round: number,
        player1_id?:string,
        player2_id?:string,
        winner_id?: number,
        is_bye?: boolean,
        state: string,
        scores?: string,
        points_by_participant?:  {
                        participant_id: number,
                        scores: number[]
                    }[],
            }


//GET ALL MATCHES: based on tournament for now;
export async function GetAllMatches(id: string, filter?: string){
  try{
      const res = await pool.query(
        `
        SELECT *
        FROM matches
        where tournament_id = $1
        `,
        [id]
      );
  
      return res.rows;
  }catch(e){
      console.log(e)  
  }
}

//GET SINGLE MATCH;
export async function GetSingleMatch(tournamentId: string, matchId: string){
   try{
      const res = await pool.query(
        `
        SELECT *
        FROM matches
        where tournament_id = $1 AND challonge_match_id = $2
        `,
        [tournamentId, matchId]
      );
  
      return res.rows[0] || null;
  }catch(e){
      console.log(e)  
  }
}

//BULK SYNC MATCHES;
export async function BulkMatchSync(matches: MatchFromChallonge[]){
  const challonge_match_id = matches.map(m => m.challonge_match_id)
  const tournament_id = matches.map(m => m.tournament_id)
  const round= matches.map(m => m.round) 
  const player1_id= matches.map(m => +m?.player1_id || null) 
  const player2_id= matches.map(m => +m?.player2_id || null) 
  const winner_id= matches.map(m => +m?.winner_id || null) 
  const is_bye= matches.map(m => m?.is_bye) 
  const state= matches.map(m => m.state) 
  const scores= matches.map(m => m?.scores || null) 
  const points_by_participant= matches.map(m => m?.points_by_participant || null) 
           
  //Run bulk update
  try{
  await pool.query(`
    INSERT INTO matches (
      challonge_match_id, 
      state, 
      scores,  
      winner_id,
      tournament_id,
      round, 
      player1_id, 
      player2_id, 
      is_bye, 
      scores, 
      points_by_participant,       
  )
  
  SELECT * FROM UNNEST(
  $1::varchar(20)[], 
  $2::boolean[], 
  $3::string[],
  $4::int[],
  $5::int[],
  $6::int[],
  $7::int[],
  $8::int[],
  $9::boolean[],
  $10::scores[],
  $11::jsonb[]
  )
  ON CONFLICT (challonge_match_id)
  DO UPDATE SET
    state = EXCLUDED.state,
    winner_id = EXCLUDED.winner_id,
    scores = EXCLUDED.scores,  
    round = EXCLUDED.round, 
    player1_id = EXCLUDED.player1_id, 
    player2_id = EXCLUDED.player2_id, 
    is_bye = EXCLUDED.is_bye, 
    scores=EXCLUDED.scores, 
    points_by_participant=EXCLUDED.points_by_participant,       
  
    `, [
      challonge_match_id, 
      state, 
      scores,
      winner_id,
      tournament_id,
      round, 
      player1_id, 
      player2_id, 
      is_bye, 
      scores, 
      points_by_participant,       
]);
  return { data: "success"}
   
}catch(e){
  console.log(e)
}
}
// match -- [{},{},{}]
/* t - {
   property_name1: [],
    
}*/
//convert the array to object of array value

//Single Update MATCHES;
//export function SingleMatchUpdate(){}