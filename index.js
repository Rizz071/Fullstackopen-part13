const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistRouter = require('./controllers/readinglist')

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistRouter)


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)



const errorHandler = (err, req, res, next) => {
    console.log('Error handler received error')

    switch (req.method) {
        case 'POST':
            return res.status(400).json(err.errors[0].message)
        case 'PUT':
            return res.status(404).json(err.errors[0].message)
        default:
            next(err)
    }
}

app.use(errorHandler)



const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()