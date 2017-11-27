const router = require('express').Router()
const session = require('express-session')
const queries = require('../../db/queries')
const middlewares = require('../middlewares')
const albumsRoutes = require('./albums')
const usersRoutes = require('./users')
const authRoutes = require('./auth')

router.use(session({
  key: 'user_sid',
  secret: 'vinyl top secret',
  resave: false,
  saveUninitialized: false
}))

router.use(middlewares.isSignedIn)
router.use('/albums', middlewares.sessionChecker, albumsRoutes)
router.use('/users', middlewares.sessionChecker, usersRoutes)
router.use('/', authRoutes)

router.get('/', (req, res) => {
  queries.getAlbums()
    .then((albums) => {
      queries.getRecentReviews()
        .then((reviews) => {
          res.render('index', {
            user: req.user,
            albums,
            reviews,
            title: 'Vinyl'
          })
        })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})


router.use((req, res) => {
  res.status(404).render('not_found')
})


module.exports = router
