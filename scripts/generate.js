import parser from "csv-parser";
import geojson from "geojson";
import gp from "geojson-precision";
import fs from "fs";

const args = process.argv.slice(2);
const csvPath = args[0];

const TOP_GENUS = [
  "Acer",
  "Prunus",
  "Crataegus",
  "Malus",
  "Quercus",
  "Fraxinus",
  "Pyrus",
  "Tilia",
  "Cornus",
  "Liquidambar",
  "Betula",
  "Amelanchier",
  "Carpnius",
  "Ulmus",
  "Platanus",
];
const topFeatures = [];
const otherFeatures = [];
let topLineCount = 0;
let otherLineCount = 0;

fs.createReadStream(csvPath)
  .on("error", () => {
    console.log("Invalid file path provided");
  })
  .pipe(parser())
  .on("data", (row) => {
    const feature = geojson.parse(row, {
      Point: ["SHAPE_LAT", "SHAPE_LNG"],
      include: [
        "COMMON_NAME",
        "DIAM",
        "SCIENTIFIC_NAME",
        "GENUS",
        "OWNERSHIP",
        "PLANTED_DATE",
        "HERITAGE",
        "UNITID",
        "UNITDESC",
      ],
    });
    if (TOP_GENUS.includes(row.GENUS)) {
      topFeatures.push(gp.parse(feature, 6));
      topLineCount++;
    } else {
      otherFeatures.push(gp.parse(feature, 6));
      otherLineCount++;
    }
  })
  .on("end", async () => {
    console.log("Writing GeoJSON to files...");
    const topFeatureCollection = {
      type: "FeatureCollection",
      features: topFeatures,
    };
    const otherFeatureCollection = {
      type: "FeatureCollection",
      features: otherFeatures,
    };
    await Promise.all([
      fs.writeFile(
        "./data/treeattle_top.geojson",
        JSON.stringify(topFeatureCollection),
        "utf8",
        () => {}
      ),
      fs.writeFile(
        "./data/treeattle_other.geojson",
        JSON.stringify(otherFeatureCollection),
        "utf8",
        () => {}
      ),
    ]);
    console.log(`Wrote ${topLineCount} rows to treattle_top.geojson`);
    console.log(`Wrote ${otherLineCount} rows to treattle_other.geojson`);
  });
