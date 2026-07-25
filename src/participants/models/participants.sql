CREATE TABLE IF NOT EXISTS participants (
    id serial primary key,
	challonge_participant_id NUMERIC(10) not null UNIQUE,
	name TEXT,
	seed INTEGER NOT NULL,
	group_id VARCHAR(30),
    -- Remove participant if tournament is cancelled --
	tournament_id NUMERIC(10) NOT NULL REFERENCES tournaments(challonge_tournament_id) ON DELETE CASCADE, 
    -- Set username to null instead --
    username TEXT REFERENCES users(username) ON DELETE SET NULL,
	isActive BOOLEAN DEFAULT true,
    misc TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
	created_at TIMESTAMPTZ DEFAULT NOW()
);   

DROP TRIGGER IF EXISTS trg_participants_updated_at ON participants;
            
CREATE TRIGGER trg_participants_updated_at
BEFORE UPDATE ON participants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
            