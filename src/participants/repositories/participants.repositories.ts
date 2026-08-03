// Postgres Database
import pool from "@/utils/database";

//Interface for the Filter 
interface ParticipantsFilter {
  orderBy?: "updated_at" | "created_at" | "name";
  direction?: "ASC" | "DESC";
  offset?:number;
  limit?: number;
  status?: string;
}

interface ParticipantsResponse {
  id: string;
  challonge_participant_id: number;
  name:number;
  tournament_id: number;
  username: string;
  isactive: boolean;
  updated_at: string;
  created_at: string;
  seed?: number;
  misc?: string;
  final_rank?: number;
  group_id?: number;
}

const ORDER_BY_FIELDS = {
  updated_at: "updated_at",
  created_at: "created_at",
  name: "name",
};

export async function GetAllBulkParticipants(filter?: ParticipantsFilter) {
  //Filter by date/time and status!
  const {
    orderBy = "updated_at",
    direction = "DESC",
    offset = 0,
    limit = 100,
    status = "all"
  } = filter || {};

  //Prevent random string from injecting SQL
  const orderColumn = ORDER_BY_FIELDS[orderBy];


  /* Add 'status' column later to chack synced status! */
  try {
    const res = await pool.query(
      `
      SELECT *
      FROM participants
      ORDER BY ${orderColumn} ${direction}
      OFFSET $2
      LIMIT $3
      `,
      [offset, limit]
    );

    return res.rows as ParticipantsResponse[]  || [];
  } catch (e: any) {
    console.error("GetBulkParticipants error:", e);
    throw new Error("Failed to fetch Participants");
  }
}

export async function UpdateBulkParticipants(participants: []) {
  /**Check out postgresql on how to perfoam bulk operation */
  try {
    const res = await pool.query(
      ``,
      []
    );


    return res.rows as { username: string }[]  || [];
  } catch (e: any) {
    console.error("GetBulkParticipants error:", e);
    throw new Error("Failed to fetch Participants");
  }
}


export async function GetAllParticipants(tournament_id:string, filter?: ParticipantsFilter) {
  //Set default query value if not provided by the client
  const {
    orderBy = "updated_at",
    direction = "DESC",
    offset = 0,
    limit = 64,
  } = filter || {};

  //Prevent random string from injecting SQL
  const orderColumn = ORDER_BY_FIELDS[orderBy];

  //use challonge_id instead;
  try {
    const res = await pool.query(
      `
      SELECT *
      FROM participants
      where tournament_id = $1
      ORDER BY ${orderColumn} ${direction}
      OFFSET $2
      LIMIT $3

      `,
      [tournament_id, offset, limit]
    );

    return res.rows;
  } catch (e: any) {
    console.error("GetAllParticipants error:", e);
    throw new Error("Failed to fetch Participants");
  }
}

export async function GetSingleParticipant(a: { tournamentId: number, p_id: number }) {
  try {
    const res = await pool.query(
      `
      SELECT p.*
      FROM participants p
      WHERE tournament_id = $1 AND challonge_participant_id = $2 
      LIMIT 1
      `,
      [a.tournamentId, a.p_id]
    );

    return res.rows[0] || null;
  } catch (e: any) {
    console.error("GetSingleParticipant error:", e);
    throw new Error("Failed to fetch participant");
  }
}

//Join Tournament; Authorized user's only;
/*
 Only save data locally from authorized user from the client!!;
*/

export async function CreateParticipant(a: { 
    tournamentId: string, 
    p_name: string,
    p_username?: string, 
    p_meta?: string 
}) {
  try {

    //Add new column; 'status' with default as 'pending'
    const res = await pool.query(
      `
      INSERT INTO participants (tournamentId, name, username, misc)
      VALUES ( $1, $2, $3, $4)
      //on conflict change status to 'pending'
      RETURNING id;
        `,
      [a.tournamentId, a.p_name, a.p_username, a.p_meta]
    );

    return res.rows[0]?.id as { id: string } || null;
  } catch (e: any) {
    console.error("CreateParticipant error:", e);
    throw new Error("Failed to create participant");
  }
}

// Cleanup db ( 'leave' participant)
export async function CleanupParticipants(){
  //A week cleanup all participant data from the db
  //condition: older than a week and status is 'left'
try {
    /*update status to 'leave' instead*/
    const res = await pool.query(
      `
      Delete FROM participants 
      where  updated_at > 1 week AND tournament_id = 'left' 
      RETURNING id, username, tournament_id;
        `,
    );

    return res.rows[0] as { id: string, tournament_id: number, username: string } || null;
  } catch (e: any) {
    console.error("LeftParticipant error:", e);
    throw new Error("Failed to Leave participant");
  }

} 

/* 
Authorized participant can only leave before 'check_in' 
*/
export async function LeaveParticipant(a: { 
    tournamentId: string,
    p_id?: string,
    p_username?: string
}) {
  try {
    /*update status to 'leave' instead*/
    const res = await pool.query(
      `
      Delete FROM participants where (id = $1 OR username = $2) AND tournament_id = $3 
      RETURNING id;
        `,
      [a.p_id, a.p_username, a.tournamentId]
    );

    return res.rows[0]?.id as { id: string } || null;
  } catch (e: any) {
    console.error("LeftParticipant error:", e);
    throw new Error("Failed to Leave participant");
  }
}


export async function SyncBulkParticipant(Participants: any[]) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const t of Participants) {
      console.log('t', t)
      const q = await client.query(
        `
        INSERT INTO Participants (
           
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,$26,$27,$28,$29,$30
        )
        ON CONFLICT (challonge_tournament_id)
        DO UPDATE SET
          tournament_name = EXCLUDED.tournament_name,
          description = EXCLUDED.description,
          current_participants_count = EXCLUDED.current_participants_count,
          slug = EXCLUDED.slug,
          tournament_type = EXCLUDED.tournament_type,
          min_team_size = EXCLUDED.min_team_size,
          max_team_size = EXCLUDED.max_team_size,
          isPrivate = EXCLUDED.isPrivate,
          state = EXCLUDED.state,
          game_name = EXCLUDED.game_name,
          max_signup = EXCLUDED.max_signup,
          progress = EXCLUDED.progress,
          check_in_duration = EXCLUDED.check_in_duration,
          includeteams = EXCLUDED.includeteams,
          gameroom = EXCLUDED.gameroom,
          poster_url = EXCLUDED.poster_url,
          starts_at = EXCLUDED.starts_at,
          started_at = EXCLUDED.started_at,
          completed_at = EXCLUDED.completed_at,
          last_synced = EXCLUDED.last_synced,
          updated_at = EXCLUDED.updated_at,
          organizer_id = EXCLUDED.organizer_id,
          group_stage_enabled = EXCLUDED.group_stage_enabled,
          group_stage_options = EXCLUDED.group_stage_options,
          double_elimination_options = EXCLUDED.double_elimination_options,
          round_robin_options = EXCLUDED.round_robin_options,
          swiss_options = EXCLUDED.swiss_options,
          free_for_all_options = EXCLUDED.free_for_all_options
        `,
        [
    t.tournament_name,
      t.challonge_tournament_id,
    t.description,
    t.current_participants_count,
    t.slug,
    t.min_team_size,
    t.max_team_size,
    t.isPrivate,
    t.state,
    t.game_name,
    t.tournament_type,
    t.max_signup,
    t.progress,
    t.check_in_duration,
    t.includeteams,
    t.gameroom,
    t.poster_url,
    t.starts_at,
    t.started_at,
    t.completed_at,
    t.last_synced,
    t.updated_at,
     t.created_at,
    t.organizer_id,
    t.group_stage_enabled, 
    t.group_stage_options, 
    t.double_elimination_options, 
   t.round_robin_options, 
    t.swiss_options, 
    t.free_for_all_options, 
    
        ]
      );

    }

    
    await client.query("COMMIT");
    return 'success'
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("SyncBulkTournament error:", e);
    throw new Error("Bulk sync failed");
  } finally {
    client.release();
  }
}