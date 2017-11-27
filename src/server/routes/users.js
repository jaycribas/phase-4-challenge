const router = require('express').Router()
const queries = require('../../db/queries')

router.get('/:id', (req, res) => {
  queries.getUserById(req.params.id)
    .then((userDetail) => {
      queries.getReviewsByUserId(userDetail.id)
        .then((reviews) => {
          res.render('profile', {
            user: req.user,
            userDetail,
            reviews,
            title: 'Vinyl : Profile'
          })
        })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

module.exports = router
