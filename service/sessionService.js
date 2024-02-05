const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')
const { Op } = require('sequelize')

/* MIDDLEWARE: Extracting token from request */
const tokenExtractor = async (req, res, next) => {

    const authorization = await req.get('authorization')
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

/* MIDDLEWARE: Checking token for expriration and for disabed
 * user state at each user action
 */
const tokenCheck = async (req, res, next) => {
    if (!req.decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
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
    if (session.expiration < Date.now()) {
        return res.status(401).json({ error: 'token expired! please login again' })
    }

    next()
}

/* Cleaning DB from expired tokens */
const dropExpiredTokens = async (id) => {
    await Session.destroy({
        where: {
            expiration: { [Op.lt]: Date.now() },
        }
    })
}

module.exports = { tokenExtractor, tokenCheck, dropExpiredTokens }