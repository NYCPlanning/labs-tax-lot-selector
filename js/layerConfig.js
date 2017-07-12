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
    minzoom: 15,
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
};
