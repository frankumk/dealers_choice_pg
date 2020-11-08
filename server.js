const {client, syncAndSeed, getBookData, getBook, addBook} = require('./db');
const express = require('express');
const app = express();

const static = require('static');
const path = require('path');
const morgan = require('morgan');

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname,'./assets')));


const header = ()=>{
    return `
    <head>
        <link rel="stylesheet" href="/style.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap" rel="stylesheet">
        <title>Sci-Fi Book Recs</title>
    </head>
`
}
app.get('/',async(req,res,next)=>{
    try{
        const books = await getBookData();
        const html = `
            <!DOCTYPE html>
            <html>
                ${header()}
                <body>
                    <div class = "header">
                        <h1>Sci-Fi Standbys</h1>
                        <p>Here are a few sci-fi favorites to get you through a pandemic</p>
                    </div>
                    <div class = "booklist">
                    ${books.map(book =>{
                        return `
                        <div class="book">
                            <a href = "/books/id" class = "booklink">
                                <h4 class = "booktitle">${book.title}</h4>
                                <img src = "${book.img}" alt = "${book.title}"/>
                            </a>
                        </div>
                    `
                    }).join('')}

                </div>
            </body>
        </html>
        `;
        res.send(html);
    }catch(ex){
        console.log(ex);
        next(ex);
    }
});


app.get(`/books/:id`,async(req,res,next)=>{
    let nextBookId=1;
    //only 6 books, starts over at 1
    // if(book.id===6){
    //     nextBookId = 1;
    // }else{
    //     nextBookId = (book.id) +1;
    // }
    // console.log(nextBookId);
    try{
        const book = await getBook(req.params.id);
        if(book){
            res.send(`
                <!DOCTYPE html>
                <html>
                    ${header()}
                    <body>
                        <nav>
                            <a href='/'>Home</a>
                        //   <a href="/books/${nextBookId}">Next</a>
                        </nav>
                        <h1>${book.title}</h1>
                        <h2>${book.author}</h2>
                        <p class='reviews'>Review: ${book.review}</p>
                        <p class='summary'>${book.summary}</p>
                    </body>
                </html>
            `);
        }
    }catch(ex){
        console.log(ex);
        next(ex);
    }
});


const setUp = async() =>{
    try{
        await client.connect();
        await syncAndSeed();
        
        const port = process.env.PORT || 3000;
        app.listen(port,()=>console.log(`listening on port: ${port}`));
    }catch(ex){
        console.log(ex);
    }

}

setUp();