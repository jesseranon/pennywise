const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Category", CategorySchema);