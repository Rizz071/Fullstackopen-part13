const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')

const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: [
            {
                model: User,
                attributes: ['name']
            },
            {
                model: User,
                as: 'users_marked',
                through: {
                    attributes: []
                }
            }
        ],
        order: [['likes', 'DESC']],
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: req.query.search ? '%' + req.query.search + '%' : '%'
                    }
                }, {
                    author: {
                        [Op.iLike]: req.query.search ? '%' + req.query.search + '%' : '%'
                    }
                }
            ]
        }
    })
    res.status(200).send(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    if (req.blog.userId !== req.decodedToken.id) {
        res.status(401).send('unauthorized')
    }
    if (req.blog) {
        await req.blog.destroy()
    }
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        req.blog.likes = req.body.likes

        try {
            await req.blog.save()
            res.json(req.blog)
        }
        catch (error) {
            next(error)
        }
    } else {
        res.status(404).end()
    }

})

module.exports = router