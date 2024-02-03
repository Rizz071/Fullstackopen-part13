const router = require('express').Router()

const { User } = require('../models')

const userFinder = async (req, res, next) => {
    req.user = await User.findOne({ where: { username: req.params.username } })
    next()
}

router.get('/', async (req, res) => {
    const users = await User.findAll()
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
    if (req.username) {
        res.json(req.username)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', userFinder, async (req, res) => {
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