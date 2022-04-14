window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [-3149887.7967890906, 4647089.276145274],
      zoom: 11.5,
      maxZoom: 20,
      minZoom: 2,
    }),
    target: "js-map",
  });

  // Basemap Layers
  const openStreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: false,
    title: "OSMStandard",
  });

  const openStreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    }),
    visible: false,
    title: "OSMHumanitarian",
  });

  const stamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    visible: true,
    title: "StamenTerrain",
  });

  // Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain],
  });
  map.addLayer(baseLayerGroup);

  // Layer Switcher Logic for Basemaps
  const baseLayerElements = document.querySelectorAll(
    ".sidebar > input[type=radio]"
  );
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener("change", function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerTitle = element.get("title");
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });
  }

  // Vector Layers
  const fillStyle = new ol.style.Fill({
    color: [255, 183, 43, 0.5],
  });

  const strokeStyle = new ol.style.Stroke({
    color: [6, 44, 48, 1],
    width: 1.2,
  });

  const circleStyle = new ol.style.Circle({
    fill: new ol.style.Fill({
      color: [5, 89, 91, 0.5],
    }),
    radius: 5,
    stroke: strokeStyle,
  });

  const ForagingLocationsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "./data/vector_data/foraginglocations.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    title: "ForagingLocationsGeoJSON",
    style: new ol.style.Style({
      fill: fillStyle,
      stroke: strokeStyle,
      image: circleStyle,
    }),
  });
  map.addLayer(ForagingLocationsGeoJSON);

  // Vector Feature Popup Logic //
  const overlayContainerElement = document.querySelector(".overlay-container");

  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });
  map.addOverlay(overlayLayer);
  const overlayFeaturePlant = document.getElementById("feature-plant");
  const overlayFeatureDateOfVisit = document.getElementById(
    "feature-date-of-visit"
  );
  const overlayFeatureDevelopmentalStage = document.getElementById(
    "feature-developmental-stage"
  );
  const overlayFeatureOwnership = document.getElementById("feature-ownership");
  map.on("click", function (e) {
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
      let clickedCoordinate = e.coordinate;
      let clickedFeaturePlant = feature.get("plant");
      let clickedFeatureDateOfVisit = feature.get("dateofvisit");
      let clickedFeatureDevelopmentalStage = feature.get("developmentalstage");
      let clickedFeatureOwnership = feature.get("ownership");
      overlayLayer.setPosition(clickedCoordinate);
      overlayFeaturePlant.innerHTML = clickedFeaturePlant;
      overlayFeatureDevelopmentalStage.innerHTML =
        clickedFeatureDevelopmentalStage;
      overlayFeatureDateOfVisit.innerHTML = clickedFeatureDateOfVisit;
      overlayFeatureOwnership.innerHTML = clickedFeatureOwnership;
    });
  });
}
