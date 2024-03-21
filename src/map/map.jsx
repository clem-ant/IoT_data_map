import { AmbientLight, LightingEffect, PointLight } from "@deck.gl/core";
import { TripsLayer } from "@deck.gl/geo-layers"; // Utilisation de TripsLayer pour afficher le trail
import DeckGL from "@deck.gl/react";
import maplibregl from "maplibre-gl";
import React, { useEffect, useState } from "react";
import { Map } from "react-map-gl";
import data from "../data/data.json";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [43.5, 14.7, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70],
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect],
};

const INITIAL_VIEW_STATE = {
  longitude: 1.4701428,
  latitude: 43.5619913,
  zoom: 18,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

export default function Mapp({
  initialViewState = INITIAL_VIEW_STATE,
  mapStyle = MAP_STYLE,
  theme = DEFAULT_THEME,
}) {
  const [tripsData, setTripsData] = useState([]);
  const animationDuration = 600;
  const [animationTime, setAnimationTime] = useState(5);
  useEffect(() => {
    const animationInterval = setInterval(() => {
      console.log(animationTime);
      setAnimationTime((time) => (time + 1) % animationDuration);
    }, 100);
    return () => clearInterval(animationInterval);
  }, [animationTime]); // Ajouter animationTime comme dépendance

  useEffect(() => {
    const formattedTripsData = data.map((item, index) => ({
      waypoints: [
        {
          coordinates: [
            item.camPayload.camParameters.basicContainer.referencePosition.lon /
              10e6,
            item.camPayload.camParameters.basicContainer.referencePosition.lat /
              10e6,
          ],
          timestamp: index,
        },
      ],
    }));
    setTripsData(formattedTripsData);
  }, [data]);
  // Ajouter 'data' dans le tableau de dépendances pour s'assurer que useEffect se déclenche lorsque les données changent
  // Extract coordinates and timestamps from tripsData
  const paths = tripsData.flatMap((item) => {
    return item.waypoints.map((waypoint) => waypoint.coordinates);
  });

  const timestamps = tripsData.flatMap((item) => {
    return item.waypoints.map((waypoint) => waypoint.timestamp);
  });

  const trips = new TripsLayer({
    id: "trips-layer",
    data: tripsData,
    getPath: () => paths,
    getTimestamps: () => {
      console.log(timestamps);
      return timestamps;
    },
    getColor: [255, 255, 255], // Couleur blanche pour l'exemple, à modifier
    opacity: 0.5,
    widthMinPixels: 1,
    rounded: true,
    trailLength: 15, // Longueur du trail en secondes
    currentTime: animationTime, // Boucle sur la durée totale
    shadow: false,
    fadeTrail: false,
  });

  return (
    <DeckGL
      layers={trips}
      effects={theme.effects}
      initialViewState={initialViewState}
      controller={true}
    >
      <Map mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}
