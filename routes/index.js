const router = require('express').Router()


router.use('/user', require('./userRouter'))
router.use('/category', require('./categoryRouter'))
router.use('/products', require('./productRouter'))
router.use('/image', require('./upload'))
module.exports = router