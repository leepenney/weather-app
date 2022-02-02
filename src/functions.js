const fetch = require('node-fetch');
//const createApi = require('unsplash-js');

let methods = {
  apiRequest: async function(url) {
    return await fetch(url)
      .then(res => res.json()) // expecting a json response
      .then(json => {
        return json;
    })
    .catch(err => {
        return {"error":`There was an error: ${err}`};
    });
  },
  requestWeatherDetails: async function(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_APY_KEY}&q=${city}&aqi=no`;
    return await methods.apiRequest(url);
  },
  requestWeatherImage: async function(conditions) {
    let url = `https://api.unsplash.com/search/photos`
    url += `?page=1&query=${conditions} sky`;
    url += `&per_page=10&orientation=landscape`;
    url += `&client_id=${process.env.UNSPLASH_KEY}`;
    let images = await methods.apiRequest(url);
    const selectedImage = Math.floor(Math.random() * (images.results.length-1));
    return images.results[selectedImage].urls.regular;
  }
}
module.exports = methods;