const Category = require('../models/categoryModel')
const Products = require('../models/productModel')

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find((err)=>{
                if(err) res.json({msg : err})
                
            })
            res.json(categories)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createCategory: async (req, res) => {
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const { name } = req.body;
            const category = await Category.findOne({ name })
            if (category) return res.status(400).json({ msg: "This category already exists." })

            const newCategory = new Category({ name })

            await newCategory.save((err) => {
                if (err) res.json({ msg: err })
                res.json({ msg: "Created a category" })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const products = await Products.findOne({ category: req.params.id })
            if (products) return res.status(400).json({
                msg: "Please delete all products with a relationship."
            })

            await Category.findByIdAndDelete(req.params.id, (err) => {
                if(err) res.json({msg : err})
                res.json({ msg: "Deleted a Category" })
            })
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.findOneAndUpdate({ _id: req.params.id }, { name }, (err)=>{
                if(err)res.json({msg : err})
                res.json({ msg: "Updated a category" })
            })

        
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}


module.exports = categoryCtrl