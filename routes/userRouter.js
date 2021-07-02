const router = require('express').Router()
const userCtrl = require('../controllers/userController')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
router.post('/register', validate.registerValidate,userCtrl.register)

router.post('/login', validate.loginValidation,userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh-token', userCtrl.refreshToken)

router.get('/information', auth, userCtrl.getUser)

router.post('/addcart',auth,  userCtrl.addCart)


router.post('/forgetPassword', userCtrl.forgetPassword)

router.post('/updatePassword', userCtrl.updatePassword)
module.exports = router