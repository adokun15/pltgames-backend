DO $$
	BEGIN
  		IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
    		CREATE TYPE user_role_type AS ENUM ('player', 'organizer', 'admin', 'super_admin');     
  	END IF;
END$$;


CREATE TABLE IF NOT EXISTS users (
	challonge_id VARCHAR(10) PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	role user_role_type  DEFAULT 'player',
	avatar TEXT,
	email TEXT,
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	created_at TIMESTAMPTZ DEFAULT NOW()
);   
            
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
            
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();