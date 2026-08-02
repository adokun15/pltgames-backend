
//Types 
export type FilterTournamentsTypes = {
    communityId?: string,
    page?: string,
    per_page?: string,
    state?: string,
    type?: string,
    created_after?: string,
    created_before?: string,
} 

export type FilterTournamentMatchesTypes = {
   communityId?: string,
    page?: string,
    per_page?: string,
    state?: string,//
    participant_id?: string,
} 

export type FilterParticipantTypes = {
   communityId?: string,
    page?: string,
    per_page?: string,
} 

export type ParticipantType = {
    name: string,
    username?: string,
    seed?: number,
    misc?: string,
    email?: string
} 

