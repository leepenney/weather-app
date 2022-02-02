# A Sample Weather App

This is a small app that allows you to search for a city to see what the current weather conditions are at that location.

It will then display the conditions, wind speed and temperature as well as adding a background image using the conditions as a keyword.

# Live Site

The live example can be found on Glitch at [aerial-enshrined-ankylosaurus.glitch.me](https://aerial-enshrined-ankylosaurus.glitch.me/)

(note that is may take a few seconds to spool up)

# Data Sources

The weather details are retrieved from the [Weather API](https://www.weatherapi.com/)'s... API

The images are retrieved from [Unspash](https://unsplash.com/)'s API

# Technologies

## Frontend

The frontend is simply:

* HTML
* CSS
* Vanilla JS

## Backend

The backend (hosted on Glitch) consists of:

* Nodejs
* Fastify (server)
* Handlebars (templates)

# Methodology

1. When the form is submitted, it makes an Ajax post to the nodejs server endpoint
2. A function makes an Ajax request to the Weather API using the city name to get the conditions
3. The conditions are returned and the text extracted
4. This text is then supplied in another Ajax request to the Unspash API to get 10 matching images
5. An image is picked at random and the URL returned
6. The weather conditions are rendered into HTML using a Handlebars template
7. The URL and the HTML are returned to the frontend
8. The URL is then used to update the background of the page
9. The conditions HTML is appended to the form
