# pgo-pvp-coreanalysis
Tool for performing core analysis of Pokemon Go pvp metas

To run:

Have your local PvPoke instance running (see their GitHub: https://github.com/pvpoke/pvpoke)

Copy .env-dist named as .env and set the values accordingly

Identify your meta, and the name PvPoke uses on their site (Ranking page's select.format-select > option[cup]="xxx")

Set .env RUN_META_NAME and RUN_META_CP to your meta name and CP (Example: "venture", 1500)

Run the following 4 scripts 

node getMeta.js

node mapMoves.js

node getCoverageArray.js // optionally if it's a resume: node getCoverageArray.js resume

node createGraphData.js

Open the data viewing web-page: "graphOutputCytoscape.html"

Within the page: Choose file > "graphData.txt"

DS