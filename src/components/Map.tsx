import { useRef, useEffect } from "react";
import maplibregl, { Map as GLMap, StyleSpecification } from "maplibre-gl";
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

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current ?? "",
      style,
      center: [-122.3517, 47.6219],
      zoom: 14,
    });
  }, []);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
