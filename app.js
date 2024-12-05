const unsplashAPIKey = '-SjwEA3hqmM6skUM_-5-teNcC5-__-Nx3QTCRrq9Ks0';
const amadeusAPIKey = 'JVtqd5gwZe0oUVMpH9bUM4cmAoZuQgZm';
const amadeusAPISecret = 'YOURGTUUWZ0WEtwl1nF7';
const foursquareAPIKey = 'fsq3r1UPyvDky+XzIj7hkbyIwJb8nOAg2SLXWfEjVEZ8fks=';

async function searchDestination() {
  try {
    const destination = document.getElementById('destination').value.trim();
    if (!destination) {
      alert('Please enter a destination.');
      return;
    }
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${destination}&client_id=${unsplashAPIKey}`);
    if (!response.ok) throw new Error('Failed to fetch images.');
    const data = await response.json();
    displayImages(data.results);
  } catch (error) {
    console.error(error);
    alert('Error fetching destination images.');
  }
}

function displayImages(images) {
  const imagesContainer = document.getElementById('destination-images');
  imagesContainer.innerHTML = '';
  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.urls.small;
    imgElement.alt = image.alt_description || 'Destination Image';
    imagesContainer.appendChild(imgElement);
  });
}

async function searchFlights() {
  try {
    const departureCity = document.getElementById('departure').value.trim();
    const destinationCity = document.getElementById('destination').value.trim();

    if (!departureCity || !destinationCity) {
      alert('Please enter both departure and destination cities.');
      return;
    }

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

    if (!authResponse.ok) throw new Error('Failed to authenticate with Amadeus API.');
    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const flightResponse = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${departureCity}&destinationLocationCode=${destinationCity}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!flightResponse.ok) throw new Error('Failed to fetch flight data.');
    const flightData = await flightResponse.json();
    displayFlights(flightData.data || []);
  } catch (error) {
    console.error(error);
    alert('Error fetching flight data.');
  }
}

function displayFlights(flights) {
  const flightsContainer = document.getElementById('flights');
  flightsContainer.innerHTML = '';
  if (flights.length === 0) {
    flightsContainer.innerHTML = '<p>No flights found.</p>';
    return;
  }
  flights.forEach(flight => {
    const flightElement = document.createElement('div');
    flightElement.innerHTML = `Price: $${flight.price.total}, Airlines: ${flight.validatingAirlineCodes.join(', ')}`;
    flightsContainer.appendChild(flightElement);
  });
}

async function searchLocalPlaces() {
  try {
    const destination = document.getElementById('destination').value.trim();
    if (!destination) {
      alert('Please enter a destination.');
      return;
    }

    const response = await fetch(`https://api.foursquare.com/v3/places/search?query=restaurants&near=${destination}&limit=10`, {
      headers: {
        Authorization: `Bearer ${foursquareAPIKey}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch local places.');
    const data = await response.json();
    displayLocalPlaces(data.results || []);
  } catch (error) {
    console.error(error);
    alert('Error fetching local places.');
  }
}

function displayLocalPlaces(places) {
  const placesContainer = document.getElementById('local-places');
  placesContainer.innerHTML = '';
  if (places.length === 0) {
    placesContainer.innerHTML = '<p>No local places found.</p>';
    return;
  }
  places.forEach(place => {
    const placeElement = document.createElement('div');
    placeElement.innerHTML = `<strong>${place.name}</strong><br>Rating: ${place.rating || 'N/A'} ⭐`;
    placesContainer.appendChild(placeElement);
  });
}
