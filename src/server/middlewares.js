const sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/sign-in')
  } next()
}

const isSignedIn = (req, res, next) => {
  if (req.session.user) {
    res.locals.isSignedIn = true
    req.user = req.session.user
  } next()
}

const setDefaultResLocals = (req, res, next) => {
  res.locals.isSignedIn = false
  next()
}

module.exports = {
  sessionChecker,
  isSignedIn,
  setDefaultResLocals
}
