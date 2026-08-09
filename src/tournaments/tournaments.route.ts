//tournaments routes
import { Router } from "express";
import { AllTournamentsController, SingleTournamentController, SyncTournamentsController } from "./tournaments.controller";

const tournamentRouter = Router();

//Fetch all tournament  and bulk update(private)
tournamentRouter.route("/")
.get(AllTournamentsController) // public
//.post(CreateTournamentController) //super_admin role

//Sync challonge and local database
tournamentRouter.route("/bulk_sync")
.post(SyncTournamentsController)

//Single Tournament:  Update(admin) and Fetch(public);
tournamentRouter.route("/:tournament_id")
.get(SingleTournamentController)
//.delete(DeactivateTournamentController)
//.patch(UpdatetournamentController)

export default tournamentRouter;