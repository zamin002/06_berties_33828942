var express = require('express')
var router = express.Router()

router.get('/books', function (req, res, next) {

    let sqlquery = "SELECT * FROM books";
    let params = []

    // ?search=world
    const search = req.query.search
    if (search) {
        sqlquery += " WHERE name LIKE ?";
        params.push('%' + search + '%')
    }

    // ?minprice=5&maxprice=10
    const min = req.query.minprice;
    const max = req.query.maxprice;
    if (min && max) {
        // If there was already a WHERE for search append AND otherwise start WHERE
        sqlquery += search ? " AND price BETWEEN ? AND ?" : " WHERE price BETWEEN ? AND ?";
        params.push(min, max)
    }

    // ?sort=name or ?sort=price
    const sort = req.query.sort;
    if (sort == 'name') {
        sqlquery += " ORDER BY name ASC";
    } else if (sort == 'price') {
        sqlquery += " ORDER BY price ASC";
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err)
            next(err)
        } else {
            res.json(result)
        }
    })
})

module.exports = router