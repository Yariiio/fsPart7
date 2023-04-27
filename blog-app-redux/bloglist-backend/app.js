const express = require('express')
const app = express()
const cors = require('cors')
const {errorHandler, tokenExtractor, userExtractor} = require('./utils/middleware')
require('express-async-errors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info('connected to database')
})
.catch((error) => {
    logger.error('Can not connect to database', error.message)
})

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

module.exports = app