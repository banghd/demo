const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/')
    .get(categoryCtrl.getCategories)
    .post(auth, authAdmin, categoryCtrl.createCategory)

router.route('/:id')
    .delete(auth, authAdmin, categoryCtrl.deleteCategory)
    .put(auth, authAdmin, categoryCtrl.updateCategory)


module.exports = router