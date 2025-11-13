// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

// Addbook route
router.get('/addbook',function(req,res,next) {
    res.render('addbook.ejs')
})

router.get('/bargainbooks', function(req,res,next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('bargainbooks.ejs', {bargainBooks: result});
        }
    })
})

router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 

// Basic search 
// router.get('/search_result', function(req,res,next) {
//     let keyword = req.query.search_text
//     let sqlquery = "SELECT * FROM books WHERE name =?";

//     db.query(sqlquery, [keyword], (err,result) => {
//         if (err){
//             next(err)
//         } else{
//             res.render('searchresults.ejs', {results: result, keyword: keyword})
//         }
//     })
// })

router.get('/search_result', function(req, res, next) {
    // Get user input and store in keyword
    let keyword = req.query.search_text;

    // Difference here is that LIKE is used instead of =?
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    // % allows for partial matching e.g. typing "B" gives books beginning with B
    let searchTerm = "%" + keyword + "%"

    // Run SQL query on the DB
    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) {
            // Pass the error to the error handlre
            next(err)
        } else {
            // Render the results page and pass matching books
            res.render('searchresults.ejs', { results: result, keyword: keyword })
        }
    })
})



// Export the router object so index.js can access it
module.exports = router
