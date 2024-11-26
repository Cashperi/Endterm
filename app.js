const unsplashAPIKey = '-SjwEA3hqmM6skUM_-5-teNcC5-__-Nx3QTCRrq9Ks0';
const amadeusAPIKey = 'JVtqd5gwZe0oUVMpH9bUM4cmAoZuQgZm';
const amadeusAPISecret ='YOURGTUUWZ0WEtwl1nF7';
const foursquareAPIKey = 'fsq3r1UPyvDky+XzIj7hkbyIwJb8nOAg2SLXWfEjVEZ8fks='; 

async function searchDestination() {
  const destination = document.getElementById('destination').value;
  const response = await fetch(`https://api.unsplash.com/search/photos?query=${destination}&client_id=${unsplashAPIKey}`);
  const data = await response.json();
  displayImages(data.results);
}

function displayImages(images) {
  const imagesContainer = document.getElementById('destination-images');
  imagesContainer.innerHTML = '';
  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.urls.small;
    imagesContainer.appendChild(imgElement);
  });
}

async function searchFlights() {
  const departureCity = document.getElementById('departure').value;
  const destinationCity = document.getElementById('destination').value;

  // Get an access token from Amadeus API
  const authResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: amadeusAPIKey,
      client_secret: amadeusAPISecret,
    }),
  });

  const authData = await authResponse.json();
  const accessToken = authData.access_token;

  // Now search for flights using the token
  const flightResponse = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?origin=${departureCity}&destination=${destinationCity}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const flightData = await flightResponse.json();
  displayFlights(flightData.data);
}

function displayFlights(flights) {
  const flightsContainer = document.getElementById('flights');
  flightsContainer.innerHTML = '';
  flights.forEach(flight => {
    const flightElement = document.createElement('div');
    flightElement.innerHTML = `Price: $${flight.price.total}, Airlines: ${flight.validatingAirlineCodes.join(', ')}`;
    flightsContainer.appendChild(flightElement);
  });
}

async function searchLocalPlaces() {
  const destination = document.getElementById('destination').value;

  // Foursquare API Places Search request
  const response = await fetch(`https://api.foursquare.com/v2/venues/explore?near=${destination}&section=food&limit=10&client_id=${foursquareAPIKey}&client_secret=${foursquareAPIKey}&v=20231126`);
  const data = await response.json();
  displayLocalPlaces(data.response.groups[0].items);
}

function displayLocalPlaces(places) {
  const placesContainer = document.getElementById('local-places');
  placesContainer.innerHTML = '';
  places.forEach(place => {
    const placeElement = document.createElement('div');
    placeElement.innerHTML = `${place.venue.name} - Rating: ${place.venue.rating || 'N/A'} ⭐`;
    placesContainer.appendChild(placeElement);
  });
}
