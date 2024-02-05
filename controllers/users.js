const router = require('express').Router()
const { Op } = require('sequelize')


const { User, Blog, ReadingList } = require('../models')

const userFinder = async (req, res, next) => {

    req.user = await User.findOne({
        where: {
            username: req.params.username
        },
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Blog,
                as: 'marked_blogs',
                attributes: {
                    exclude: ['userId']
                },
                through: {
                    attributes: ['id', 'unread'],
                    where: req.query.read ? { unread: req.query.read } : {}
                }
            }
        ]
    })

    const readingListsForUser = await ReadingList.findAll({
        attributes: ['userId', 'blogId'],
        where: {
            userId: 1
        }
    })
    req.user.readinglist = readingListsForUser
    next()
}



router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Blog,
                as: 'marked_blogs',
                through: {
                    attributes: []
                },
                attributes: { exclude: ['userId'] }
            }
        ]
    })
    res.status(200).send(users)
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.get('/:username', userFinder, async (req, res) => {
    if (req.user) {
        res.json(req.user)
    } else {
        res.status(404).end()
    }
})

router.delete('/:username', userFinder, async (req, res) => {
    if (req.user) {
        await req.user.destroy()
    }
    res.status(204).end()
})

router.put('/:username', userFinder, async (req, res, next) => {
    if (req.user) {
        req.user.username = req.body.username

        try {
            await req.user.save()
            res.json(req.user)
        }
        catch (error) {
            next(error)
        }
    } else {
        res.status(404).end()
    }

})

module.exports = router