# NYC Tax Lot Selector (BBL List Generator)
This is a simple map-based tool for selecting multiple NYC tax lots and downloading a CSV/SHP file with their BBLs (Borough/Block/Lot).

Built with Department of City Planning's Business Improvement Division, this tool's primary purpose is to complement other information systems that require a list of affected tax lots to describe a study area, rezoning, or other area of interest.  Instead of a more manual process using desktop GIS software, this tool allows the user to quickly identify the lots in their area of interest through a simple, open web interface.  The user can select those lots that are within the area of interest, and quickly download the lot identifiers as machine-readable data.  

![image](https://user-images.githubusercontent.com/409279/34119049-c32cad06-e3ee-11e7-994b-bea85de03cfc.png)

## How we work

[NYC Planning Labs](https://planninglabs.nyc) takes on a single project at a time, working closely with our customers from concept to delivery in a matter of weeks.  We conduct regular maintenance between larger projects.  

## How you can help

In the spirit of free software, everyone is encouraged to help improve this project.  Here are some ways you can contribute.

- Comment on or clarify [issues](link to issues)
- Report [bugs](link to bugs)
- Suggest new features
- Write or edit documentation
- Write code (no patch is too small)
  - Fix typos
  - Add comments
  - Clean up code
  - Add new features

**[Read more about contributing.](CONTRIBUTING.md)**

## Requirements

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with NPM)

## Local development

- Clone this repository `git clone https://github.com/NYCPlanning/labs-bbl-list-generator.git`
- Navigate to the project directory and start a local webserver
  - **Python 2** `cd labs-bbl-list-generator && python -m SimpleHTTPServer 8000`
  - **Python 3** `cd labs-bbl-list-generator && python -m http.server 8000`
- Open the site in your browser at `http://localhost:8000`

## Architecture

This is a simple HTML/CSS/JS frontend mapping tool that interacts with NYC PLUTO data hosted on a Carto server.  The client-side mapping technology is mapbox GL JS.  The Carto server provides vector tiles for NYC's MapPLUTO dataset, and also handles the file downloads based on the user's selection.  

## Deployment

Deploy with dokku:
Create git remote `dokku` if you haven't already `git remote add dokku dokku@{domain}:lotselector`.
Push `master` `git push dokku master`

## MapPLUTO Block Labels
`mappluto_block_centroids` dataset was created to handle labels for the blocks.  Query for posterity/maintenance:
```
SELECT ST_Centroid(ST_Union(the_geom)) as the_geom, block FROM planninglabs.support_mappluto
GROUP BY block
```

## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)
