//participants routes
import { Router } from "express";
import { AllParticipantsController, BulkParticipantsUpdateController, CreateParticipantController, LeaveTournamentAsParticipantController, SingleParticipantController, UpdateParticipantController } from "./participants.controller";
import { AutoSyncFromChallongeParticipantsService } from "./participants.service";

const matchRouter = Router();

//Fetch all matches(public): tournament scope and bulk update(private)
matchRouter.route("/participants/")
.get(AllParticipantsController)
.post(CreateParticipantController)

//Sync challonge and database
matchRouter.route("/participants/bulk_sync")
.post(AutoSyncFromChallongeParticipantsService)
.patch(BulkParticipantsUpdateController)

//Single Match: Update(private) and Fetch(public);
matchRouter.route("/participants/:participant_id")
.get(SingleParticipantController)
.post(LeaveTournamentAsParticipantController)
.patch(UpdateParticipantController)