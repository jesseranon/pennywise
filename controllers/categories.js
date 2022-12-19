const mongoose = require("mongoose")
const User = require("../models/User")
const Category = require("../models/Category")

module.exports = {
    checkCategory: async (userId, categoryString) => {
        console.log(`hello from categoriesController.checkCategory`)
        try {
            // sanitize categoryString
            const trimmedCategory = categoryString.trim()
            const cleanCategoryString = trimmedCategory[0].toUpperCase() + trimmedCategory.slice(1).toLowerCase()
            let foundCategory = await Category.findOne(
                {name: cleanCategoryString, user: null}
            )
            if (!foundCategory) foundCategory = await Category.findOne(
                {name: cleanCategoryString, user: userId}
            )
            if (!foundCategory) foundCategory = cleanCategoryString
            return foundCategory
        } catch (err) {
            return null
        }
    },
    postCategory: async (userId, categoryNameString) => {
        try {
            // use checkCategory (above)
            // create with user: req.user._id if it passes both checks
            const newCategory = new Category({
                name: categoryNameString,
                user: userId
            })
            newCategory.save()
            return newCategory
        } catch (err) {
            return err
        }
    },
    putCategory: async (userId, categoryId, categoryNameString) => {
        // this function will be used to modify a category.name of a category created by the user
    },
    deleteCategory: async (userId, categoryId, categoryNameString) => {
        // this function will be used to delete a category created by the user
        // this will need to remove the instance of the categoryId from any transaction that uses it
    }
}