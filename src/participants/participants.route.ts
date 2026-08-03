//participants routes
import { Router } from "express";
import { AllParticipantsController, BulkParticipantsUpdateController, CreateParticipantController, LeaveTournamentAsParticipantController, SingleParticipantController, ManualSyncParticipantsController, } from "./participants.controller";
import { AuthorizeChallongeResourceService } from "@/auth/auth.service";

const participantRouter = Router();

//Fetch all participants(public): tournament scope and bulk update(private)
participantRouter.route("/")
.get(AllParticipantsController)
.post(AuthorizeChallongeResourceService, CreateParticipantController) //Join list 

//Sync challonge and database
participantRouter.route("/bulk_sync")
.post(ManualSyncParticipantsController)
.patch(BulkParticipantsUpdateController)

participantRouter.route("/:participant_id")
.get(SingleParticipantController)
.delete(LeaveTournamentAsParticipantController)
//.patch(UpdateParticipantController)

export default participantRouter