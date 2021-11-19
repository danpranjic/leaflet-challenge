var myMap = L.map("map", {
    center : [40.7128, -75.0059],
    zoom: 4


})



L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "©️ <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ©️ <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  function getColor(depth)
  {
      switch(true){
          case depth > 300:
              return "red";
          case depth > 70:
              return "orange";
          default:
              return "yellow";

      }
  }


  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
      //console.log(data)

      L.geoJson(data, {
          pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                  radius: (feature.properties.mag)*(feature.properties.mag) ,
                  color: getColor(feature.geometry.coordinates[2]),
                  fillColor: getColor(feature.geometry.coordinates[2]),
                  fillOpacity: ".5"
              })
          },
          onEachFeature : (feature, layer) => {
              layer.bindPopup(
                  "Magnitude: " + feature.properties.mag
                  + "<br>Depth: " + feature.geometry.coordinates[2]
                  + "<br>Location: " + feature.properties.place
              )
          }
      }).addTo(myMap)

})

var legend = L.control({
    position: "bottomleft"
  });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
      var depth = [0, 70, 300];
      var colors = [
        "yellow",
        "orange",
        "red"
      ];

      div.innerHTML = "<h2>Depths</h2>"

      for (var i = 0; i < depth.length; i++) {
        div.innerHTML += "<i style='background-color: " + colors[i] + "'> &nbsp; &nbsp; </i> "
        + depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
      }
      return div;
    };
    legend.addTo(myMap)
