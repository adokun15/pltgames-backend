DO $$
	BEGIN
  		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tournament_state_type') THEN
    		CREATE TYPE tournament_state_type AS ENUM ('pending', 'checking_in','checked_in', 'group_stages_underway', 'group_stages_finalized', 'underway', 'awaiting_review', 'complete');     
  	    END IF;
  		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tournament_play_type') THEN
    		CREATE TYPE tournament_play_type AS ENUM ('single elimination', 'double elimination','round robin', 'swiss', 'free for all');     
  	   END IF;
END $$;


CREATE TABLE IF NOT EXISTS tournaments (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	challonge_tournament_id NUMERIC(10) UNIQUE NOT NULL,
	tournament_name TEXT NOT NULL,
	slug VARCHAR(30) NOT NULL,
	game_name VARCHAR(100) NOT NULL,
	tournament_type tournament_play_type NOT NULL, 
    max_signup INTEGER NOT NULL DEFAULT 64,
	state tournament_state_type default 'pending',
	isPrivate BOOLEAN DEFAULT false,
	current_participants_count INTEGER DEFAULT 0,
	includeTeams BOOLEAN DEFAULT false,
	min_team_size INTEGER DEFAULT 4,
	max_team_size INTEGER DEFAULT 256,
	progress INTEGER DEFAULT 0,
	check_in_duration INTEGER DEFAULT 60,
	gameroom text,
	description text,
	group_stage_options json,
	double_elimination_options json,
    round_robin_options json,
    swiss_options json,
	free_for_all_options json,
	poster_url text,
	starts_at TIMESTAMPTZ, 
	started_at TIMESTAMPTZ,
	completed_at TIMESTAMPTZ,
	last_synced TIMESTAMPTZ,
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	created_at TIMESTAMPTZ DEFAULT NOW(),
	organizer_id VARCHAR(20),
	CONSTRAINT max_team_size_check CHECK (max_team_size < 256 )
);   
            
CREATE INDEX IF NOT EXISTS idx_tournaments_slug ON tournaments(slug);
 
DROP TRIGGER IF EXISTS trg_tournaments_updated_at ON tournaments;
            
CREATE TRIGGER trg_tournaments_updated_at
BEFORE UPDATE ON tournaments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();