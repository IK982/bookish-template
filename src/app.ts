import "dotenv/config";
import express, { response } from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import {getAllBooks, getAllAuthors, getAllTitles, addNewBook, getAllUsers, deleteBook, getBookById, getUserById} from "./database"
import {addNewUser} from "./loginQueries";
import { title } from "process";
import moment from "moment";



const app = express();
const port = process.env['PORT'] || 3000;
// app.use (express.urlencoded({extended: true}));

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    }),
    express.static('public')
);

app.use(
    express.urlencoded({extended:true})
);

const PATH_TO_TEMPLATES = "./templates/";
const env = nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app
});
env.addFilter("formatDate", (sqlDate: string) => {
    return moment(sqlDate).format("DD-MM-YYYY");
});

app.get("/", (request, response) => {
    const model = {
        message: "World"
    }
    response.render('index.html', model);
});

app.get("/all-books", async (request, response) => {
    const bookRequest = await getAllBooks();
    const model = {
        books: bookRequest
    }
    response.render('books.html', model);
});

app.get("/all-titles", async (request, response) => {
    const titleRequest = await getAllTitles();
    const model = {
        titles: titleRequest
    }
    response.render('titles.html', model);
});

app.get("/all-authors", async (request, response) => {
    const authorRequest = await getAllAuthors();
    const model = {
        authors: authorRequest
    }
    response.render('authors.html', model);
});

app.get("/all-users", async (request, response) => {
    const userRequest = await getAllUsers();
    const model = {
        users : userRequest
    }
    response.render('users.html', model);
})

app.get("/add-book", async (request, response) => {
    response.render('addBook.html')
});

app.post("/add-book", async (request, response) => {
    const book = request.body
    console.log(book)
    await addNewBook(book)
    response.redirect("/all-books")
});

app.get("/delete-book", async (request, response) => {
    response.render('deleteBook.html')
});

app.post("/delete-book", async (request, response) => {
    const delete_book = request.body.id
    await deleteBook(delete_book)
    response.send("Book Deleted!")
});

// app.get("/add-user", async (request, response) => {
//     response.render('addUser.html')
// });

// app.post("/add-user", async (request, response) => {
//     const user = request.body
//     console.log(user)
//     await addNewUser(user)
//     response.redirect("/all-users")
// });


app.post("/signup", async (request, response) => {
    const name = request.body.name
    const email = request.body.email
    console.log(request.body)
    const password =  request.body.password
    const confirm =  await addNewUser(name, email, password)

    response.send("success")
})

app.get("/signup", (request, response) =>{
    response.render('signup.html')

})

/* ========= GET MEMBER INFO WITH ID ====== */
app.get("/user-id", async (request, response) => {
    response.render('bookCheckOut.html')
}) 

app.post("/user-id", async (request, response) => {
    const userID = request.body.id
    const model = {
        userCheckOuts: await getUserById(userID)
    };
    console.log(model)
    response.render('bookCheckOut.html', model)
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});


/* ========= GET BOOK INFO WITH ID ====== */
app.get("/book-id", async (request, response) => {
    response.render('bookById.html')
}) 

app.post("/book-id", async (request, response) => {
    const bookID = request.body.id
    const model = {
        book: await getBookById(bookID)
    };
    response.render('bookById.html', model)
    
})