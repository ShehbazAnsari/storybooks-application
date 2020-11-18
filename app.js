const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const morgan = require('morgan')
const connectDB = require('./config/db')
const routes = require('./routes/index')


//Load env variable
dotenv.config({ path: './config/config.env' })

// Passport Config
require('./config/passport')(passport)

//Connect To Database
connectDB()

const app = express()


//Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method Override For Update And Delete (PUT & DELETE)
app.use(methodOverride('_method'))

//Cors
app.use(cors())

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//HabdleBars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//HandleBars Template Engine
app.engine('.hbs', exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

//Session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set Global Variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', routes)
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.use('/contact', require('./routes/contact'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold))