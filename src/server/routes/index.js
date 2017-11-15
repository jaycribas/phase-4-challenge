const router = require('express').Router()
const session = require('express-session')
const queries = require('../../db/queries')
const middlewares = require('../middlewares')

router.use(session({
  key: 'user_sid',
  secret: 'vinyl top secret',
  resave: false,
  saveUninitialized: false
}))

router.use(middlewares.isSignedIn)

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in', {
    title: 'Vinyl : Sign In'
  })
})

router.post('/sign-in', (req, res) => {
  const user = req.body
  queries.findUser(user)
    .then((foundUser) => {
      if (!foundUser){
        return res.direct('/sign-in')
      }
      req.session.user = user
      res.redirect(`/users/${foundUser.id}`)
    })
})

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up', {
    title: 'Vinyl : Sign Up'
  })
})

router.post('/sign-up', (req, res) => {
  const user = req.body
  if (req.body.password !== req.body.confirmPassword) {
    return res.render('auth/sign-up', {
      title: 'Vinyl : Sign Up'
    })
  }
  return queries.createUser(user)
    .then((newUser) => {
      req.session.user = newUser
      return res.redirect(`/users/${newUser.id}`)
    })
})

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

router.use(middlewares.sessionChecker)

router.get('/users/:id', (req, res) => {
  queries.getUserById(req.params.id)
    .then((user) => {
      queries.getReviewsByUserId(user.id)
        .then((reviews) => {
          res.render('profile', {
            user,
            reviews,
            title: 'Vinyl : Profile'
          })
        })
    })
})

router.get('/albums/:id', (req, res) => {
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
})

router.get('/albums/:id/reviews/new', (req, res) => {
  queries.getAlbumsByID(req.params.id)
    .then((album) => {
      res.render('new', {
        user: req.user,
        album,
        title: 'Vinyl : New Review'
      })
    })
})

router.post('/albums/:id/reviews/new', (req, res) => {
  queries.createReview(req.body)
    .then((review) => {
      res.redirect(`/albums/${review.album_id}`)
    })
})

router.use((req, res) => {
  res.status(404).render('not_found')
})


module.exports = router
