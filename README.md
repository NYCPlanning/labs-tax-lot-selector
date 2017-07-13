# labs-bbl-list-generator
A simple map-based tool for selecting multiple NYC tax lots and downloading a CSV/SHP with their BBLs

## About
This tool's primary purpose is to complement other information systems that require a list of affected tax lots to describe a study area, rezoning, or other area of interest.  Instead of a more manual process using desktop GIS software, this tool allows the user to quickly identify the lots in their area of interest through a simple, open web interface.  The user can select those lots that are within the area of interest, and quickly download the lot identifiers as machine-readable data.  

## Customer
Business Improvement Division

## Tech
This is a simple HTML/CSS/JS frontend mapping tool that interacts with NYC PLUTO data hosted on a Carto server.  The client-side mapping technology is mapbox GL JS.  The Carto server provides vector tiles for NYC's MapPLUTO dataset, and also handles the file downloads based on the user's selection.  

## Development Environment
- Clone this repository

`git clone https://github.com/NYCPlanning/labs-bbl-list-generator.git`

- Navigate to the project directory and start a local webserver

**Python 2**
`cd labs-bbl-list-generator && python -m SimpleHTTPServer 8000`

**Python 3**
`cd labs-bbl-list-generator && python -m http.server 8000`

- Open the site in your browser at `http://localhost:8000`

## A project by the DCP Business Improvement Division and NYC Planning Labs
Project Profile coming soon at [planninglabs.nyc](https://planninglabs.nyc)
