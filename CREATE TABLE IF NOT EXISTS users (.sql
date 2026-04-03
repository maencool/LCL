CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  displayName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (id, email, displayName, password, isAdmin)
VALUES ('admin1', 'maencopra@gmail.com', 'Admin', 'maenissocool12345gGs', true)
ON CONFLICT DO NOTHING;