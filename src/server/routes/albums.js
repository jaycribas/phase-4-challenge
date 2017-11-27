const router = require('express').Router()
const queries = require('../../db/queries')
const reviewsRoutes = require('./reviews')

router.use('/:id/reviews', reviewsRoutes)

router.get('/:id', (req, res) => {
  queries.getAlbumsByID(req.params.id)
    .then((album) => {
      queries.getReviewsByAlbumId(album.id)
        .then((reviews) => {
          res.render('album', {
            user: req.user,
            reviews,
            album,
            title: `Vinyl : ${album.title}`
          })
        })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

module.exports = router
