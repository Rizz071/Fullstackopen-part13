const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')
const { dropExpiredTokens } = require('../service/sessionService')


router.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === user.dataValues.password

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    await Session.create({
        userId: user.id,
        token: token,
        date: Date.now(),
        expiration: Date.now() + 50000
    })

    dropExpiredTokens(user.id)


    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = router