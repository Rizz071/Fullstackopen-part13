const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { User, Blog, ReadingList } = require('../models')
const { sequelize } = require('../util/db')

const { Op } = require('sequelize')

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

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const { userId, blogId } = req.body
        const readingListNewEntity = await ReadingList.create({
            blogId,
            userId
        })
        res.json(readingListNewEntity)
    } catch (error) {
        next(error)
    }
})



router.get('/', async (req, res) => {
    const readingListEntity = await ReadingList.findAll()
    res.status(200).send(readingListEntity)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const readingListEntity = await ReadingList.findByPk(id)
    res.status(200).send(readingListEntity)
})

router.put('/:id', tokenExtractor, async (req, res, next) => {

    // const user = await User.findByPk(req.decodedToken.id)
    const blogFromReadingList = await ReadingList.findByPk(req.params.id)

    if (req.decodedToken.id === blogFromReadingList.userId) {
        blogFromReadingList.unread = req.body.unread

        try {
            await blogFromReadingList.save()
            res.json(blogFromReadingList)
        }
        catch (error) {
            next(error)
        }
    } else {
        res.status(404).end()
    }

})


module.exports = router