const Users = require('../models/userModel')
//const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const { getMaxListeners } = require('../models/userModel')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_API_KEY)
const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email }, err => {
                if (err) res.status(501).json({ msg: err })
            })
            if (user) return res.status(400).json({ msg: "The email already exists." })


            // Password Encryption
            const passwordHash = await
                bcrypt.hash(password, 10)

            const newUser = new Users({
                name, email, password: passwordHash
            })

            // Save mongodb
            await newUser.save(() => {
                if (err) res.json({ msg: err })
            })

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh-token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email }, (err) => {
                if (err) res.json({ msg: err })
            })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh-token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh-token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id, (err) => {
                if (err) res.json({ msg: err })
            }).select('-password')
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id , (err)=>{
                if(err) res.json({msg : err})
            })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            }, (err) =>{
                res.json({msg : err})
            })

            return res.json({ msg: "Added to cart" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgetPassword: async (req, res) => {
        const { email } = req.body
        Users.findOne({ email }, (err, user) => {
            if (err || !user) {
                return res.json({
                    msg: "User with that email does not exist"
                })
            }
            //if exist 
            const token = jwt.sign({
                id: user._id
            }, process.env.resetPassword, { expiresIn: '60m' })

            //send email to reset
            const emailData = {
                from: 'cubangso1@gmail.com',
                to: email,
                subject: "Password reset link",
                html: `
                <h1> Please click follow link to reset password</h1>
                <a href="http://localhost:3000/user/activate?token=${token}">Link</a>
                `
            }

            return user.updateOne({ resetToken: token }, (err, success) => {
                if (err) return res.status(400).json({ err })
                else {
                    sgMail.send(emailData)
                        .then(sent => {
                            return res.json({
                                msg: `email has been sent to ${email}`,
                                flag: true
                            })
                        })
                        .catch(err => {
                            return res.json({
                                msg: err.message
                            })
                        })
                }
            })
        })
    },
    updatePassword: async (req, res) => {
        const { resetToken, newPassword } = req.body

        if (resetToken) {
            jwt.verify(resetToken, process.env.resetPassword, function (err, decoded) {
                if (err) res.status(400).json({
                    msg: "Link expired"
                })

                Users.findOne({ resetToken }, async (err, user) => {
                    if (err || !user) {
                        console.log(user)
                        res.status(400).json({ error: "something went wrong !! Please try again" })
                    }
                    const newPasshash = await bcrypt.hash(newPassword, 10)
                    //console.log(newPasshash)
                    user = _.extend(user, { password: newPasshash, resetToken: "" })

                    await user.save((err) => {
                        if (err) res.json({ msg: "Error reset password" })

                        res.json({ msg: "Reset Password successfully" })
                    })
                }

                )
            }

            )
        }
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl

