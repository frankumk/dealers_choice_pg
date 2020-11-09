const {getBookData, getBook, addBook, nextBookIdMethod} = require('../db');
const app = require('express').Router();
const header = require('../templates.js');
module.exports = app;

app.get('/books/:id',async(req,res,next)=>{
    const nextBookId=await nextBookIdMethod(Number(req.params.id));
    try{
        const book = await getBook(Number(req.params.id));
        if(book){
            res.send(`
                <!DOCTYPE html>
                <html>
                    ${header()}
                    <body>
                        <nav>
                            <a href='/'>Home</a>
                        //  <a href="/books/${nextBookId}">Next</a>
                        //  <a href="/add">Add Book</a>
                        </nav>
                        <h1>${book.title}</h1>
                        <h2>${book.author}</h2>
                        <h2>${book.year}</h2>
                        <p class='reviews'>Review: ${book.review}</p>
                        <p class='summary'>${book.summary}</p>
                    </body>
                </html>
            `);
        }
        else{
            next(ex);
        }
    }catch(ex){
        next(ex);
    }
});