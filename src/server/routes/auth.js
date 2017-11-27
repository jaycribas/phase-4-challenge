const router = require('express').Router()
const queries = require('../../db/queries')

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in', {
    title: 'Vinyl : Sign In'
  })
})

router.post('/sign-in', (req, res) => {
  const user = req.body
  queries.findUser(user)
    .then((foundUser) => {
      if (!foundUser) {
        return res.render('auth/sign-in', {
          warning: 'Incorrect email or password',
          title: 'Vinyl : Sign In'
        })
      }
      req.session.user = foundUser
      return res.redirect(`/users/${foundUser.id}`)
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up', {
    title: 'Vinyl : Sign Up'
  })
})

router.post('/sign-up', (req, res) => {
  const user = req.body
  queries.findUserByEmail(user)
    .then((foundUser) => {
      if (foundUser) {
        return res.render('auth/sign-up', {
          title: 'Vinyl : Sign Up',
          warning: 'Email address is already in use'
        })
      }
      if (req.body.password !== req.body.confirmPassword) {
        return res.render('auth/sign-up', {
          title: 'Vinyl : Sign Up',
          warning: 'Passwords do not match'
        })
      }
      return queries.createUser(user)
        .then((newUser) => {
          req.session.user = newUser
          return res.redirect(`/users/${newUser.id}`)
        })
    })
    .catch((error) => {
      res.status(500).render('error', { error })
    })
})

module.exports = router
