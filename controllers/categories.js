const mongoose = require("mongoose")
const User = require("../models/User")
const Category = require("../models/Category")

module.exports = {
    checkCategory: async (userId, categoryString) => {
        console.log(`hello from categoriesController.checkCategory`)
        try {
            const user = await User.findOne({ _id: userId })
            console.log("user", user)
            const res = {}
            // if category does not exist in user.categories,
            const cleanIncomingCategory = categoryString[0].toUpperCase() + categoryString.slice(1).toLowerCase()
            // console.log(user.categories)
            const foundCategory = user.categories.filter(category => {
                let cleanCategory = category.name[0].toUpperCase() + category.name.slice(1).toLowerCase()
                return cleanCategory === cleanIncomingCategory
            })[0]
            console.log("foundCategory", foundCategory)
            let categoryId = null
            let secondAccountId = null
            if (!foundCategory) { //if a category isn't found
                //create a new category
                const newCategory = new Category({
                    name: cleanIncomingCategory
                })
                //add to user categories by
                //adding categories: newCategory to mongoose $push update
                user.categories = user.categories.concat(newCategory)
                categoryId = newCategory._id
            } else { //if a category is found
                if (foundCategory.account) { //if its account property isn't null
                    secondAccountId = foundCategory.account.toString() //set secondAccountId and use it to pull up the secondAccount object
                    console.log(typeof secondAccountId)
                    // console.log(dummyUser.accounts.filter(account => account._id == '635b0c0ccc363d1950ba130f'))    
                }
                // // if category has an account attached, that account needs to
                // // have the transaction id pushed to its transactions and have its
                // // currentBalance incremented as well
                categoryId = foundCategory._id
            }
            // create new Category and push to user.categories
            // should return categoryId
            res.categoryId = categoryId
            if (secondAccountId) res.secondAccountId = secondAccountId
            await user.save()
            console.log(`returning res from checkCategory`, res)
            return res
        } catch (err) {
            return undefined
        }
    }
}