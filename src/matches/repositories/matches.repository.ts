//MATCHES 

//GET ALL MATCHES: based on tournament for now;
export function GetTournamentMatches(){
    const res = await pool.query(
      `
      INSERT INTO stores(merchant_id, category, name, slug)
      VALUES ($1, $2, $3, )
      RETURNING *;
       `,
      query,
    );
    return { store: res?.rows[0] };

}

//GET SINGLE MATCH;
export function GetSingleMatch(){}

//BULK UPDATE MATCHES;
export function BulkMatchUpdate(){
    
}

//Single Update MATCHES;
export function SingleMatchUpdate(){}