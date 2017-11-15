const db = require('./db')

const getAlbums = () => {
  return db.many(`
    SELECT * FROM albums
  `)
}

const getAlbumsByID = (id) => {
  return db.one(`
    SELECT
      *
    FROM
      albums
    WHERE
      id = $1::int
  `, id)
}

const getRecentReviews = () => {
  return db.many(`
    SELECT
      reviews.*,
      albums.title,
      users.name AS user,
      TO_CHAR(posted_on, 'MM/DD/YYYY') AS date
    FROM
      reviews
    JOIN
      albums ON reviews.album_id = albums.id
    JOIN
      users ON reviews.user_id = users.id
    ORDER BY
      posted_on DESC
    LIMIT
      3
  `)
}

const getReviewsByAlbumId = (id) => {
  return db.many(`
    SELECT
      reviews.*,
      users.name AS user,
      albums.title,
      TO_CHAR(posted_on, 'MM/DD/YYYY') AS date
    FROM
      reviews
    JOIN
      albums ON reviews.album_id = albums.id
    JOIN
      users ON reviews.user_id = users.id
    WHERE
      album_id = $1::int
    ORDER BY
      posted_on DESC
  `, id)
}

const createReview = (review) => {
  return db.one(`
    INSERT INTO
      reviews (album_id, user_id, posted_on, body)
    VALUES
      ($/album_id/, $/user_id/, NOW(), $/body/)
    RETURNING
      *
  `, review)
}

const getUserById = (id) => {
  return db.one(`
    SELECT
      *,
      TO_CHAR(joined_on, 'Month DD, YYYY') AS joined_on
    FROM
      users
    WHERE
      id = $1::int
  `, id)
}

const getReviewsByUserId = (id) => {
  return db.any(`
    SELECT
      reviews.*,
      albums.title,
      TO_CHAR(posted_on, 'MM/DD/YYYY') AS date
    FROM
      reviews
    JOIN
      albums ON reviews.album_id = albums.id
    WHERE
      user_id = $1::int
    ORDER BY
      posted_on DESC
  `, id)
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  getRecentReviews,
  getReviewsByAlbumId,
  createReview,
  getUserById,
  getReviewsByUserId
}
