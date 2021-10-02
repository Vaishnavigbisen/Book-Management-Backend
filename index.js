// THIS IS MAIN BACKEND FILE

require('dotenv').config();

//Models
const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");


const express = require("express");
const app = express();
app.use(express.json());

//Mongoose module
var mongoose = require('mongoose');
//Default mongoose connection set up
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("CONNECTION ESTABLISHED"));


// http://localhost:3000/
app.get("/", (req, res) => {
    return res.json({"WELCOME": `to my Backend Software for the Book Company`});
});

/*-----------------------------------------------------BOOKS API SECTION STARTING--------------------------------------------------------*/ 

/*
Route            /books
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
//http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});


/*
Route            /book-isbn
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
// http://localhost:3000/book-isbn/1234Three
app.get("/book-isbn/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const getSpecificBook = await BookModel.findOne({ISBN: isbn});
    console.log(getSpecificBook);
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook);
});


/*
Route            /book-category
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/
// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    const {category} = req.params;
    const getSpecificBooks = await BookModel.find({category:category});
    if(getSpecificBooks.length===0) {
        return res.json({"error": `No Books found for the category of ${category}`});
    }
    return res.json(getSpecificBooks);
});


/*
Route           /book
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/
// http://localhost:3000/book
app.post("/book", async (req, res) => {
    const addNewBook = await BookModel.create(req.body);
    return res.json( {bookAdded: addNewBook, message: "Book was added !!!"} );
});


/*
Route           /book-update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
// http://localhost:3000/book-update/123Two
app.put("/book-update/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, req.body, {new: true});
    return res.json( {bookUpdated: updateBook, message: "Book was updated !!!"} );
});


/*
Route           /book-delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const deleteBook = await BookModel.deleteOne({ISBN: isbn});
    return res.json( {bookDeleted: deleteBook, message: "Book was Deleted !!!"} );
});


/*
  Route           /book-author-delete
  Description     delete a author from a book
  Access          PUBLIC
  Parameters      isbn, author id
  Method          DELETE
*/
//http://localhost:3000/book-author-delete/1234One/1
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    else {
        getSpecificBook.authors.remove(id);
        const updateBook= await BookModel.findOneAndUpdate({ISBN: isbn}, getSpecificBook, {new: true});
        return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
    }
});


/*-----------------------------------------------------BOOKS API SECTION COMPLETED--------------------------------------------------------*/ 

/*****************************************************************************************************************************************/

/*-----------------------------------------------------AUTHORS API SECTION STARTING--------------------------------------------------------*/ 


/*
Route            /authors
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
// http://localhost:3000/authors
app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});


/*
Route            /authors-id
Description      Get author by id
Access           PUBLIC
Parameter        id
Methods          GET
*/
// http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req, res) => {
    const {id} = req.params;
    const getSpecificAuthor = await AuthorModel.findOne({id: id});
    if(getSpecificAuthor===null) {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    return res.json(getSpecificAuthor);
});


/*
  Route           /author-isbn
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
// http://localhost:3000/author-isbn/1234One
app.get("/author-isbn/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const getSpecificAuthors = await AuthorModel.find({books:isbn});
    if(getSpecificAuthors.length===0) {
        return res.json({"error": `No Authors found for the book of ${isbn}`});
    }
    return res.json(getSpecificAuthors);
});


/*
Route           /author
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
// http://localhost:3000/author
app.post("/author", async (req, res) => {
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json( {authorAdded: addNewAuthor, message: "Author was added !!!"} );
});


/*
Route           /author-update
Description     update author
Access          PUBLIC
Parameters      id
Method          PUT
*/
// http://localhost:3000/author-update/2
app.put("/author-update/:id", async (req, res) => {
    app.put("/author-update/:id", async (req, res) => {
        const {id} = req.params;
        const updateAuthor = await AuthorModel.findOneAndUpdate({id: id}, req.body, {new: true});
        return res.json( {authorUpdated: updateAuthor, message: "Author was updated !!!"} );
    });
});


/*
  Route           /author-book-delete
  Description     delete author from book
  Access          PUBLIC
  Parameters      id,isbn
  Method          DELETE
  */
// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", async (req, res) => {
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Author found for the ISBN of ${isbn}`});
    }
    else {
        getSpecificBook.authors.remove(id);
        const updateBook= await BookModel.findOneAndUpdate({ISBN: isbn}, getSpecificBook, {new: true});
        return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
    }
});


/*
  Route           /author-delete
  Description     delete author
  Access          PUBLIC
  Parameters      id
  Method          DELETE
  */
// http://localhost:3000/author-delete/12345ONE
app.delete("/author-delete/:id", async (req, res) => {
    const {id} = req.params;
    const deleteAuthor = await AuthorModel.deleteOne({ID: id});
    return res.json( {AuthorDeleted: deleteAuthor, message: "Author was Deleted !!!"} );
});


/*-----------------------------------------------------AUTHORS API SECTION COMPLETED--------------------------------------------------------*/ 

/********************************************************************************************************************************************/

/*-----------------------------------------------------PUBLICATIONS API SECTION STARTING----------------------------------------------------*/ 



/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
// http://localhost:3000/publications
app.get("/publications", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
    
});


/*
Route            /publication-isbn
Description      Get specific publication on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
// http://localhost:3000/publication-isbn/1234Three
app.get("/publication-isbn/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const getSpecificPublications = await PublicationModel.findOne({ISBN: isbn});
    console.log(getSpecificPublications);
    if(getSpecificPublications===null) {
        return res.json({"error": `No Publication found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificPublications);
   
});

/*
Route           /publication
Description     add publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
// http://localhost:3000/publication
app.post("/publication", async (req, res) => {
    const addNewPublication = await PublicationModel.create(req.body);
    return res.json( {PublicationAdded: addNewPublication, message: "Publication was added !!!"} );
});


/*
  Route           /publication-update
  Description     update publication
  Access          PUBLIC
  Parameters      id
  Method          PUT
  */
// http://localhost:3000/publication-update/1
app.put("/publication-update/:id", async (req, res) => {
    const {id} = req.params;
    const updatePublication = await PublicationModel.findOneAndUpdate({ID: id}, req.body, {new: true});
    return res.json( {PublicationUpdated: updatePublication, message: "Publication was updated !!!"} );
});


/*
  Route           /publication-delete
  Description     delete publication
  Access          PUBLIC
  Parameters      id
  Method          DELETE
  */
// http://localhost:3000/publication-delete/1
app.delete("/publication-delete/:id", async (req, res) => {
    const {id} = req.params;
    const deletepublication = await PublicationModel.deleteOne({ID: id});
    return res.json( {PublicationDeleted: deletepublication, message: "Publication was Deleted !!!"} );
});

/*-----------------------------------------------------PUBLICATIONS API SECTION COMPLETED----------------------------------------------------*/ 


app.listen(3000, () => {
    console.log("MY EXPRESS APP IS RUNNING.....")
});