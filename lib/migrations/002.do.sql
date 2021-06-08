CREATE TABLE IF NOT EXISTS users (
  id                 VARCHAR(36) DEFAULT (UUID()),
  email              VARCHAR(255) NOT NULL UNIQUE,
  password_hash      VARCHAR(255) NOT NULL,
  firstName          VARCHAR(255) NOT NULL,
  lastName           VARCHAR(255) NOT NULL,
  phoneNumber        VARCHAR(255) NOT NULL,
  role               VARCHAR(10) DEFAULT 'user',
  PRIMARY KEY (id)
);