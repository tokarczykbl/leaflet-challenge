//Saving query URL to variable, URL from USGS that gathers all earthquakes greater than 2.5 magnitude for past month
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

//Querying GeoJSON data
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

// // Creating the map object
// let myMap = L.map("map", {
//     center:  [37.09, -95.71],
//     zoom: 5,
// });

// // Adding the tile layer
// let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

// // https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
// let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
//         maxZoom: 20,
//         subdomains:['mt0','mt1','mt2','mt3']
// }).addTo(myMap);


function markerSize(mag) {
    return Math.sqrt(mag) * 30000;
};

// function markerSize(mag) {
//     return mag * (10000 * 2.5);
// };

// function markerSize(mag) {
//     return Math.pow(mag, 2) * 5000;
// };

// function markerSize(mag) {
//     return Math.log(mag + 1) * 50000;
// };


// Function to adjust size of marker based off earthquake magnitude
// function markerSize(mag) {
//     return (mag ** 2) * 4000; // Example polynomial function
// }

// Creating function for setting colors for depth
function markerColor(depth) {
    if (depth <= 10) return "#66FF66"; //Light Green
    else if (depth <= 30) return "#FFFF00"; //Yellow
    else if (depth <= 50) return "#FFDAB9"; //Light Orange
    else if (depth <= 70) return " #FFA500"; //Orange
    else if (depth <= 90) return "#FF6347" ; //Reddish Orange
    else return "#FF0000"; //Red
};

// Creating function for creating circle markers based on coordinates, color and size operate off markerSize and markerColor functions
function createFeatures(earthquakeData) {
    for (let i = 0; i < earthquakeData.length; i++) {
        let coordinates = earthquakeData[i].geometry.coordinates;
        let magnitude = earthquakeData[i].properties.mag;
        
        L.circle([coordinates[1], coordinates[0]], {
            color: 'black',
            weight: '1',
            fillColor: markerColor(coordinates[2]),
            fillOpacity: 0.75,
            radius: markerSize(magnitude)
        }).addTo(myMap);
    }
}

// Add legend to map (https://leafletjs.com/examples/choropleth/)
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our depth intervals and generate a label with a colored square for each interval 
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
        return div;
};
legend.addTo(myMap);



function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }


  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  } 