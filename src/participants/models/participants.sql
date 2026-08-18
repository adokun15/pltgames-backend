DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'participant_status_type'
  ) THEN
    CREATE TYPE participant_status_type AS ENUM (
      'pending',
      'added',
      'left'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS participants (
	challonge_participant_id int,
	name TEXT,
	seed INTEGER,
	group_id int,
	status participant_status_type default 'pending',
    -- Remove participant if tournament is cancelled --
	tournament_id NUMERIC(10) NOT NULL REFERENCES tournaments(challonge_tournament_id) ON DELETE CASCADE, 
    -- Set username to null instead --
    username TEXT REFERENCES users(username) ON DELETE SET NULL,
	isActive BOOLEAN DEFAULT true,
    misc jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
	created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(username, tournament_id)
);   

DROP TRIGGER IF EXISTS trg_participants_updated_at ON participants;
            
CREATE TRIGGER trg_participants_updated_at
BEFORE UPDATE ON participants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
            