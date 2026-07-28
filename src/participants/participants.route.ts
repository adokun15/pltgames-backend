//participants routes
import { Router } from "express";
import { AllParticipantsController, BulkParticipantsUpdateController, CreateParticipantController, LeaveTournamentAsParticipantController, SingleParticipantController, SyncParticipantsController, UpdateParticipantController } from "./participants.controller";

const matchRouter = Router();

//Fetch all participants(public): tournament scope and bulk update(private)
matchRouter.route("/participants/")
.get(AllParticipantsController)
.post(CreateParticipantController)

//Sync challonge and database
matchRouter.route("/participants/bulk_sync")
.post(SyncParticipantsController)
.patch(BulkParticipantsUpdateController)

matchRouter.route("/participants/:participant_id")
.get(SingleParticipantController)
.delete(LeaveTournamentAsParticipantController)
.patch(UpdateParticipantController)