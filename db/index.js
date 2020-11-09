const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/scifi_book_db');

const fs = require('fs');
const path = require('path');

const syncAndSeed = async()=>{
    const sql = fs.readFileSync(path.join(__dirname, '../seed.sql')).toString();
    await client.query(sql);
}

const getBookData = async()=>{
    return (await client.query(`
    SELECT scifi_books.id,title,author,year,img,review,summary 
    FROM scifi_books 
    JOIN scifi_authors 
    ON author_id=scifi_authors.id;`)).rows;
}

const getBook = async(bookid)=>{
    return (await client.query(`
    SELECT scifi_books.id,title,author,year,review,summary
    FROM scifi_books
    JOIN scifi_authors
    ON author_id=scifi_authors.id
    WHERE scifi_books.id = ${bookid};`)).rows[0];
}

const nextBookIdMethod = async(bookid)=>{
    const robes = Number((await client.query(`
        SELECT COUNT(*) FROM scifi_books;
    `)).rows[0].count);
    console.log(robes);
    if(bookid >= robes){ 
        return 1;
    }else{
        return bookid + 1;
    }
}

const addBook = async(obj)=>{
    const authorExists = Number((await client.query(`SELECT COUNT(author) FROM scifi_authors WHERE author = ${obj.author}`)).rows[0].count);
    console.log(authorExists);
    return authorExists;
    // if(authorExists === 0){
    //     (await client.query('INSERT INTO scifi_authors(author) VALUES($1) RETURNING *;',[name])).rows[0];
    // }
    // return (await client.query('INSERT INTO scifi_books(title,author_id,year,img,review,summary) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;',[book,`SELECT id FROM scifi_authors WHERE author = ${name};`,year,img,review,summary])).rows[0];
}

module.exports = {
    client,
    syncAndSeed,
    getBookData,
    getBook,
    nextBookIdMethod,
    addBook
}