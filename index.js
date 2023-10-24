const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch-cjs').default;
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const key ='f3ac8664f3e78f495cf59c02f3b19294'
let city ='Tartu'

const getWeatherDataPromise = (url) => {
	return new Promise((resolve, reject) => {
		fetch(url)
		.then(responce => {
			return responce.json()
		})
		.then((data) => {
		let description = data.weather[0].description
		let city = data.name
		let temp = Math.round(parseFloat(data.main.temp)-273.15)
		let result = {
			description: description,
			city: city,
			temp: temp,
			error: null
		}
		resolve(result)
	})
		.catch(error => {
			reject(error)
		})
	})
}

app.all('/', function(req, res) {
  let city;

  if (req.method === 'GET') {
    city = 'Tartu';
  }

  if (req.method === 'POST') {
    const enteredCity = req.body.cityname;

    // If the user enters nothing or only whitespace, display the following error
    if (!enteredCity || enteredCity.trim() === '') {
      res.render('index', { error: 'Enter a correct city name.' });
      return;
    }

    city = enteredCity;
  }

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
  getWeatherDataPromise(url)
    .then(data => {
      res.render('index', data);
    })
    .catch(error => {
    // Display an error message if there's a problem fetching the data
    res.render('index', { error: 'Problem with getting data, try again' });
    });
});

app.listen(3003, () => {
	console.log('Server is running at http://localhost:3003');
});