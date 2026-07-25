//Matches database: Batch Update Matches & fetch match detail
interface MatchType{
    match_id: number;
    score: string;
}

export function BulkMatchUpdateRepository(match_ids: string[]): MatchType[]{
  try{

  }catch(e){
    throw new Error('Somethhing went wrong!')
  }
}

export function FetchSingleTournamentMatchRepository(match_id: string[]): MatchType[]{
  try{
    const res = await pool.query(
      `
      INSERT INTO stores(merchant_id, category, name, slug)
      VALUES ($1, $2, $3, )
      RETURNING *;
       `,
      query,
    );

    return { store: res?.rows[0] };

  }catch(e){
    throw new Error('Somethhing went wrong!')
  }
}

export function FetchTournamentMatchesRepository(tournament_ids: string[]): MatchType[]{
  try{

  }catch(e){
    throw new Error('Somethhing went wrong!')
  }
}