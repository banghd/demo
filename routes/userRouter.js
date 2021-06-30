const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
router.post('/register', validate.registerValidate,userCtrl.register)

router.post('/login', validate.loginValidation,userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh-token', userCtrl.refreshToken)

router.get('/infor', auth,  userCtrl.getUser)

router.patch('/addcart', auth, userCtrl.addCart)

// router.get('/history', auth, userCtrl.history)

router.post('/forgetPassword', userCtrl.forgetPassword)

router.post('/updatePassword', userCtrl.updatePassword)
module.exports = router