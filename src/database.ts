import Knex from "knex";
import { title } from "process";


const client = Knex ({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: 'book_database',
        port: 5432
    }
});


export const getAllBooks = () => {
    return client('book')
    .select()
    .where("deleted", false)
}

export const getAllTitles = () => {
    return client('book')
    .select('title')
    .where("deleted", false)
    .orderBy('title')
}

export const getAllAuthors = () => {
    return client('book')
    .select('author')
    .where("deleted", false)
    // .where('author', 'like', `%${author}`)
}

export const getAllUsers = () => {
    return client ('member')
    .select()
    .orderBy('name')
}

interface Book {
    title: string;
    author: string;
    quantity: number;
}

export const addNewBook = (book: Book) => {
   return client.insert({title: book.title, author: book.author}).into("book")
}



export const deleteBook = (id: number) => {
    return client ('book').update("deleted", true)
    .where("id", id)
}



interface User {
    name: string;
    email: string;
    
}

export const addNewUser = (user: User) => {
    return client.insert({name: user.name, email: user.email}).into("member")
}


export const getUserById = (id: number) => {
    return client('member')
    .select('member.name', 'member.email', 'book.title', 'checked_out_book.check_out_date', 'checked_out_book.return_date')
    .join('checked_out_book', 'member.id', 'checked_out_book.member_id')
    .join('book_copy', 'checked_out_book.copy_id', 'book_copy.id')
    .join('book', 'book_copy.book_id', 'book.id')
    .where('member.id', id)
}


/* ========= GET BOOK WITH ID (DOESNT WORK YET) ====== */
export const getBookById = (id: number) => {
    return client('book')
    .distinct('book.id', 'book.title', 'book.author', 'book.quantity')
    .join('book_copy', 'book.id', 'book_copy.book_id')
    .where('book.id', id)
}
