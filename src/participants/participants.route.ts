//participants routes
import { Router } from "express";
import {
  AllParticipantsController,
  BulkParticipantsUpdateController,
  CreateParticipantController,
  LeaveTournamentAsParticipantController,
  SingleParticipantController,
  ManualSyncParticipantsController,
} from "./participants.controller";
import { AuthorizeChallongeResourceService } from "@/auth/auth.service";
import { BulkCleanUpParticipantsService } from "./participants.service";
import { AuthorizationClientRequest } from "@/utils/middleware/auth";

const participantRouter = Router();

//Fetch all participants(public): tournament scope and bulk update(private)
participantRouter
  .route("/")
  .get(AllParticipantsController) //public
  .post(AuthorizationClientRequest, CreateParticipantController); //player

//Sync challonge and database
participantRouter
  .route("/bulk_sync")
  .all(AuthorizationClientRequest)
  .post(ManualSyncParticipantsController)
  .patch(BulkParticipantsUpdateController);

//admin/cron: Bulk cleanup;
participantRouter
  .route("/cleanup")
  .all(AuthorizationClientRequest) //admin
  .delete(BulkCleanUpParticipantsService);

participantRouter
  .route("/:username")
  .get(SingleParticipantController) //public
  .delete(AuthorizationClientRequest, LeaveTournamentAsParticipantController); //player
//.patch(UpdateParticipantController)

export default participantRouter;
