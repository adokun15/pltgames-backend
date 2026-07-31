import pool from "@/utils/database";
export async function CreateSessionInDb(arg: { challonge_id: string, refresh_token: string, expires_at: Date }){
try{
    const query = {
  text: `
  INSERT INTO user_sessions
    (challonge_id, refresh_token, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (refresh_token) DO UPDATE   
    SET expires_at = EXCLUDED.expires_at
    RETURNING id;
    `,
  values: [
    arg.challonge_id, 
    arg.refresh_token, 
    arg.expires_at, 
],
} 
    const res = await pool.query(query);
         
    return { sessionId: res.rows[0]?.id} 
} catch (e) {
    console.log(e);
    throw new Error(e?.message);
}
}

export async function GetSessionInDb(identifier: string){
   try {
 
        const query = {
  text: `select * from user_sessions
         where refresh_token = $1 or session_id = $1;         
        `,
  values: [identifier],
}
 
        const res = await pool.query(query);
     
     if (!res.rows.length) {
         throw new Error("Session not Found")
    }
    
    
   return { session_id: res.rows[0]?.id, expires_at: res.rows[0]?.expires_at, challonge_id: res.rows[0]?.challonge_id, refresh_token: res.rows[0]?.refresh_token};
} catch (e) {
    console.log(e);
    //throw new CustomError(e?.message);
}
}

export async function DeleteSessionInDb(id: string, challonge_id: string){
     const pquery = await pool.connect();
    
    try {
    await pquery.query("BEGIN");
    
    const query_text = `DELETE FROM user_sessions WHERE challonge_id = $1 AND id = $2  RETURNING *;`;
    
    const deleted_info = await pool.query(query_text, [challonge_id, id]);
    
   await pquery.query("COMMIT");
   return { session_id: deleted_info.rows[0]?.id, expires_at: deleted_info.rows[0]?.expires_at,  challonge_id: deleted_info.rows[0]?.challonge_id, refresh_token: deleted_info.rows[0]?.refresh_token}
   
} catch (e) {
    console.log(e)
    //await pquery.query("ROLLBACK");
    throw Error(e);
}
}

