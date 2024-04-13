let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

// Store 'URL for all earthquakes greater than 2.5 magnitude for past 30 days' API
// Creating the map object
let myMap = L.map("map", {
    center:  [37.09, -95.71],
    zoom: 5,
});

// Adding the tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(mag) {
    return Math.sqrt(mag) * 30000;
}

function createFeatures(earthquakeData) {
    for (let i = 0; i < earthquakeData.length; i++) {
        let coordinates = earthquakeData[i].geometry.coordinates;
        let magnitude = earthquakeData[i].properties.mag;

        L.circle([coordinates[1], coordinates[0]], {
            color: "green",
            fillColor: "green",
            fillOpacity: 0.75,
            radius: markerSize(magnitude)
        }).addTo(myMap);
    }
}

// Create a circle, and pass in some initial options.




// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// d3.json(queryUrl).then(function (data) {
//     createFeatures(data.features);
// });

// function markerSize(mag) {
//     return Math.sqrt(features.properties.mag) * 50;
// }

// function depthColor(depth) {
//     if (depth <= 10) return "#66FF66"; //Light Green
//     else if (depth <= 30) return "#ADFF2F"; //Yellow Green
//     else if (depth <= 50) return "#FFFF00"; Yellow
//     else if (depth <= 70) return "#FFA500"; //Orange
//     else if (depth <= 90) return "#FF6347" ; //Reddish Orange
//     else return "#FF0000"; //Red
// };




// function createFeatures(earthquakeData) {

//     function onEachFeature(feature, layer) {
//       layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//     }
  
//     // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//     // Run the onEachFeature function once for each piece of data in the array.
//     let earthquakes = L.geoJSON(earthquakeData, {
//       onEachFeature: onEachFeature
//     });
  
//     // Send our earthquakes layer to the createMap function/
//     createMap(earthquakes);
//   }


//   function createMap(earthquakes) {
  
//     // Create the base layers.
//     let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     })
  
//     let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//       attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     });
  
//     // Create a baseMaps object.
//     let baseMaps = {
//       "Street Map": street,
//       "Topographic Map": topo
//     };
  
//     // Create an overlay object to hold our overlay.
//     let overlayMaps = {
//       Earthquakes: earthquakes
//     };
  
//     // Create our map, giving it the streetmap and earthquakes layers to display on load.
//     let myMap = L.map("map", {
//       center: [
//         37.09, -95.71
//       ],
//       zoom: 5,
//       layers: [street, earthquakes]
//     });
  
//     // Create a layer control.
//     // Pass it our baseMaps and overlayMaps.
//     // Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(myMap);
  
//   } 