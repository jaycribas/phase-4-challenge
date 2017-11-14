const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
// const db = require('./db')
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

app.use((req, res) => {
  res.status(404).render('not_found')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
