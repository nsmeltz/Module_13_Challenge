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

// ---------- Create EQ layer overlay for the map ----------------
// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
};



// ------------------ Create the map object with center, zoom level and default layer ---------------------------
let map = L.map('mapid', {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [streets]
})

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// --------------------------------- Add GeoJSON data to the map ---------------------------

// Use this link to get the geojson data.
var earthquakesLast7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create earthquakes layer from geoJSON data
d3.json(earthquakesLast7days).then(function(data) {
  L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    
    // Style the circleMarkers
    style: styleInfo,

    // Add a popup with info about each circleMarker
    onEachFeature: function(feature,layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><hr>Location: " + feature.properties.place)
    }
  }).addTo(earthquakes);

  // Create a legend control object.
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];

    // Looping through our intervals to generate a label with a colored square for each interval.
   for (var i = 0; i < magnitudes.length; i++) {
     console.log(colors[i]);
     div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
  
    return div;
  };

  legend.addTo(map);

  // Add the earthquakes layer to the map
  earthquakes.addTo(map);
});

// ---------------------------- Style the plotted data ---------------------

// This function returns the style data for each of the earthquakes we plot on the map. 
// We pass the magnitude of the earthquake into two separate functions to calculate the color and radius.
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}