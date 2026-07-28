//participants routes
import { Router } from "express";
import { AllParticipantsController, BulkParticipantsUpdateController, CreateParticipantController, LeaveTournamentAsParticipantController, SingleParticipantController, SyncParticipantsController, UpdateParticipantController } from "./participants.controller";

const participantRouter = Router();

//Fetch all participants(public): tournament scope and bulk update(private)
participantRouter.route("/")
.get(AllParticipantsController)
.post(CreateParticipantController)

//Sync challonge and database
participantRouter.route("/bulk_sync")
.post(SyncParticipantsController)
.patch(BulkParticipantsUpdateController)

participantRouter.route("/:participant_id")
.get(SingleParticipantController)
.delete(LeaveTournamentAsParticipantController)
.patch(UpdateParticipantController)

export default participantRouter