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
    .then((d) => { updateSelectedLots(d.features); })

  console.log(SQL);
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
  getLotsInPolygon(d.features[0].geometry);
});
