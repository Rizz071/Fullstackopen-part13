const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

const userFinder = async (req, res, next) => {
    req.user = await User.findOne({
        where: { username: req.params.username },
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

    const readingListsForUser = await ReadingList.findAll({
        attributes: ['userId', 'blogId'],
        where: {
            userId: 1
        }
    })
    // console.log(JSON.parse(req.user))
    req.user.readinglist = readingListsForUser
    // console.log(req.user)
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
    // console.log(req.user)
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