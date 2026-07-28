//Views: Public;
export async function ViewAllTournamentsService(){}
export async function ViewSingleTournamentService(){}

//Action: super_admin
export async function CreateTournamentService(){};
export async function UpdateTournamentService(){};
export async function DeactivateTournamentService(){};

//CronJob / Manually;
export async function SyncTournamentsService(){
    //pull 'active' tournament and update local database;
}