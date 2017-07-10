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
    source: 'pluto',
    'source-layer': 'layer0',
    paint: {
      'text-color': 'rgba(255, 255, 255, 1)',
    },
    layout: {
      'text-field': '{lot}',
      'text-font': {
        stops: [
          [
            6,
            [
              'Open Sans Regular',
              'Arial Unicode MS Regular',
            ],
          ],
          [
            10,
            [
              'Open Sans Regular',
              'Arial Unicode MS Regular',
            ],
          ],
        ],
      },
      'text-size': 14,
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
