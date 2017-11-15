const sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in')
  } next()
}

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    res.locals.isLoggedIn = true
    req.user = req.session.user
  } next()
}

const setDefaultResLocals = (req, res, next) => {
  res.locals.isLoggedIn = false
  next()
}

module.exports = {
  sessionChecker,
  isLoggedIn,
  setDefaultResLocals
}
