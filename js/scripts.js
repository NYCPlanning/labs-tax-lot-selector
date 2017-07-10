mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nbnljIiwiYSI6ImNpczF1MXdrdjA4MXcycXA4ZGtyN2x5YXIifQ.3HGyME8tBs6BnljzUVIt4Q';
/* eslint-disable */
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', //hosted style id
    center: [-73.98, 40.750768], // starting position
    zoom: 16 // starting zoom
});

const selectedLots = {
  type: 'FeatureCollection',
  features: [],
};

const updateSelectedLots = (features) => {
  features.forEach((feature) => {
    const { type, geometry, properties } = feature;

    // if the lot is not in the selection, push it, if it is, remove it
    const inSelection = selectedLots.features.find(lot => lot.properties.bbl === properties.bbl);

    if (inSelection === undefined) {
      selectedLots.features.push({
        type,
        geometry,
        properties,
      });
    } else {
      selectedLots.features = selectedLots.features.filter(lot => lot.properties.bbl !== properties.bbl);
    }
  });

  map.getSource('selectedLots').setData(selectedLots);
};

map.on('load', function () {

  var mapConfig = {
    version: '1.3.0',
    layers: [{
      type: 'mapnik',
      options: {
        cartocss_version: '2.1.1',
        cartocss: '#layer { polygon-fill: #FFF; }',
        sql: 'SELECT cartodb_id, the_geom_webmercator, bbl, lot FROM support_mappluto',
      },
    }],
  }

  Carto.getVectorTileTemplate(mapConfig, {
    carto_domain: 'cartoprod.capitalplanning.nyc',
    carto_user: 'cpp',
  }).then((tileTemplate) => {
    map.addSource('pluto', {
      type: 'vector',
      tiles: [tileTemplate],
    });

    map.addSource('selectedLots', {
       type: 'geojson',
       data: selectedLots
     });

    map.addLayer(layerConfig.pluto, 'waterway');
    map.addLayer(layerConfig.plutoLabels);
    map.addLayer(layerConfig.selectedLots);


    // on click
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['pluto'] });
      const uniqueFeatures = _.uniq(features, feature => feature.properties.bbl);
      if(uniqueFeatures.length > 0) updateSelectedLots(uniqueFeatures);
    });

    map.on('mousemove', (e) => {

      const features = map.queryRenderedFeatures(e.point, { layers: ['pluto'] });
      map.getCanvas().style.cursor = (features && features.length > 0) ? 'pointer' : '';
    })
  });
});

var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
});
map.addControl(draw);
