DROP TABLE IF EXISTS albums CASCADE;
CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(120) NOT NULL,
  joined_on DATE,
  img_url TEXT
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id SERIAL,
  album_id INT REFERENCES albums,
  user_id INT REFERENCES users,
  posted_on timestamp,
  body TEXT
);
