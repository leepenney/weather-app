const path = require("path");
const fetch = require('node-fetch');

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false
});

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function(request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { };
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/", function(request, reply) {
  // request.body.paramName <-- a form post example
  const functions = require(path.join(__dirname, 'src') + '/functions.js');
  const city = request.body.search_city;
  const url = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_APY_KEY}&q=${city}&aqi=no`;
  reply.type('application/json');
  new Promise((resolve, reject) => {
    let response = functions.requestWeatherDetails(city);
    resolve(response);
  }).then(
    response => {
      if (!('location' in response)) {
        throw new Error("location not valid");
      }
      new Promise((resolve, reject) => {
        let r = functions.requestWeatherImage(response.current.condition.text);
        resolve(r);
      }).then(r => {
        new Promise((resolve, reject) => {
          const { temp_c, wind_mph, cloud, condition: { text, icon } } = response.current;
          let renderedHtml = fastify.view('/src/pages/weather.hbs', { conditions: {
            'temp_c': Math.round(temp_c),
            'wind_mph': Math.round(wind_mph),
            'condition_text': text,
            'condition_icon': icon
          } });
          resolve(renderedHtml);
        }).then(
          renderedHtml => {
            reply.send({
              'success': {
                'image_url': r,
                'weather_html': JSON.stringify(renderedHtml)
              }
            });
          }
        );
      });
  }).catch(
    error => { 
      reply.send({ 'error': 'There was an error in your request' });
    }
  );
  
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, '0.0.0.0', function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
