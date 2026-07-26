//Matches routes

import { Router } from "express";
import { AllMatchesController, BulkMatchUpdateController, SingleMatchController, UpdateMatchController } from "./matches.controller";

const matchRouter = Router();

//Fetch all matches(public): tournament scope and bulk update(private)
matchRouter.route("/matches/")
.get(AllMatchesController)

//Manually/Automatically update Challonge;
matchRouter.post('/matches/bulk_sync', BulkMatchUpdateController);

//Single Match: Update(private) and Fetch(public);
matchRouter.route("/matches/:match_id")
.get(SingleMatchController)
.patch(UpdateMatchController);