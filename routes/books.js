// Create a new router
const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


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

// Addbook route, user must also be logged in to add a book
router.get('/addbook', redirectLogin, function(req,res,next) {
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

router.post(
    '/bookadded',
    redirectLogin,
    [
        check('name').notEmpty(),
        check('price').isFloat({ min: 0 })
    ],
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If validation fails, show the addbook form again
            return res.render('addbook.ejs');
        }

        // saving data in database
        const name = req.sanitize(req.body.name)
        const price = req.body.price
        
        let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
        let newrecord = [name, price];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            res.send(' This book is added to database, name: ' + name + ' price ' + price);
        });
    }
);


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

router.get('/search_result',
    [
        check('search_text').notEmpty()
    ],
    function(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Reload the search page if validation fails
            return res.render('search.ejs');
        }

        // Get user input and store in keyword
        let keyword = req.sanitize(req.query.search_text);

        // Difference here is that LIKE is used instead of =?
        let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

        // % allows for partial matching
        let searchTerm = "%" + keyword + "%";

        // Run SQL query on the DB
        db.query(sqlquery, [searchTerm], (err, result) => {
            if (err) {
                next(err);
            } else {
                res.render('searchresults.ejs', { results: result, keyword: keyword });
            }
        });
    }
);




// Export the router object so index.js can access it
module.exports = router
