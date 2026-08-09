import BaseError from "./baseError";

//MatchError & ParticipantError & AuthenticationError & UserError & TournamentError;
class ChallongeAPIError extends BaseError {
  meta: any;

  constructor(
    description = "Challonge operation failed!",
    statusCode: string | number,
    meta?: unknown,
  ) {
    super("CHALLONGE_API_ERROR", +statusCode, true, description);
    this.meta = meta;
  }
}

export default ChallongeAPIError;
