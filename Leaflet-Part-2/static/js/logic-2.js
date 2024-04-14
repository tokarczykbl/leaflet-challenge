//Saving query URL to variable, URL from USGS that gathers all earthquakes greater than 2.5 magnitude for past month
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

//Querying GeoJSON data
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function markerSize(mag) {
    return Math.sqrt(mag) * 30000;
};

// Creating function for setting colors for depth
function markerColor(depth) {
    if (depth <= 10) return "#66FF66"; //Light Green
    else if (depth <= 30) return "#FFFF00"; //Yellow
    else if (depth <= 50) return "#FFDAB9"; //Light Orange
    else if (depth <= 70) return "#FFA500"; //Orange
    else if (depth <= 90) return "#FF6347"; //Reddish Orange
    else return "#FF0000"; //Red
};

// Creating function for creating circle markers based on coordinates, color and size operate off markerSize and markerColor functions
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        let coordinates = feature.geometry.coordinates;
        let magnitude = feature.properties.mag;
        let location = feature.properties.place;
        let time = feature.properties.time;
        let felt = feature.properties.felt;
        let sig = feature.properties.sig;

        let circle = L.circle([coordinates[1], coordinates[0]], {
            color: 'black',
            weight: '1',
            fillColor: markerColor(coordinates[2]),
            fillOpacity: 0.75,
            radius: markerSize(magnitude)
        });

        circle.bindPopup(`<b>Location:</b> ${location}<hr><b>Significance:</b> ${sig}<hr><b>Magnitude:</b> ${magnitude}<hr><b>Time:</b> ${new Date(time)}<hr><b># of Reports:</b> ${felt}`);

        circle.addTo(earthquakes); // Add circle to the earthquakes layer
    }

    let earthquakes = L.layerGroup(); // Create a layer group to hold the circle markers

    earthquakeData.forEach(function(feature) {
        onEachFeature(feature, earthquakes); // Process each feature and add it to the earthquakes layer
    });

    createMap(earthquakes); // Call createMap after all features have been processed
};

function createMap(earthquakes) {

    // Creating base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let Stadia_AlidadeSatellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
        attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street": street,
        "Topographic": topo,
        "Satelite": Stadia_AlidadeSatellite
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        "Earthquakes": earthquakes,
        // "Tectonic Plates": tectonic
    };

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

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
}

// Add legend to map (https://leafletjs.com/examples/choropleth/)
