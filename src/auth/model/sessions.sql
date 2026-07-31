CREATE TABLE IF NOT EXISTS user_sessions (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   challonge_id VARCHAR(10) REFERENCES users(challonge_id) ON DELETE CASCADE,
   refresh_token TEXT NOT NULL UNIQUE,
   expires_at TIMESTAMP NOT NULL
);   
            