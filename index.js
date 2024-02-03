const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)


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