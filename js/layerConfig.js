const layerConfig = { // eslint-disable-line
  pluto: {
    id: 'pluto',
    type: 'fill',
    source: 'pluto',
    'source-layer': 'layer0',
    paint: {
      'fill-color': 'rgba(81, 111, 217, 1)',
      'fill-opacity': 0.7,
      'fill-outline-color': 'rgba(255, 255, 255, 1)',
    },
  },

  plutoLabels: {
    id: 'pluto-labels',
    type: 'symbol',
    minzoom: 16,
    source: 'pluto',
    'source-layer': 'layer0',
    paint: {
      'text-color': 'rgba(255, 255, 255, 1)',
    },
    layout: {
      'text-field': '{block}-{lot}',
      'text-font': [
        'Open Sans Regular',
        'Arial Unicode MS Regular',
      ],
      'text-size': 11,
    },
  },

  selectedLots: {
    id: 'selected-lots',
    type: 'fill',
    source: 'selectedLots',
    paint: {
      'fill-color': 'rgba(217, 216, 1, 1)',
      'fill-outline-color': 'rgba(255, 255, 255, 1)',
    },
  },

  drawStyles: [
    // ACTIVE (being drawn)
    // line stroke
    {
      id: 'gl-draw-line',
      type: 'line',
      filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#D96B27',
        'line-dasharray': [0.2, 2],
        'line-width': 4,
      },
    },
    // polygon fill
    {
      id: 'gl-draw-polygon-fill',
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
      paint: {
        'fill-color': '#D20C0C',
        'fill-outline-color': '#D20C0C',
        'fill-opacity': 0.1,
      },
    },
    // polygon outline stroke
    // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
    {
      id: 'gl-draw-polygon-stroke-active',
      type: 'line',
      filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#D96B27',
        'line-dasharray': [0.2, 2],
        'line-width': 4,
      },
    },
    // vertex point halos
    {
      id: 'gl-draw-polygon-and-line-vertex-halo-active',
      type: 'circle',
      filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
      paint: {
        'circle-radius': 7,
        'circle-color': '#FFF',
      },
    },
    // vertex points
    {
      id: 'gl-draw-polygon-and-line-vertex-active',
      type: 'circle',
      filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
      paint: {
        'circle-radius': 6,
        'circle-color': '#D96B27',
      },
    },

    // INACTIVE (static, already drawn)
    // line stroke
    {
      id: 'gl-draw-line-static',
      type: 'line',
      filter: ['all', ['==', '$type', 'LineString'], ['==', 'mode', 'static']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#000',
        'line-width': 3,
      },
    },
    // polygon fill
    {
      id: 'gl-draw-polygon-fill-static',
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
      paint: {
        'fill-color': '#000',
        'fill-outline-color': '#000',
        'fill-opacity': 0.1,
      },
    },
    // polygon outline
    {
      id: 'gl-draw-polygon-stroke-static',
      type: 'line',
      filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#000',
        'line-width': 3,
      },
    },
  ],
};
