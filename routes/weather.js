const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/now', (req, res, next) => {
    let apiKey = process.env.API_KEY // Use env var 
    let city = 'london'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, (err, response, body) => {
        if (err) {
            next(err)
        } else {
            var weather = JSON.parse(body)
            var wmsg = 'It is '+ weather.main.temp + ' degrees in '+ weather.name +'! <br> The humidity now is: ' + 
            weather.main.humidity;
            res.send (wmsg);
        }
    })
})

router.get('/', (req, res) => {
    res.render('weatherform.ejs')
});

router.post('/', (req, res, next) => {
    let city = req.body.city;
    let apiKey = process.env.API_KEY;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, (err, response, body) => {
        if (err) return next(err);

        let data;
        try {
            data = JSON.parse(body)
        } catch (e) {
            return res.send("Invalid API response")
        }

        if (!data || !data.main) {
            return res.send("City not found")
        }

        res.render('weatherresult.ejs', {
            name: data.name,
            temp: data.main.temp,
            feels: data.main.feels_like,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            desc: data.weather[0].description,
            clouds: data.clouds.all
        })
    })
})




module.exports = router
