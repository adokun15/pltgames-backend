import { handleChallongeResponse } from "./ChallongeErrorHandler";
import {
  ChallongeAuthResponseBody,
  ChallongeRequest,
  matchResType,
  ParticipantBody,
  TournamentBody,
} from "./challongeTypes";

//Change authcode for token
export async function ChallongeHelper(body: ChallongeRequest) {
  //User, Match, participant and tournament
  let req: object = {};

  //Get Method
  if (body.method === null || body.method?.toUpperCase() === "GET") {
    req = {
      method: "GET",
    };
  } else {
    req = {
      method: body.method,
      body: JSON.stringify(body.body_content),
    };
  }

  //Reach out for token exchahnge
  const makeRequest = await fetch(
    `https://api.challonge.com/v2.1${body.path}`,
    {
      ...req,
      headers: {
        Authorization: body.authorization,
        Accept: "application/json",
        "Authorization-Type": body.authorization_version,
        "Content-Type": "application/vnd.api+json",
      },
    },
  );

  //Make Research on the 'unknown api result;
  const data = await makeRequest.json();
  return data;
}

//User
export async function ChallongeUserRequestHelper(body: ChallongeRequest) {
  try {
    const res = await ChallongeHelper(body);

    if (!res?.data) {
      return {
        error: "USER_NOT_FOUND",
        error_description: "This user does not exist found or token is invalid",
      };
    }
    const {
      id: challonge_id,
      attributes: { email, username, image_url },
    } = res?.data;
    return {
      challonge_id,
      email,
      username,
      avatar: image_url,
    };
  } catch (e) {
    console.log(e);
  }
}

//PARTICIPANT List
export async function ChallongeParticipantRequestHelper(
  body: ChallongeRequest,
) {
  try {
    const res = await ChallongeHelper(body);

    if (!res) {
      return {
        error: "NO_RESPONSE",
        error_description: "No response from Challonge",
      };
    }

    if (res.error) {
      return {
        error: res.error,
        error_description: res.error_description || "Challonge error",
      };
    }

    if (!Array.isArray(res.data)) {
      return {
        error: "INVALID_DATA",
        error_description: "Unexpected data format",
      };
    }

    const re_shaped = res?.data.map((p) => ({
      challonge_participant_id: p?.id,
      name: p.attributes.name,
      seed: p.attributes?.seed,
      group_id: p.attributes.group_id,
      tournament_id: p.attributes.tournament_id,
      username: p.attributes?.username,
      final_rank: p.attributes?.final_rank,
      misc: p.attributes?.misc,
      isactive: p.attributes.states.active,
    }));

    return re_shaped as ParticipantBody[];
  } catch (e) {
    console.log(e);

    return {
      error: "INTERNAL_ERROR",
      error_description: "Something went wrong",
    };
  }
}

//Bulk Update Participants
export async function ChallongeBulkParticipantHelper(body: ChallongeRequest) {
  try {
    const res = await ChallongeHelper(body);

    if (!res) {
      return {
        error: "NO_RESPONSE",
        error_description: "No response from Challonge",
      };
    }

    if (res.error) {
      return {
        error: res.error,
        error_description: res.error_description || "Challonge error",
      };
    }

    if (!Array.isArray(res.data)) {
      return {
        error: "INVALID_DATA",
        error_description: "Unexpected data format",
      };
    }

    const re_shaped = res?.data.map((p: any) => ({
      challonge_participant_id: p?.id,
      username: p.attributes?.username,
    }));

    console.log(re_shaped);
    return re_shaped as {
      challonge_participant_id: string;
      username: string;
    }[];
  } catch (e) {
    console.log(e);

    return {
      error: "INTERNAL_ERROR",
      error_description: "Something went wrong",
    };
  }
}

//Matches list
export async function ChallongeMatchesHelper(
  body: ChallongeRequest,
  tournamentId?: number,
) {
  const res: matchResType = await ChallongeHelper(body);

  /* Transform Data! */
  const { data } = handleChallongeResponse(res);

  return {
    data: data.map((m) => ({
      challonge_match_id: m.id,
      tournament_id: +tournamentId,
      round: m.attributes.round,
      player1_id: m.attributes.relationships.player1.data?.id,
      player2_id: m.attributes.relationships.player2.data?.id,
      winner_id: m.attributes.winner_id,
      is_bye:
        !m.attributes.relationships.player1.data?.id ||
        !m.attributes.relationships.player2.data?.id,
      state: m.attributes.state,
      scores: m.attributes.scores,
      points_by_participant: m.attributes.points_by_participant,
    })),
  };
}

// -- TOURNAMENTS
export async function ChallongeTournamentRequestHelper(body: ChallongeRequest) {
  try {
    const res = await ChallongeHelper(body);

    if (!res) {
      return {
        error: "NO_RESPONSE",
        error_description: "No response from Challonge",
      };
    }

    if (res.error) {
      return {
        error: res.error,
        error_description: res.error_description || "Challonge error",
      };
    }

    if (!Array.isArray(res.data)) {
      return {
        error: "INVALID_DATA",
        error_description: "Unexpected data format",
      };
    }

    const re_shaped = res?.data.map((t: any) => ({
      tournament_name: t.attributes.name,
      challonge_tournament_id: t.id,
      description: t.attributes.description,
      current_participants_count: t.attributes.participants_count,
      slug: t.attributes.url,
      tournament_type: t.attributes.tournament_type,
      min_team_size: t.attributes.min_team_size,
      max_team_size: t.attributes.max_team_size,
      isPrivate: t.attributes.private,
      state: t.attributes.state,
      game_name: t.attributes.game_name,
      max_signup: t.attributes.registration_options?.signup_cap,
      progress: t.attributes.progress_meter,
      check_in_duration: t.attributes.registration_options.check_in_duration,
      includeteams: t.attributes.teams,
      gameroom: "discord-community-link",
      poster_url: t.attributes.live_image_url,
      starts_at: t.attributes.starts_at,
      started_at: t.attributes.timestamps?.started_at,
      completed_at: t.attributes.timestamps?.completed_at,
      last_synced: null,
      updated_at: t.attributes.timestamps?.updated_at,
      created_at: t.attributes.timestamps?.created_at,
      organizer_id: t.relationships?.organizer?.data?.id,
      group_stage_enabled: t.attributes.group_stage_enabled,
      group_stage_options: t.attributes?.group_stage_options || null,
      double_elimination_options:
        t.attributes?.double_elimination_options || null,
      round_robin_options: t.attributes?.round_robin_options || null,
      swiss_options: t.attributes?.swiss_options || null,
      free_for_all_options: t.attributes?.free_for_all_options || null,
    }));

    const data = re_shaped as TournamentBody[];
    console.log(re_shaped);
    return re_shaped;
  } catch (e) {
    console.log(e);

    console.error("fetchTournaments error:", e);

    return {
      error: "INTERNAL_ERROR",
      error_description: "Something went wrong",
    };
  }
}

//AUTHORIZATION;
export async function ChallongeAuthRequestHelper(body: ChallongeRequest) {
  try {
    let req: object = {};

    //Get Method
    if (body.method === null || body.method?.toUpperCase() === "GET") {
      req = {
        method: "GET",
      };
    } else {
      req = {
        method: body.method,
      };
    }

    if (body.body_content) {
      req = { body: JSON.stringify(body.body_content) };
    }

    //Reach out for token exchahnge
    const makeRequest = await fetch(`https://api.challonge.com${body.path}`, {
      ...req,
      headers: {
        Authorization: body.authorization,
        Accept: "application/json",
        "Authorization-Type": body.authorization_version,
        "Content-Type": "application/vnd.api+json",
      },
    });

    const response: ChallongeAuthResponseBody = await makeRequest.json();

    return response;
  } catch (e) {
    console.log(e);
    console.log(e.message);
    throw new Error(e);
  }
}
