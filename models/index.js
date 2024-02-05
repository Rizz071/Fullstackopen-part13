const Blog = require('./Blog')
const User = require('./User')
const ReadingList = require('./ReadingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })

// Blog.sync({ alter: true })
// User.sync({ alter: true })

module.exports = {
    Blog, User, ReadingList
}