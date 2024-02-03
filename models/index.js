const Blog = require('./Blog')
const User = require('./User')

Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
    Blog, User
}