const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./server/routes')
const morgan = require('morgan')
const methodOverride = require('method-override')
const middlewares = require('./server/middlewares')

const port = process.env.PORT || 3000

const app = express()

require('ejs')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('src/public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(middlewares.setDefaultResLocals)
app.use(morgan('dev'))
app.use(methodOverride('_method'))

app.use('/', routes)

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
