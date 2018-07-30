window.downloadMode = 'paperless';

const cartoOptions = {
  carto_domain: 'planninglabs.carto.com',
  carto_user: 'data',
};

/* eslint-disable */
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: '//raw.githubusercontent.com/NYCPlanning/labs-gl-style/master/data/style.json', //hosted style id
    center: [-73.98, 40.750768],
    zoom: 16,
    hash: true,
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [-74.292297, 40.477248, -73.618011, 40.958123],
}), 'top-left');

const selectedLots = {
  type: 'FeatureCollection',
  features: [],
};

const updateUI = (selectedLots) => {

  // update the underlying data for the selection layer
  map.getSource('selectedLots').setData(selectedLots);

  // update the count in the sidebar
  const count = selectedLots.features.length;
  $('#selected-count').text(count.toString());

  if (count > 0) {
    $('a[id$="-button"]').removeClass('disabled');
  } else {
    $('a[id$="-button"]').addClass('disabled');
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

  updateUI(selectedLots);
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
}

const download = (type) => {
  // get an array of bbls to use in a query
  const selectedLotsArray = selectedLots.features.map(lot => lot.properties.bbl);
  if (selectedLotsArray.length > 0) {
    const selectedLotsString = selectedLotsArray.join(',');

  const paperlistFields = ['borocode', 'block', 'lot', 'bbl', 'address', "'' AS \"Project\""];
  const allFields = ['borough','block','lot','cd','ct2010','cb2010','schooldist','council','zipcode','firecomp','policeprct','healtharea','sanitboro','sanitdistr','sanitsub','address','zonedist1','zonedist2','zonedist3','zonedist4','overlay1','overlay2','spdist1','spdist2','spdist3','ltdheight','splitzone','bldgclass','landuse','easements','ownertype','ownername','lotarea','bldgarea','comarea','resarea','officearea','retailarea','garagearea','strgearea','factryarea','otherarea','areasource','numbldgs','numfloors','unitsres','unitstotal','lotfront','lotdepth','bldgfront','bldgdepth','ext','proxcode','irrlotcode','lottype','bsmtcode','assessland','assesstot','exemptland','exempttot','yearbuilt','yearalter1','yearalter2','histdist','landmark','builtfar','residfar','commfar','facilfar','borocode','bbl','condono','tract2010','xcoord','ycoord','zonemap','zmcode','sanborn','taxmap','edesignum','appbbl','appdate','plutomapid','version','mappluto_f','shape_leng','shape_area'];

  let additionalFields = '';

  if (window.downloadMode === 'paperless') {
    additionalFields = paperlistFields.join(',');
  }

  if (window.downloadMode === 'bbls') {
    additionalFields = 'bbl';
  }

  if (window.downloadMode === 'all') {
    additionalFields = allFields.join(',');
  }

  const fields = `
    ${type === 'shp' ? 'the_geom,' : '' }${additionalFields}
  `;

  const SQL = `
    SELECT ${fields} 
    FROM support_mappluto
    WHERE bbl IN (${selectedLotsString})
  `;

    const apiCall = `https://${cartoOptions.carto_domain}/api/v2/sql?q=${SQL}&format=${type}&filename=selected_lots`;

    window.open(apiCall, 'Download');
  }
}

const clearSelection = () => {
  selectedLots.features = [];
  updateUI(selectedLots);
}

map.on('load', function () {

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    anchor: 'left',
    offset: 15,
  });

  const mapConfig = {
    version: '1.3.0',
    layers: [
      {
        id: 'pluto',
        type: 'mapnik',
        options: {
          cartocss_version: '2.1.1',
          cartocss: '#layer { polygon-fill: #FFF; }',
          sql: 'SELECT cartodb_id, the_geom_webmercator, bbl, block, lot, address FROM support_mappluto',
        },
      },
      {
        id: 'block-centroids',
        type: 'mapnik',
        options: {
          cartocss_version: '2.1.1',
          cartocss: '#layer { polygon-fill: #FFF; }',
          sql: 'SELECT * FROM mappluto_block_centroids',
        },
      }

    ],
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

    map.addLayer(layerConfig.pluto, 'building');
    map.addLayer(layerConfig.plutoLabels);
    map.addLayer(layerConfig.blockLabels);
    map.addLayer(layerConfig.selectedLots);

    // set building layer opacity
    map.setPaintProperty('building', 'fill-opacity', 0.2)

    // on click
    map.on('click', (e) => {
      if (draw.getMode() !== 'draw_polygon') {
        const features = map.queryRenderedFeatures(e.point, { layers: ['pluto'] });
        const uniqueFeatures = _.uniq(features, feature => feature.properties.bbl);
        if(uniqueFeatures.length > 0) updateSelectedLots(uniqueFeatures);
      }
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['pluto'] });

      // show popup
      if (features && features.length > 0) {
        const d = features[0].properties
        popup.setLngLat(e.lngLat)
          .setHTML(`${d.address}<br/>Block: ${d.block} Lot: ${d.lot}`)
          .addTo(map);
      } else {
        popup.remove();
      }

      map.getCanvas().style.cursor = (features && features.length > 0) ? 'pointer' : '';
    });
  });
});

const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        rectangle: false,
        polygon: false,
        trash: false,
    },
    styles: layerConfig.drawStyles,
});

map.addControl(draw);

map.on('draw.create', (d) => {
  $('.selection-tool-draw').removeClass('active');
  // remove the polygon, then pass its geometry on
  draw.deleteAll();
  getLotsInPolygon(d.features[0].geometry);
});

map.on('draw.modechange', () => {
  if (draw.getMode() === 'simple_select')  $('.selection-tool-draw').removeClass('active');

});

$('.selection-tool-draw').on('click', () => {
  const button = $('.selection-tool-draw')
  button.toggleClass('active');
  if (button.hasClass('active')) {
    draw.changeMode('draw_polygon');
  } else {
    draw.deleteAll();
    draw.changeMode('simple_select')
  }
});

$('#csv-download-button').on('click', () => { download('csv'); });
$('#shp-download-button').on('click', () => { download('shp'); });
$('#clear-button').on('click', clearSelection);

$(document).foundation();
