import pool from "@/utils/database";
import DatabaseError, { handlePgError } from "@/utils/exceptions/DbError";
import ValidationError from "@/utils/exceptions/ValidationError";
import { error } from "node:console";

//Interface for the Filter
interface TournamentsFilter {
  orderBy?: "updated_at" | "created_at" | "name";
  sort?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  state?: string;
  type?: string;
}

const ORDERABLE_FIELDS = {
  updated_at: "updated_at",
  created_at: "created_at",
  name: "name",
};

export async function GetAllBulkActiveTournaments() {
  try {
    const res = await pool.query(`
      SELECT *
      FROM tournaments 
      ORDER BY update_at desc
      OFFSET 0
      LIMIT 10
      `);
    return res.rows;
  } catch (e) {
    handlePgError(e);
  }
}

export async function GetAllTournaments(filter?: TournamentsFilter) {
  //Set default query value
  const {
    orderBy = "updated_at",
    sort = "DESC",
    offset = 0,
    limit = 10,
  } = filter || {};

  //Prevent random string from injecting SQL
  const orderColumn = ORDERABLE_FIELDS[orderBy];

  //TODO: select only few columns not all
  try {
    const res = await pool.query(
      `
      SELECT *
      FROM tournaments 
      ORDER BY ${orderColumn} ${sort}
      OFFSET $1
      LIMIT $2
      `,
      [offset, limit],
    );

    return res.rows;
  } catch (e) {
    handlePgError(e);
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
      [tournamentId],
    );

    if (res.rows.length === 0) {
      throw new ValidationError(
        { tournament_id: "Invalid tournament Id" },
        "Tournament not found!",
      );
    }
    return res.rows[0];
  } catch (e: any) {
    if (e instanceof DatabaseError) {
      handlePgError(e);
    }

    throw e;
  }
}

//Sync pending
export async function SyncBulkTournament(tournaments: any[]) {
  const client = await pool.connect();

  const t = groupByKeys(tournaments);

  try {
    await client.query("BEGIN");
    const d = await client.query(
      `
    INSERT INTO tournaments (
    tournament_name,
	  challonge_tournament_id,
    description,
    current_participants_count,
    slug,
    tournament_type,
    min_team_size,
    max_team_size,
    isPrivate,
    state,
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
    free_for_all_options, 
    game_name
  )   
          
  SELECT * FROM UNNEST(
  $1::text[], 
  $2::integer[],
  $3::text[],
	$4::integer[],
  $5::text[], --slug-- 
  $6::tournament_play_type[], 
  $7::integer[],
  $8::integer[],
  $9::boolean[],
  $10::tournament_state_type[], --state--
  $11::integer[],
  $12::integer[],
  $13::integer[],
  $14::boolean[], --- includeteams ---
  $15::text[],
  $16::text[],
  $17::timestamp[],
  $18::timestamp[],
  $19::timestamp[],
  $20::timestamp[],
  $21::timestamp[],
  $22::timestamp[],
  $23::text[],
  $24::boolean[], -- group stage enableld--
  $25::jsonb[],
  $26::jsonb[],
  $27::jsonb[],
  $28::jsonb[],
  $29::jsonb[],
  $30::text[] --gamename--
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
        returning challonge_tournament_id, slug, state, tournament_name, id, last_synced;
          `,
      [
        t.tournament_name,
        t.challonge_tournament_id,
        t.description,
        t.current_participants_count,
        t.slug,
        t.tournament_type,
        t.min_team_size,
        t.max_team_size,
        t.isPrivate,
        t.state,
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
        t.game_name,
      ],
    );

    await client.query("COMMIT");
    if (d.rows.length === 0) {
      return { message: "Tournament data is up to date", tournaments: [] };
    }

    return { message: "Synced tournament data", tournaments: d.rows };
  } catch (e: any) {
    await client.query("ROLLBACK");
    handlePgError(e);
  } finally {
    client.release();
  }
}

//Convert array to objeck
function groupByKeys<T extends Record<string, any>>(
  arr: T[],
): {
  [K in keyof T]: T[K][];
} {
  const result = {} as { [K in keyof T]: T[K][] };
  for (let i = 0; i < arr.length; i++) {
    const currentObject = arr[i];

    //Loop through each key in the object
    for (let key in currentObject) {
      const value = currentObject[key];
      // Get the value of that key

      //Check if this key already exists in result
      if (!result[key]) {
        // If not, create an empty array for that key
        result[key] = [];
      }

      // Step 5: Push the value into the array
      result[key].push(value);
    }
  }

  return result;
}
