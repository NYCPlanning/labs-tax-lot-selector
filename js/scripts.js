const cartoOptions = {
  carto_domain: 'cartoprod.capitalplanning.nyc',
  carto_user: 'cpp',
};

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nbnljIiwiYSI6ImNpczF1MXdrdjA4MXcycXA4ZGtyN2x5YXIifQ.3HGyME8tBs6BnljzUVIt4Q';
/* eslint-disable */
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', //hosted style id
    center: [-73.98, 40.750768], // starting position
    zoom: 16 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const selectedLots = {
  type: 'FeatureCollection',
  features: [],
};

const setCount = (selectedLots) => {
  const count = selectedLots.features.length;
  $('#selected-count').text(count.toString());

  if (count > 0) {
    $('#csv-download-button').removeClass('disabled');
  } else {
    $('#csv-download-button').addClass('disabled');
  }
}

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

  // update the underlying data for the selection layer
  map.getSource('selectedLots').setData(selectedLots);

  // update the count
  setCount(selectedLots);
};

const getLotsInPolygon = (polygon) => {
  const SQL = `
    SELECT *
    FROM support_mappluto
    WHERE ST_Intersects(
			ST_SetSRID(
        ST_geomFromGeojson('${JSON.stringify(polygon)}'),
        4326
      ),
			the_geom
    )
  `;

  Carto.sql(SQL, cartoOptions)
    .then((d) => { updateSelectedLots(d.features); });

  console.log(SQL);
}

downloadCSV = () => {
  // get an array of bbls to use in a query
  const selectedLotsArray = selectedLots.features.map(lot => lot.properties.bbl);
  const selectedLotsString = selectedLotsArray.join(',');
  console.log(selectedLotsString);

  const SQL = `
    SELECT borocode, block, lot, bbl, address
    FROM support_mappluto
    WHERE bbl IN (${selectedLotsString})
  `;

  const apiCall = `https://${cartoOptions.carto_domain}/user/${cartoOptions.carto_user}/api/v2/sql?q=${SQL}&format=csv&filename=selected_lots`;
  console.log(apiCall)

  window.open(apiCall, 'Download');

}

map.on('load', function () {

  const mapConfig = {
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

  Carto.getVectorTileTemplate(mapConfig, cartoOptions).then((tileTemplate) => {
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

const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        rectangle: true,
        polygon: true,
        trash: true
    }
});

map.addControl(draw);

map.on('draw.create', (d) => {
  // remove the polygon, then pass its geometry on
  draw.deleteAll();
  getLotsInPolygon(d.features[0].geometry);
});

$('#csv-download-button').on('click', downloadCSV)
