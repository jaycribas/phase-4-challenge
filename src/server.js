const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const queries = require('./db/queries')

const port = process.env.PORT || 3000

const app = express()

require('ejs')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('src/public'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  queries.getAlbums()
    .then((albums) => {
      queries.getRecentReviews()
        .then((reviews) => {
          res.render('index', {
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

app.get('/sign-in', (req, res) => {
  res.render('auth/sign-in', {
    title: 'Vinyl : Sign In'
  })
})

app.get('/sign-up', (req, res) => {
  res.render('auth/sign-up', {
    title: 'Vinyl : Sign Up'
  })
})

app.use(session({
  key: 'user_sid',
  secret: 'vinyl top secret',
  resave: false,
  saveUninitialized: false
}))

app.get('/users/:id', (req, res) => {
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

app.get('/albums/:id', (req, res) => {
  queries.getAlbumsByID(req.params.id)
    .then((album) => {
      queries.getReviewsByAlbumId(album.id)
        .then((reviews) => {
          res.render('album', {
            reviews,
            album,
            title: `Vinyl : ${album.title}`
          })
        })
    })
})

app.get('/albums/:id/reviews/new', (req, res) => {
  queries.getAlbumsByID(req.params.id)
    .then((album) => {
      res.render('new', {
        album,
        title: 'Vinyl : New Review'
      })
    })
})

app.post('/albums/:id/reviews/new', (req, res) => {
  queries.createReview(req.body)
    .then((review) => {
      res.redirect(`/albums/${review.album_id}`)
    })
})

app.use((req, res) => {
  res.status(404).render('not_found')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
