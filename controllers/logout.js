const router = require('express').Router()
const { Session } = require('../models')


/* To logout user => go for /api/logout with DELETE and 
 * payload: {userId: int_number}
 */
router.delete('/', async (request, response) => {
    try {
        await Session.destroy({
            where: {
                userId: request.body.user_id
            }
        })

        response
            .status(204)
            .send(`Sessions for user ${request.body.user_id}`)
    }
    catch (error) {
        response
            .status(400)
            .send(`Unseccessfull sessions deleting`)
    }
})

module.exports = router