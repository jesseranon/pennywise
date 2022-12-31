const mongoose = require("mongoose")
const User = require("../models/User")
const Category = require("../models/Category")

module.exports = {
    checkCategory: async (userId, categoryString, accountId) => {
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
            if (!foundCategory) {
                foundCategory = await module.exports.postCategory(userId, cleanCategoryString, accountId)
            }
            return foundCategory
        } catch (err) {
            console.log(err)
            return {error: 'cannot create category'};
        }
    },
    postCategory: async (userId, categoryNameString, accountId = null) => {
        try {
            // use params passed from checkCategory
            
            // create and save new category
            const newCategory = new Category({
                name: categoryNameString,
                user: userId,
                account: accountId
            })
            await newCategory.save()
            
            
            // push to user's categories array
            await User.findOneAndUpdate(
                { _id: userId },
                { 
                    $push: {
                        categories: newCategory._id
                    }
                }
                )
                
                return newCategory
            } catch (err) {
                return err
            }
        },
        putCategory: async (userId, categoryId, categoryNameString) => {
            // this function will be used to modify a category.name of a category created by the user
            try {
                // check to see if category belongs to user
                // if it belongs to user, accept changes
                // if not, kick back to profile
            } catch (err) {
                console.log(err)
                return {error: 'cannot create category'};
            }
        },
        deleteCategory: async (userId, categoryId, categoryNameString) => {
            // this function will be used to delete a category created by the user
            // this will need to remove the instance of the categoryId from any transaction that uses it
    }
}