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
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create dark basemap tile layer
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// ------------------ Create the map object with center, zoom level and default layer ---------------------------
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// ------------- Create a base layer that holds all maps --------------
let baseMaps = {
  "Streets": streets,
  "Satellite Streets": satelliteStreets,
  "Dark": dark
};


// ---------- Create data overlays for the map ----------------
// 1. Add a 2nd layer group for the tectonic plate data.
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();
let majorEQ = new L.LayerGroup();

// 2. Add a reference to the tectonic plates group to the overlays object.
let overlays = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates,
  "Major Earthquakes": majorEQ
};

// ----------------- Layer Control -------------------
L.control.layers(baseMaps, overlays).addTo(map);

// --------------------------------- Add GeoJSON data to the map ---------------------------
// Create earthquakes layer from geoJSON data
let earthquakesLast7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(earthquakesLast7days).then(function(data) {
  L.geoJSON(data, {
    // Plot a circleMarker for each entry 
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style the circleMarkers
    style: styleInfo,
    // Add a popup with info about each circleMarker
    onEachFeature: function(feature,layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><hr>Location: " + feature.properties.place)
    }
  // Add to the overlay   
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

  // Add legend to the map
  legend.addTo(map);

  // Add the earthquakes overlay to the map
  earthquakes.addTo(map);

});

// Create Tectonic Plates layer from geoJSON data
let plateBoundaries = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(plateBoundaries).then(function(data) {

  L.geoJSON(data, {
    // Style the LineString
    weight: 2,
    color: "black"

  // Add to the overlay  
  }).addTo(tectonicPlates)

});

// Create Major Earthquakes layer from geoJSON data
var majorEQlast7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

d3.json(majorEQlast7days).then(function(data) {
  L.geoJSON(data, {
    // Plot a circleMarker for each entry 
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style the circleMarkers
    style: styleMajor,

    // Add a popup with info about each circleMarker
    onEachFeature: function(feature,layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><hr>Location: " + feature.properties.place)
    }
  // Add to the overlay   
  }).addTo(majorEQ);

  // Create a legend control object.
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')
      const magnitudes = [ 0, 5, 6];
      const colors = ["MediumPurple","DeepPink","red"];
    // Looping through our intervals to generate a label with a colored square for each interval.
   for (var i = 0; i < magnitudes.length; i++) {
     console.log(colors[i]);
     div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to the map
  legend.addTo(map);

});


// ---------------------------- Style the plotted data ---------------------

// --- Style Earthquakes layer ---
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

// Radius as function of magnitude
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

// Color as function of magnitude
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

// --- Major EQ styling ---
function styleMajor(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColorMajor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}


// Najor EQ Color as function of magnitude
function getColorMajor(magnitude) {
  if (magnitude > 6) {
    return "red";
  }
  if (magnitude >= 5) {
    return "DeepPink";
  }
  if (magnitude < 5) {
    return "MediumPurple";
  }
}