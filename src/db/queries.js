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
      *, TO_CHAR(posted_on, 'MM/DD/YYYY') AS date
    FROM
      reviews
    JOIN
      albums ON reviews.album_id = albums.id
    ORDER BY
      posted_on DESC
    LIMIT
      3
  `)
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  getRecentReviews
}
