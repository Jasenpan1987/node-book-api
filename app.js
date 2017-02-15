const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Category = require("./models/category");
const Book = require("./models/book");

const app = express();

app.use(bodyParser.json());

// connect to mongoose
mongoose.connect("mongodb://localhost/bookstore");

const db = mongoose.connection;

// handle routes
app.get("/", (req, res) => {
    res.send("Please use /api/books \nor /api/categories");
});

// ************************************************************
// Categories

// get all categories
app.get("/api/categories", (req, res) => {
    Category.getCategories((err, categories) => {
        if(err) throw err;
        return res.json(categories);
    }, 10);
});

// get one category by id
app.get("/api/categories/:id", (req, res) => {
    const id = req.params.id;
    if(id === "" || id === undefined) return res.send("No id as params");
    Category.getCategoryById(id, (err, category) => {
        if(err) throw err;
        return res.json(category);
    })
})

// add new category
app.post("/api/categories", (req, res) => {
    const newName = req.body.name;
    if(!newName) return res.send("No title for create new category");
    Category.addCategory(newName, (err) => {
        if(err) throw err;
        return res.json({ status: "success" });
    });
})

// modify a category
app.put("/api/categories/:id", (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    if(!id) return res.send("No id as param");
    if(!newName) return res.send("No title for update category");
    
    Category.updateCategory(id, newName, (err, result) =>{
        if(err) throw err;
        if(result.name === newName) return res.json(Object.assign(result, { status: "success" }));
        return res.json({ status: "failed" })
    });
});

// delete a category
app.delete("/api/categories/:id", (req, res) => {
    const id = req.params.id;
    if(!id) return res.send("No id as param");

    Category.removeCategory(id, (err, result) => {
        if(err) throw err;
        if(result._id) return res.json(Object.assign({result}, { status: "success" }));
        return res.json({ status: "failed" });
    })
})


// ************************************************************
// Books

// get all books
app.get("/api/books", (req, res) => {
    Book.getBooks((err, books) => {
        if(err) throw err;
        return res.json(books);
    }, 50);
});

// get one book by id
app.get("/api/books/:id", (req, res) => {
    const id = req.params.id;
    if(id === "" || id === undefined) return res.send("No id as params");
    Book.getBookById(id, (err, book) => {
        if(err) throw err;
        return res.json(book);
    });
});

// add a new book
app.post("/api/books", (req, res) => {
    const book = req.body;
    if(!validateBook(book)) return res.send("Book is not valid");
    Book.addBook(book, (err) => {
        if(err) throw err;
        return res.json({ status: "success" });
    });
});

// modify a book
app.put("/api/books/:id", (req, res) => {
    const id = req.params.id;
    if(!id) return res.send("No id as params");
    Book.updateBook(id, req.body, (err, result) => {
        if(err) throw err;
        if(!result._id) return res.json({ status: "failed" });
        return res.json(Object.assign({result}, { status: "success" }));
    });
});

// delete a book
app.delete("/api/books/:id", (req, res) => {
    const id = req.params.id;
    if(!id) return res.send("No id as params");
    Book.removeBook(id, (err, result) => {
        if(err) throw err;
        if(result._id) return res.json(Object.assign({result}, { status: "success" }));
        return res.json({ status: "failed" });
    });
});

// ************************************************************
// Set PORT and listen to PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("server listen to port " + PORT);
});

// ************************************************************
// helper functions
function validateBook(book){
    if(!book.title || !book.pages || 
        !book.img_url || !book.isbn || 
        !book.buy_url || !book.category){
            return false    
        }
    return true;
}