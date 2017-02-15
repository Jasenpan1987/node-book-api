const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const categorySchema = Schema({
    name: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

// Get Categories
module.exports.getCategories = (callback, limit=50) => {
    Category.find(callback).limit(limit);
}

// Get Category by id
module.exports.getCategoryById = (id, callback) => {
    Category.findById(id, callback);
}

// Create new category
module.exports.addCategory = (name, callback) => {
    const newCategory = new Category({ name });
    newCategory.save(callback);
}

// Update category
module.exports.updateCategory = (id, name, callback) => {
    Category.findByIdAndUpdate(id, {$set: { name }}, {new: true}, callback);
}

// Delete category
module.exports.removeCategory = (id, callback) => {
    Category.findByIdAndRemove(id, callback);
}