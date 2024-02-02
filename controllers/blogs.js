const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.status(200).send(blogs)
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        await blog.destroy()
    }
    res.status(204).end()
})

// router.put('/:id', async (req, res) => {
//     const note = await Note.findByPk(req.params.id)
//     if (note) {
//         note.important = req.body.important
//         await note.save()
//         res.json(note)
//     } else {
//         res.status(404).end()
//     }
// })

module.exports = router