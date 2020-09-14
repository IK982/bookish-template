import "dotenv/config";
import express, { response } from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import { getAllBooks, getAllAuthors, getAllTitles, addNewBook, getAllUsers, deleteBook, getBookById, getUserById } from "./database"
import { addNewUser, matchHash} from "./loginQueries";
import { title } from "process";
import moment from "moment";
import passportlocal from "passport-local";
import passport from "passport";
import cookieparser from "cookie-parser";
import expresssession from "express-session";



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
    express.urlencoded({ extended: true })
);
app.use(cookieparser());
app.use(expresssession({
    secret: "secret"
}));


const LocalStrategy = passportlocal.Strategy;
app.use(passport.initialize())
passport.use(new LocalStrategy(
    async (email, password, done) => {
        //find the user

        const member = await matchHash(email, password);

        if (member === false) {
            return done(null, false, { message: "user not found" })
        }
        else {
            return done(null, member);
        }
    }

))
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



app.post("/signup", async (request, response) => {
    const name = request.body.name
    const email = request.body.email
    console.log(request.body)
    const password = request.body.password
    const confirm = await addNewUser(name, email, password)
    
    response.send("success")
})

app.get("/signup", (request, response) => {
    response.render('signup.html')
    
})
app.post('/login',
passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    
})
);



// app.get("/add-user", async (request, response) => {
//     response.render('addUser.html')
// });

// app.post("/add-user", async (request, response) => {
//     const user = request.body
//     console.log(user)
//     await addNewUser(user)
//     response.redirect("/all-users")
// });




/* ========= GET ALL BOOKS ====== */

app.get("/all-books", async (request, response) => {
    const bookRequest = await getAllBooks();
    const model = {
        books: bookRequest
    }
    response.render('books.html', model);
});

/* ========= GET ALL TITLES ====== */

app.get("/all-titles", async (request, response) => {
    const titleRequest = await getAllTitles();
    const model = {
        titles: titleRequest
    }
    response.render('titles.html', model);
});

/* ========= GET ALL AUTHORS  ====== */

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
        users: userRequest
    }
    response.render('users.html', model);
})

/* ========= ADD/DELETE BOOK ====== */

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


// app.get("/register", async (request, response) => {
//     response.render('register.html')
// })

// app.post("/register", async (request, response) => {
//     const newUser = request.body;
//     const sqlResultRegister = await addNewUser(newUser);
//     const model = {
//         register: sqlResultRegister
//     }
//     response.render('register.html')
// })
