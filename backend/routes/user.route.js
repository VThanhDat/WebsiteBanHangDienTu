const router = require('express').Router()
const ctrls = require('../controllers/user.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/current', [verifyAccessToken], ctrls.updateUser)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs