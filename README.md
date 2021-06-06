# pgo-pvp-coreanalysis
Tool for performing core analysis of Pokemon Go pvp metas

To run:

Have your local PvPoke instance running (see their GitHub: https://github.com/pvpoke/pvpoke)

Identify your meta, and the name PvPoke uses on their site (Ranking page's select.format-select > option[cup]="xxx")

Run the following 4 scripts, with 3 of them psasing in your meta name (Example, "venture")

node getMeta venture

node mapMoves venture

node getCoverageArray venture

node createGraphData

Open the data viewing web-page: "graphOutputCytoscape.html"

Within the page: Choose file > "graphData.txt"

DS