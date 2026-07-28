//tournaments routes
import { Router } from "express";
import { AllTournamentsController, CreateTournamentController, DeactivateTournamentController, SingleTournamentController, SyncTournamentsController, UpdatetournamentController } from "./tournaments.controller";

const matchRouter = Router();

//Fetch all tournament  and bulk update(private)
matchRouter.route("/tournaments/")
.get(AllTournamentsController) // public
.post(CreateTournamentController) //super_admin role

//Sync challonge and local database
matchRouter.route("/tournaments/bulk_sync")
.post(SyncTournamentsController)


//Single Tournament: Update(admin) and Fetch(public);
matchRouter.route("/tournaments/:tournament_id")
.get(SingleTournamentController)
.delete(DeactivateTournamentController)
.patch(UpdatetournamentController)