
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

export type ChallongeRequest = {
    path: string,
    body_content?: object,
    method?: string | null,
    authorization: string,
    authorization_version: string
}

export type ChallongeAuthResponseBody = {
	access_token: string,    
	expires_in: number,
	refresh_token: string,
	token_type?: string,
	scope?: string,
	created_at?: number
    error?: string,
    error_description?: string
}

 export type ParticipantBody = {
    challonge_participant_id: number,
    name?: string,
    seed: number,
    group_id?: string,
    tournament_id: number,
    username?: string,
    final_rank?: number,
    isactive: boolean,
}

export type TournamentBody = {
    //id: string,
	tournament_name: string,
	challonge_tournament_id: number,
    description?: string,
    current_participants_count: number,
    slug: string,
    min_team_size: number,
    max_team_size: number,
    isPrivate: boolean,
    state: string,
    game_name: string,
    tournament_type: string,
    max_signup: number,
    progress: number,
    check_in_duration: number,
    includeteams: boolean,
    gameroom?: string,
    poster_url?: string,
    starts_at?: string,
    started_at?: string,
    completed_at?: string,
    last_synced?: string,
    updated_at?: string,
	created_at?: number,
    organizer_id?: string,
    group_stage_enabled?: boolean, 
    group_stage_options?: JSON, 
    double_elimination_options?: JSON, 
   // single_elimination_options?: JSON, 
    round_robin_options?: JSON, 
    swiss_options?: JSON, 
    free_for_all_options?: JSON, 
    error?: string,
    error_description?: string
}

export type matchResType = {
        data: {
            id: string,
            type: string,
            attributes: {
                state: string, //enum
                round: number,
                identifier: string,
                suggested_play_order: number,
                scores: string,
                score_in_sets: [number, number][],
                points_by_participant: {
                        participant_id: number,
                        scores: number[]
                    }[],
                timestamps: {
                    created_at: Date,
                    updated_at: Date,
                },
                winner_id: number,
                relationships: {
                    player1: {
                        data: {
                            id: string,
                            type: string
                        }
                    },
                    player2: {
                        data: {
                            id: string,
                            type: string
                        }
                    }
                }
            }
        }[]
     } | {
        detail: string,
        status: number,
        source: {
            pointer: string
        }
    }[]
