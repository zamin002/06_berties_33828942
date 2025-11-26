// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    // saving data in database
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        //Store hashed passwords in your database
        if (err) {
            return next(err) 
        }               
        
        const first = req.body.first
        const last = req.body.last
        const email = req.body.email
        const username = req.body.username

        // Insert new user with hashed password
        let sql = "INSERT INTO users(first_name, last_name, email, username, hashedPassword) VALUES (?,?,?,?,?)"
        db.query(sql, [first,last,email,username,hashedPassword], function(err, result){
            if(err){
                return next(err)
            }

            final_result = ' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            final_result += ' Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword
            res.send(final_result);
        })
    })
                                                                                 
}); 

router.get('/list', redirectLogin, function(req,res,next) {
    let sqlquery = "SELECT username, first_name, last_name, email FROM users;"

    db.query(sqlquery, (err,result) => {
        if(err){
            return next(err)
        }
        res.render("userslist.ejs", {users:result})
    })
})

router.get('/login', function(req,res,next) {
    res.render('login.ejs', {shopData: {shopName: "Bertie's Books"}})
})

// Handle login form submission
router.post('/loggedin', function(req,res,next){
    const username = req.body.username
    const password = req.body.password
    const ip = req.ip

    const sql = "SELECT hashedPassword FROM users WHERE username = ?"
    const sql2 = "INSERT INTO login_audit (username, success, ip_address) VALUES (?, ?, ?)"

    db.query(sql, [username], function(err,results){
        if(err){
            return next(err)
        }

        // If username not found it should log the failure and send an error message
        if(results.length == 0){
            db.query(sql2, [username,0,ip], function(err2){
                if(err2){
                    console.log("Error inserting audit log:", err2)
                }
            })
            return res.send("Login failure: incorrect username and/or password")
        }

        const hashedPassword = results[0].hashedPassword

        // Compares the given password with the stored hashed password
        bcrypt.compare(password, hashedPassword, function(err,match){
            if(err){
                return next(err)
            }

            const success = match ? 1:0

            db.query(sql2, [username,success,ip], function(err2){
                if(err2){
                    console.log("Error insering audit log:", err2)
                }
            })

            // If log in successful    
            if(success){
                // Save user session here, when login is successful
                req.session.userId = req.body.username;                
                res.send("Login successful")
            }else {
                res.send("login failed: incorrect username and/or password")
            }
        })
    })
})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
        return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'/'+'>Home</a>'); //changed './' to just '/' 
    })
})

// adding access control to the audit as well
router.get("/audit", redirectLogin, function(req,res,next){
    const sql = "SELECT * FROM login_audit ORDER BY timestamp DESC"

    db.query(sql, function(err, results){
        if(err){
            return next(err)
        }
        res.render("audit.ejs", {entries:results})
    })
})


// Export the router object so index.js can access it
module.exports = router
