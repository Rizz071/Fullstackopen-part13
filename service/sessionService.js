const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')


const tokenExtractor = (req, res, next) => {

    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.token = authorization.substring(7)
            req.decodedToken = jwt.verify(req.token, SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

const tokenCheck = async (req, res, next) => {
    if (!req.decodedToken.id) {
        return res.status(401).json({ error: 'token invalid of too old' })
    }

    const user = await User.findByPk(req.decodedToken.id)
    if (!user) {
        return res.status(401).json({ error: 'user not found' })
    }

    if (user.isDisabled) {
        return res.status(401).json({ error: 'user disabled by administrator' })
    }

    const session = await Session.findOne({
        where: {
            token: req.token
        }
    })

    if (!session) {
        return res.status(401).json({ error: 'session for user not found. please login' })
    }

    next()
}

module.exports = { tokenExtractor, tokenCheck }