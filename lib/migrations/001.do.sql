CREATE TABLE IF NOT EXISTS pets (
  id            VARCHAR(36) DEFAULT (UUID()),
  name          VARCHAR(200) NOT NULL,
  created_date  DATE DEFAULT (CURRENT_DATE),
  userId        VARCHAR(36),
  PRIMARY KEY (id)
);