
function handleFormSubmit(frm) {
  // check we have a city name
  if (frm.city.value.length >= 2) {
    // if so, assign it
    let city_name = frm.city.value;
    // make request to Weather API and parse response
    requestWeatherDataForCity(city_name, displayResponse);
  } else {
    displayResponse('error', "Please enter a valid city name");
  }  
  return false;
}

function displayResponse(type, content) {
  let msg = '';
  let img;
  if (type == 'error') {
    msg = `<p class="error">${content.error}</p>`;
  } else {
    msg = JSON.parse(content.success.weather_html);
    img = content.success.image_url;
  }
  document.querySelector('.response').innerHTML = msg;
  if (img) {
    document.querySelector('body').style.backgroundImage = `url('${img}')`;
  }
}

function requestWeatherDataForCity(city_name, callback) {
  fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"search_city": city_name})
      })
      .then(response => response.json())
      .then(data => {
          let responseType = ('error' in data) ? 'error' : 'success';
          callback(responseType, data);
      })
      .catch((error) => {
        displayResponse('error', `Error ${error}`);
      });
}