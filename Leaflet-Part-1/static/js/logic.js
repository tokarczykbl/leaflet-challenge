//Saving query URL to variable, URL from USGS that gathers all earthquakes greater than 2.5 magnitude for past month
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

//Querying GeoJSON data
d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

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
};

// Creating function for setting colors for depth
function markerColor(depth) {
    if (depth <= 10) return "#66FF66"; //Light Green
    else if (depth <= 30) return "#FFFF00"; //Yellow
    else if (depth <= 50) return "#FFDAB9"; //Light Orange
    else if (depth <= 70) return "#FFA500"; //Orange
    else if (depth <= 90) return "#FF6347" ; //Reddish Orange
    else return "#FF0000"; //Red
};

// Creating function for creating circle markers based on coordinates, color and size operate off markerSize and markerColor functions
function createFeatures(earthquakeData) {
    for (let i = 0; i < earthquakeData.length; i++) {
        let coordinates = earthquakeData[i].geometry.coordinates;
        let magnitude = earthquakeData[i].properties.mag;
        let location = earthquakeData[i].properties.place;
        let time = earthquakeData[i].properties.time;
        let felt = earthquakeData[i].properties.felt;
        let sig = earthquakeData[i].properties.sig;
        
        let circle = L.circle([coordinates[1], coordinates[0]], {
            color: 'black',
            weight: '1',
            fillColor: markerColor(coordinates[2]),
            fillOpacity: 0.75,
            radius: markerSize(magnitude)
        }).addTo(myMap);

        circle.bindPopup(`<h3>Location: ${location}</h3><hr><h3>Significance: ${sig}</h3><hr><h3>Magnitude: ${magnitude}</h3><hr><h3>Time: ${new Date(time)}</h3><hr><h3># of Reports: ${felt}</h3>`);
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