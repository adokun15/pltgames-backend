import pool from "@/utils/database";

//Interface for the Filter 
interface TournamentsFilter {
  orderBy?: "updated_at" | "created_at" | "name";
  direction?: "ASC" | "DESC";
  offset?:number;
  limit?: number;
}

// Pre
const ORDERABLE_FIELDS = {
  updated_at: "updated_at",
  created_at: "created_at",
  name: "name",
};

export async function GetAllTournaments(filter?: TournamentsFilter) {

  //Set default query value
  const {
    orderBy = "updated_at",
    direction = "DESC",
    offset = 0,
    limit = 10,
  } = filter || {};

  //Prevent random string from injecting SQL
  const orderColumn = ORDERABLE_FIELDS[orderBy];

  try {
    const res = await pool.query(
      `
      SELECT *
      FROM tournaments 
      ORDER BY ${orderColumn} ${direction}
      OFFSET $1
      LIMIT $2
      `,
      [offset, limit]
    );

    return res.rows;
  } catch (e: any) {
    console.error("GetAllTournaments error:", e);
    throw new Error("Failed to fetch tournaments");
  }
}

export async function GetSingleTournament(tournamentId: string) {
  try {
    const res = await pool.query(
      `
      SELECT t.*
      FROM tournaments t
      WHERE t.id = $1
      LIMIT 1
      `,
      [tournamentId]
    );

    return res.rows[0] || null;
  } catch (e: any) {

    console.error("GetSingleTournament error:", e);
    throw new Error("Failed to fetch tournament");
  }
}
export async function SyncBulkTournament(tournaments: any[]) {
  const client = await pool.connect();
  let query = []
  try {
    await client.query("BEGIN");

    for (const t of tournaments) {
      console.log('t', t)
      const q = await client.query(
        `
        INSERT INTO tournaments (
      tournament_name,
	  challonge_tournament_id,
    description,
    current_participants_count,
    slug,
    min_team_size,
    max_team_size,
    isPrivate,
    state,
    game_name,
    tournament_type,
    max_signup,
    progress,
    check_in_duration,
    includeteams,
    gameroom,
    poster_url,
    starts_at,
    started_at,
    completed_at,
    last_synced,
    updated_at,
	 created_at,
    organizer_id,
    group_stage_enabled, 
    group_stage_options, 
    double_elimination_options, 
    round_robin_options, 
    swiss_options, 
    free_for_all_options 
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