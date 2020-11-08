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
    SELECT title,author,year,img,review,summary 
    FROM scifi_books 
    JOIN scifi_authors 
    ON author_id=scifi_authors.id;`)).rows;
}

const getBook = async(id)=>{
    return (await client.query(`
    SELECT title,author,year,review,summary
    FROM scifi_books
    JOIN scifi_authors
    ON author_id=scifi_authors.id
    WHERE scifi_books.id = ${id};`)).rows[0];
}

const addBook = async({book,name,year,img,review,summary})=>{
//    if(ISNULL(`SELECT author FROM scifi_authors WHERE author = ${name}`)){
//     (await client.query('INSERT INTO scifi_authors(author) VALUES($1) RETURNING *;',[name])).rows[0];
//    }
//     return (await client.query('INSERT INTO scifi_books(title,author_id,year,img,review,summary) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;',[book,`SELECT id FROM scifi_authors WHERE author = ${name};`,year,img,review,summary])).rows[0];
}

module.exports = {
    client,
    syncAndSeed,
    getBookData,
    getBook,
    addBook
}