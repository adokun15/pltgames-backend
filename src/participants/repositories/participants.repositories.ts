// Postgres Database
import pool from "@/utils/database";
import { DbUpdateHelper } from "@/utils/database/updateHelper";
import DatabaseError, { handlePgError } from "@/utils/exceptions/DbError";
import ValidationError from "@/utils/exceptions/ValidationError";

//Interface for the Filter
interface ParticipantsFilter {
  orderBy?: "updated_at" | "created_at" | "name";
  direction?: "ASC" | "DESC";
  offset?: number;
  limit?: number;
  status?: string;
}

interface ParticipantsResponse {
  id: string;
  challonge_participant_id: number;
  name: number;
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

//Not by tournaments filter
export async function GetAllBulkParticipants(filter?: ParticipantsFilter) {
  //Filter by date/time and status!
  const { orderBy = "updated_at", offset = 0, limit = 256 } = filter || {};

  const orderColumn = ORDER_BY_FIELDS[orderBy];
  /* Add 'status' column later to chack synced status! */
  try {
    const res = await pool.query(
      `
      SELECT *
      FROM participants
      WHERE status::text NOT ILIKE 'added'
      ORDER BY ${orderColumn} DESC
      OFFSET $1
      LIMIT $2
      `,
      [offset, limit],
    );

    if (res.rows.length === 0) {
      //lOG TO File! or
      throw new ValidationError({}, "No pending participants available!");
    }

    return (res.rows as ParticipantsResponse[]) || [];
  } catch (e: any) {
    console.log(e);
    if (e instanceof ValidationError) {
      throw e;
    }
    handlePgError(e);
  }
}

export async function UpdateBulkParticipants(participants: []) {
  /**Check out postgresql on how to perfoam bulk operation */
  try {
    const res = await pool.query(``, []);

    return (res.rows as { username: string }[]) || [];
  } catch (e: any) {
    console.error("GetBulkParticipants error:", e);
    throw new Error("Failed to fetch Participants");
  }
}

export async function GetAllParticipants(
  tournament_id: string,
  filter?: ParticipantsFilter,
) {
  //Set default query value if not provided by the client
  const {
    orderBy = "updated_at",
    direction = "DESC",
    offset = 0,
    limit = 64,
    status = "", //added, left, pending
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
      AND status::text ILIKE $4 || '%'
      ORDER BY ${orderColumn} ${direction}
      OFFSET $2
      LIMIT $3
      `,
      [tournament_id, offset, limit, status],
    );

    return res.rows;
  } catch (e: any) {
    handlePgError(e);
  }
}

export async function GetSingleParticipant(a: {
  tournamentId: number;
  p_username: string;
}) {
  try {
    const res = await pool.query(
      `
      SELECT p.*
      FROM participants p
      WHERE tournament_id = $1 AND username = $2 
      LIMIT 1
      `,
      [a.tournamentId, a.p_username],
    );

    if (res.rows.length === 0) return null;

    return res.rows[0] as {
      status: string;
    };
  } catch (e: any) {
    handlePgError(e);
  }
}

//Join Tournament; Authorized user's only;
/*
Only save data locally from authorized user from the client!!;
*/
export async function CreateParticipant(a: {
  tournamentId: string;
  p_name: string;
  p_username?: string;
  p_meta?: string;
}) {
  try {
    const res = await pool.query(
      `
      INSERT INTO participants (tournament_id, name, username, misc)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (tournament_id, username) DO UPDATE
      SET 
       status = COALESCE(EXCLUDED.status, 'pending'),
       name = EXCLUDED.name
      RETURNING username;
        `,
      [a.tournamentId, a.p_name, a.p_username, a.p_meta],
    );

    return (res.rows[0].username as { username: string }) || null;
  } catch (e: any) {
    console.log(e);
    if (e.code === "23505") {
      throw new DatabaseError("Participant already exist!");
    }

    if (e.code === "23503") {
      if (e.constraint === "participants_tournament_id_fkey")
        throw new DatabaseError("Tournament not found!");
      if (e.constraint === "participants_username_fkey")
        throw new DatabaseError("User not found!");
    }
    handlePgError(e);
  }
}

// Cleanup db ( 'leave' participant)
export async function CleanupParticipants() {
  //A week cleanup all participant data from the db
  //condition: older than a week and status is 'left'
  try {
    const res = await pool.query(
      `
      Delete FROM participants 
      where  updated_at > 1 week ago AND status_id = 'left' 
      RETURNING id, username, tournament_id;
      `,
    );

    return (
      (res.rows as {
        id: string;
        tournament_id: number;
        username: string;
      }[]) || null
    );
  } catch (e: any) {
    console.error("LeftParticipant error:", e);
    throw new Error("Failed to Leave participant");
  }
}

export async function LeaveParticipant(a: {
  tournamentId: string;
  p_username: string;
}) {
  try {
    let query_text = `
    UPDATE participants
    SET status = 'left'  
    where username = $1 AND 
        tournament_id = $2
        RETURNING username, challonge_participant_id;         
      `;

    const query = {
      text: query_text,
      values: [a.p_username, a.tournamentId],
    };
    const res = await pool.query(query);

    if (res.rows.length === 0) {
      throw new ValidationError(
        {},
        "Invalid reference. Could not find participant!",
      );
    }

    return res.rows[0] as {
      username: string;
      challonge_participant_id: number;
    };
  } catch (e) {
    console.log(e);
    if (e instanceof ValidationError) {
      throw e;
    }
    handlePgError(e);
  }
}

export async function SyncBulkParticipant(Participants: any[]) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const t of Participants) {
      console.log("t", t);
      const q = await client.query(
        `
        INSERT INTO Participants (
           
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
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
        ],
      );
    }

    await client.query("COMMIT");
    return "success";
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("SyncBulkTournament error:", e);
    throw new Error("Bulk sync failed");
  } finally {
    client.release();
  }
}
