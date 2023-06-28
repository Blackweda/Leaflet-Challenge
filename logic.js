// https://utoronto.bootcampcontent.com/utoronto-bootcamp/UTOR-VIRT-DATA-PT-02-2023-U-LOLC/-/tree/main/Unit%2015%20-%20Leaflet/Class%20Activities/Class%201/10-Stu_GeoJson
// https://utoronto.bootcampcontent.com/utoronto-bootcamp/UTOR-VIRT-DATA-PT-02-2023-U-LOLC/-/blob/main/Unit%2015%20-%20Leaflet/Class%20Activities/Class%201/09-Stu_City_Population_Layers/Solved/logic.js
// https://utoronto.bootcampcontent.com/utoronto-bootcamp/UTOR-VIRT-DATA-PT-02-2023-U-LOLC/-/blob/main/Unit%2015%20-%20Leaflet/Class%20Activities/Class%202/02-Evr_HydrantsHeatmap/Solved/static/js/heatmap.js
// Store our API endpoint as queryUrl.

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


let earthquakeCircles = []
let earthquakeCoords = []
let earthquakeMagnitudes = []
let earthquakeDepths = []


// Define a map object.
let myMap = L.map("map", {
  center: [39.00, 34.00],
  zoom: 5
});

// Adding the tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// A function to determine the circle marker size based on the magnitude
function circleSize(magnitude) {
  return Math.sqrt(magnitude) * 25000;
}

// Conditionals for earthquake depth color
function markerColor(depth) {
  if (depth > 90) {
    return '#FF0000'
  }
  else if (depth <= 90 && depth > 70) {
    return '#FF6666'
  }
  else if (depth <= 70 && depth > 50) {
    return '#FF8000'
  }
  else if (depth <= 50 && depth > 30) {
    return '#FFB266'
  }
  else if (depth <= 30 && depth > 10) {
    return '#B2FF66'
  }
  else if (depth <= 10) {
    return '#00FF00'
  }
}


d3.json(queryUrl).then(function(response) {

  // gather all information contained in features array
  features = response.features;
  
  for (let i = 0; i < features.length; i++) {

    let coords = features[i].geometry
        
    if(coords){
      earthquakeCoords.push([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]) 
      earthquakeDepths.push(features[i].geometry.coordinates[2])
      earthquakeMagnitudes.push(features[i].properties.mag)
            
      // https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array
      console.log("coords-pushed" + earthquakeCoords.at(-1))
      console.log("depths-pushed" + earthquakeDepths.at(-1))
      console.log("mags-pushed" + earthquakeMagnitudes.at(-1))
    

      L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: markerColor(features[i].geometry.coordinates[2]),
        fillColor: markerColor(features[i].geometry.coordinates[2]),
        radius: circleSize(features[i].properties.mag)
      }).bindPopup(`<h3>${features[i].properties.place}</h3>` +
        `<h4>[${features[i].geometry.coordinates[1]},${features[i].geometry.coordinates[0]}]</h4>` +
        `<h4>Earthquake Depth:` +`${features[i].geometry.coordinates[2]}</h4><h4>Earthquake Magnitude:` +
        `${features[i].properties.mag}</h4>`).addTo(myMap);
    }        
  
  
  }  


  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let colors = ["#00FF00", "#B2FF66", "#FFB266", "#FF8000", "#FF6666", "#FF0000"];
    let labels = ["-10-10","10-30","30-50","50-70","70-90","90+"];

    div.innerHTML = "<div>" + 
      "<h1>Depths</h1>" +
      "<ul>" + "<li style=margin-right:10px;>" + labels[0] + "</li>" + "<li style=\"background-color: " + colors[0] + "\"></li></ul>" +
      "<ul>" + "<li style=margin-right:10px;>" + labels[1] + "</li>" + "<li style=\"background-color: " + colors[1] + "\"></li></ul>" +
      "<ul>" + "<li style=margin-right:10px;>" + labels[2] + "</li>" + "<li style=\"background-color: " + colors[2] + "\"></li></ul>" +
      "<ul>" + "<li style=margin-right:10px;>" + labels[3] + "</li>" + "<li style=\"background-color: " + colors[3] + "\"></li></ul>" +
      "<ul>" + "<li style=margin-right:10px;>" + labels[4] + "</li>" + "<li style=\"background-color: " + colors[4] + "\"></li></ul>" +
      "<ul>" + "<li style=margin-right:10px;>" + labels[5] + "</li>" + "<li style=\"background-color: " + colors[5] + "\"></li></ul>"       
      "</div>";

    
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

});
