// Add console.log to check if code is working
console.log("It's working!");

// ----------------- Add Tile Layers --------------------
// Create streets basemap tile layer
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
});

// Create satellite streets basemap tile layer
let satellitestreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a baseMaps variable that holds both maps.
let baseMaps = {
  "Street": streets,
  "Satellite Streets": satellitestreets
};

// ------------------ Create the map object with center, zoom level and default layer ---------------------------
let map = L.map('mapid', {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [satellitestreets]
})

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);


// --------------------------------- Add GeoJSON data to the map ---------------------------

// Use this link to get the geojson data.
var earthquakesLast7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Plot markers and popup for each airport
d3.json(earthquakesLast7days).then(function(data) {
  console.log(data);
  L.geoJSON(data).addTo(map);
});
