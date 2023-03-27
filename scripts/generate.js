import parser from "csv-parser";
import geojson from "geojson";
import fs from "fs";

const args = process.argv.slice(2);
const csvPath = args[0];

const features = [];
let lineCount = 0;

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
    features.push(feature);
    lineCount++;
  })
  .on("end", async () => {
    console.log("Writing GeoJSON to file...");
    const featureCollection = { type: "FeatureCollection", features };
    await fs.writeFile(
      "treeattle.geojson",
      JSON.stringify(featureCollection),
      "utf8",
      () => {}
    );
    console.log(`Wrote ${lineCount} rows to treattle.geojson`);
  });
