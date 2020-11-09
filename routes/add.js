const {getBookData, getBook, addBook, nextBookIdMethod} = require('../db');
const app = require('express').Router();
const header = require('../templates.js');
module.exports = app;

app.get("/add",(req,res,next)=>{
    try{
        res.send(`
        <!DOCTYPE html>
                <html>
                    ${header()}
                    <body>
                        <nav>
                            <a href='/'>Home</a>
                        </nav>
                        <h1>Add a Book to the List</h1>
                        <form id='addBookForm' method='POST'>
                            <label for='title'>Book Title</label>
                            <input type='text' name='title' id='title' required>
                            <label for='author'>Book Author</label>
                            <input type='text' name='author' id='author' required>
                            <label for='year'>Year Published</label>
                            <input type='text' name='year' id='year'>
                            <label for='review'>Review(*)</label>
                            <input type='text' name='review' id='review'>
                            <label for='summary'>Book Summary</label>
                            <input type='text' name='summary' id='summary'>
                            <label for='bookCover'>Book Cover</label>
                            <input type='file' name='img' id='bookCover'>
                            <button type='submit' form='addBookForm' value="Submit">Add Book</button>
                        </form>
                </html>
        `);
    }catch(err){
        next(err);
    }
});

app.post("/add",async(req,res,next)=>{
    res.send(req.body);
    // try{
    //     await addBook(req.body);
    //     res.redirect('/add');//prevents you trying to insert data again

    // }catch(ex){
    //     next(ex);
    // }
});