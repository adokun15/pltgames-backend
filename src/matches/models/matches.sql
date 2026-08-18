SELECT * FROM matches;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'match_state_type'
  ) THEN
    CREATE TYPE match_state_type AS ENUM (
      'pending',
      'complete',
      'open',
      'reopen',
      'mark_as_underway',
      'unmark_as_underway'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    challonge_match_id VARCHAR(20) NOT NULL,
    tournament_id NUMERIC(10) NOT NULL,
    round INT NOT NULL,
    player1_id BIGINT,
    player2_id BIGINT,
    winner_id  BIGINT,
    next_match_id BIGINT,
    state match_state_type DEFAULT 'pending',
    scores TEXT,
    points_by_participant JSONB,
    is_bye BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    -- participants table
    CONSTRAINT fk_player1
      FOREIGN KEY (player1_id)
      REFERENCES participants(challonge_participant_id)
      ON DELETE SET NULL,

    CONSTRAINT fk_player2
      FOREIGN KEY (player2_id)
      REFERENCES participants(challonge_participant_id)
      ON DELETE SET NULL,

    CONSTRAINT fk_winner
      FOREIGN KEY (winner_id)
      REFERENCES participants(challonge_participant_id)
      ON DELETE SET NULL,


    -- Tournament
    CONSTRAINT fk_tournament
      FOREIGN KEY (tournament_id)
      REFERENCES tournaments(challonge_tournament_id)
      ON DELETE CASCADE
);

 --INDEXES
CREATE INDEX idx_matches_round ON matches(round);
CREATE INDEX idx_matches_next_match ON matches(next_match_id);
CREATE INDEX idx_matches_players ON matches(player1_id, player2_id);
