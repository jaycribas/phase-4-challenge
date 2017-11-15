const db = require('./db')

const getAlbums = () => {
  return db.many(`
    SELECT * FROM albums
  `)
    .catch((error) => {
      console.error({
        message: 'Error while executing getAlbums :(',
        arguments
      })
      throw error
    })
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
    .catch((error) => {
      console.error({
        message: 'Error while executing getAlbumsByID :(',
        arguments
      })
      throw error
    })
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
    .catch((error) => {
      console.error({
        message: 'Error while executing getRecentReviews :(',
        arguments
      })
      throw error
    })
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
    .catch((error) => {
      console.error({
        message: 'Error while executing getReviewsByAlbumId :(',
        arguments
      })
      throw error
    })
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
    .catch((error) => {
      console.error({
        message: 'Error while executing createReview :(',
        arguments
      })
      throw error
    })
}

const destroyReview = (id) => {
  return db.none(`
    DELETE FROM
      reviews
    WHERE
      id = $1::int
  `, id)
    .catch((error) => {
      console.error({
        message: 'Error while executing destroyReview :(',
        arguments
      })
      throw error
    })
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
    .catch((error) => {
      console.error({
        message: 'Error while executing getUserById :(',
        arguments
      })
      throw error
    })
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
    .catch((error) => {
      console.error({
        message: 'Error while executing getReviewsByUserId :(',
        arguments
      })
      throw error
    })
}

const createUser = (user) => {
  return db.one(`
    INSERT INTO
      users (name, email, password, joined_on, img_url)
    VALUES
      ($/name/, $/email/, $/password/, NOW(), '/images/blank-profile-picture.png')
    RETURNING
      *
  `, user)
    .catch((error) => {
      console.error({
        message: 'Error while executing createUser :(',
        arguments
      })
      throw error
    })
}

const findUser = (user) => {
  return db.oneOrNone(`
    SELECT
      *
    FROM
      users
    WHERE
      email = $/email/
    AND
      password = $/password/
  `, user)
    .catch((error) => {
      console.error({
        message: 'Error while executing findUser :(',
        arguments
      })
      throw error
    })
}

const findUserByEmail = (user) => {
  return db.oneOrNone(`
    SELECT
      *
    FROM
      users
    WHERE
      email = $/email/
  `, user)
    .catch((error) => {
      console.error({
        message: 'Error while executing findUserByEmail :(',
        arguments
      })
      throw error
    })
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  getRecentReviews,
  getReviewsByAlbumId,
  createReview,
  destroyReview,
  getUserById,
  getReviewsByUserId,
  createUser,
  findUser,
  findUserByEmail
}
