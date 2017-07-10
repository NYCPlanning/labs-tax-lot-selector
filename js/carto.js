const Carto = { // eslint-disable-line

  // gets an mvt tile template URL for a carto layer config
  getVectorTileTemplate(mapConfig, options) {
    return new Promise((resolve, reject) => {
      $.ajax({ // eslint-disable-line no-undef
        type: 'POST',
        url: `https://${options.carto_domain}/user/${options.carto_user}/api/v1/map`,
        data: JSON.stringify(mapConfig),
        dataType: 'text',
        contentType: 'application/json',
        success(stringData) {
          const data = JSON.parse(stringData);
          const layergroupid = data.layergroupid;

          const template = `https://${options.carto_domain}/user/${options.carto_user}/api/v1/map/${layergroupid}/{z}/{x}/{y}.mvt`;

          resolve(template);
        },
      })
      .fail(() => reject());
    });
  },

  sql(query, options) {
    return new Promise((resolve, reject) => {
      $.ajax({ // eslint-disable-line no-undef
        type: 'GET',
        url: `https://${options.carto_domain}/user/${options.carto_user}/api/v2/sql?q=${query}&format=geojson`,
        success(d) {
          resolve(d);
        },
      })
      .fail(() => reject());
    });
  },
};
