const { client } = require("../db");

const app = require('express').Router();

module.exports = app;

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
                    ${books.map(book => {
                        console.log(book);
                        return `
                        <div class="book">
                            <a href = "/books/${book.id}" class = "booklink">
                                <h4 class = "booktitle">${book.title}</h4>
                                <img src = "${book.img}" alt = "${book.title} Book Cover"/>
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
        next(ex);
    }
});


app.get('/books/:id',async(req,res,next)=>{
    const nextBookId=await nextBookIdMethod(Number(req.params.id));
    try{
        const book = await getBook(Number(req.params.id));
        if(book){
            res.send(`
                <!DOCTYPE html>
                <html>
                    ${header()}
                    <body id="book-detail">
                        <nav>
                            <a href='/'>Home</a>
                        //   <a href="/books/${nextBookId}">Next</a>
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

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(404).send(`That book does not exist, would you like to add it to the database? <a href="\books\add">Add Book</a>`);
});