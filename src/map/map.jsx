import { TripsLayer } from "@deck.gl/geo-layers"; // Utilisation de TripsLayer pour afficher le trail
import DeckGL from "@deck.gl/react";
import maplibregl from "maplibre-gl";
import React, { useEffect, useState } from "react";
import { Map } from "react-map-gl";
import data from "../data/data.json";

const INITIAL_VIEW_STATE = {
  longitude: 1.4701428,
  latitude: 43.5619913,
  zoom: 18,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  "https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function Mapp({
  initialViewState = INITIAL_VIEW_STATE,
  mapStyle = MAP_STYLE,
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
    getColor: [255, 159, 0], // Couleur blanche pour l'exemple, à modifier
    opacity: 0.5,
    widthMinPixels: 0.1,
    widthMaxPixels: 3,
    rounded: true,
    trailLength: 15, // Longueur du trail en secondes
    currentTime: animationTime, // Boucle sur la durée totale
    shadow: false,
    fadeTrail: false,
  });

  return (
    <DeckGL
      layers={trips}
      initialViewState={initialViewState}
      controller={true}
    >
      <Map mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}
