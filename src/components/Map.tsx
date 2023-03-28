import { useRef, useEffect, useState } from "react";
import { useMantineTheme } from "@mantine/core";
import maplibregl, {
  Map as GLMap,
  ExpressionSpecification,
  StyleSpecification,
} from "maplibre-gl";
import { LoadingOverlay } from "@mantine/core";
import { useFilterContext } from "./FilterContext";
import { Owner } from "../types/filters";
import "./map.css";

const style = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm", // This must match the source key above
    },
  ],
} as StyleSpecification;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<GLMap | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const theme = useMantineTheme();

  const { genuses, owner } = useFilterContext();

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current ?? "",
      style,
      center: [-122.3517, 47.6219],
      zoom: 11,
    });
    map.current.addControl(
      new maplibregl.NavigationControl({ showZoom: true }),
      "top-right"
    );
    map.current.on("load", () => setIsMapLoading(false));
  }, []);

  useEffect(() => {
    if (!isMapLoading) {
      setIsDataLoading(true);
      fetch("data/treeattle_top.geojson", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          map.current?.addSource("topTreesSource", { type: "geojson", data });
          map.current?.addLayer({
            id: "topTrees",
            type: "circle",
            source: "topTreesSource",
            paint: {
              "circle-radius": 3,
              "circle-color": theme.colors.lime[5],
              "circle-stroke-color": theme.colors.lime[7],
              "circle-stroke-width": 1,
            },
          });
          setIsDataLoading(false);
        })
        .catch(() => setIsDataLoading(false));
    }
  }, [theme, isMapLoading]);

  useEffect(() => {
    if (map.current && !isMapLoading) {
      const filters: ExpressionSpecification[] = [];
      filters.push(["in", ["get", "GENUS"], ["literal", genuses]]);

      if (owner !== Owner.ALL) {
        filters.push(["==", ["get", "OWNERSHIP"], owner]);
      }

      map.current.setFilter("topTrees", ["all", ...filters]);
    }
  }, [genuses, owner, isMapLoading]);

  return (
    <div className="map-wrapper">
      <LoadingOverlay visible={isMapLoading || isDataLoading} overlayBlur={2} />
      <div ref={mapContainer} className="map" />
    </div>
  );
}
