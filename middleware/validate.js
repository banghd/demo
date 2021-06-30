const Joi = require('joi')
const validate = {
    registerValidate: (req, res, next) => {
        const data = req.body
        const schema = Joi.object({
            name: Joi.string()
                // .pattern(new RegExp(`^[a-zA-Z]{3,30}$`))
                .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/, 'Only letter')
                .min(3)
                .max(30)
                .required()
                .trim(),

            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'), 'Password invalid'),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'vn'] } })

        })
        const { error } = schema.validate(data)
        if (error) return res.status(400).json({ msg: error.details[0].message })
        next()
    },
    loginValidation: (req, res, next) => {
        const data = req.body
        const schema = Joi.object({

            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'), 'Password invalid'),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'vn'] } })

        })

        const { error } = schema.validate(data)
        if (error) return res.status(400).json({ msg: error.details[0].message })
        next()
    }
}
module.exports = validate