import { useCallback, useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useMantineTheme, LoadingOverlay } from "@mantine/core";
import maplibregl, {
  Map as GLMap,
  ExpressionSpecification,
  StyleSpecification,
} from "maplibre-gl";
import MapPopup from "./MapPopup";
import { useFilterContext } from "./FilterContext";
import { Owner } from "../types/filters";
import "./map.css";

const style = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
      maxzoom: 20,
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

  // initialize map
  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current ?? "",
      style,
      center: [-122.3517, 47.6219],
      maxZoom: 17,
      minZoom: 9,
      zoom: 11,
    });
    map.current.addControl(
      new maplibregl.NavigationControl({ showZoom: true }),
      "top-right"
    );
    map.current.on("load", () => setIsMapLoading(false));
  }, []);

  const getFilters = useCallback(() => {
    const filters: ExpressionSpecification[] = [];
    filters.push(["in", ["get", "GENUS"], ["literal", genuses]]);

    if (owner !== Owner.ALL) {
      filters.push(["==", ["get", "OWNERSHIP"], owner]);
    }
    return filters;
  }, [genuses, owner]);

  // initialize data from geojson
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
          const filters = getFilters();
          map.current?.addSource("topTreesSource", {
            type: "geojson",
            data,
            generateId: true,
          });
          map.current?.addLayer({
            id: "topTrees",
            type: "circle",
            source: "topTreesSource",
            paint: {
              // interpolate radius between 2 at 9 zoom and 10 at 17 zoom
              "circle-radius": [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                9,
                2,
                17,
                10,
              ],
              "circle-color": theme.colors.lime[5],
              "circle-stroke-color": theme.colors.lime[7],
              "circle-stroke-width": 1,
            },
            filter: ["all", ...filters],
          });
          setIsDataLoading(false);
        })
        .catch(() => setIsDataLoading(false));
    }
  }, [theme, isMapLoading]);

  // apply filters
  useEffect(() => {
    if (map.current && !isMapLoading) {
      if (map.current.getLayer("topTrees")) {
        const filters = getFilters();
        map.current.setFilter("topTrees", ["all", ...filters]);
      }
    }
  }, [getFilters, isMapLoading]);

  // initialize mouse behavior
  useEffect(() => {
    if (map.current && !isMapLoading) {
      map.current.on("mouseover", "topTrees", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer";
        }
      });
      map.current.on("mouseleave", "topTrees", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "";
        }
      });

      map.current.on("click", "topTrees", (e) => {
        if (map.current && e.features) {
          const coords = (e.features[0].geometry as any).coordinates.slice();
          const {
            COMMON_NAME: commonName,
            SCIENTIFIC_NAME: scientificName,
            DIAM: diameter,
            HERITAGE: heritage,
            OWNERSHIP: ownership,
            PLANTED_DATE: plantedDate,
            UNITDESC: location,
            UNITID: id,
          } = e.features[0].properties as any;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
            coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
          }

          const popup = (
            <MapPopup
              commonName={commonName}
              scientificName={scientificName}
              diameter={diameter}
              heritage={heritage}
              ownership={ownership}
              plantedDate={plantedDate}
              location={location}
              id={id}
            />
          );

          new maplibregl.Popup({ closeButton: false })
            .setLngLat(coords)
            .setHTML(renderToString(popup))
            .addTo(map.current);
        }
      });
    }
  }, [isMapLoading]);

  return (
    <div className="map-wrapper">
      <LoadingOverlay visible={isMapLoading || isDataLoading} overlayBlur={2} />
      <div ref={mapContainer} className="map" />
    </div>
  );
}
