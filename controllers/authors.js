const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')

const { Op } = require('sequelize')


router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: ['author'],
        order: [['likes', 'DESC']]
    })
    res.status(200).send(authors)
})

module.exports = router