const Blog = require('./Blog')
const User = require('./User')
const ReadingList = require('./ReadingList')
const Session = require('./Session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })

User.hasMany(Session)
Session.belongsTo(User)


module.exports = {
    Blog, User, ReadingList, Session
}