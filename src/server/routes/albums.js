const router = require('express').Router()
const queries = require('../../db/queries')

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

router.get('/:id/reviews/new', (req, res) => {
  queries.getAlbumsByID(req.params.id)
    .then((album) => {
      res.render('new', {
        user: req.user,
        album,
        title: 'Vinyl : New Review'
      })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.post('/:id/reviews/new', (req, res) => {
  queries.createReview(req.body)
    .then((review) => {
      res.redirect(`/albums/${review.album_id}`)
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.delete('/:id/reviews/delete', (req, res) => {
  queries.destroyReview(req.body.id, req.user.id)
    .then(() => {
      res.redirect('back')
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

module.exports = router
