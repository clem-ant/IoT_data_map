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
  longitude: 1.47,
  latitude: 43.6,
  zoom: 10,
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

  useEffect(() => {
    // Obtenez la date actuelle
    const currentDate = new Date();

    // Trier les données par ordre chronologique en utilisant la date actuelle combinée avec l'heure dans log_time
    const sortedData = data.slice().sort((a, b) => {
      const [hoursA, minutesA, secondsA] = a.log_time.split(":");
      const [hoursB, minutesB, secondsB] = b.log_time.split(":");
      const dateA = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hoursA,
        minutesA,
        secondsA
      );
      const dateB = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hoursB,
        minutesB,
        secondsB
      );
      return dateA - dateB;
    });

    // Convertir les données triées en un format utilisable par TripsLayer
    const formattedTripsData = sortedData.map((item) => ({
      path: [
        [
          item.camPayload.camParameters.basicContainer.referencePosition.lon /
            10e6,
          item.camPayload.camParameters.basicContainer.referencePosition.lat /
            10e6,
        ],
      ],
      timestamps: [currentDate.setHours(...item.log_time.split(":")) / 1000], // Convertir en secondes UNIX
      vendor: 0,
    }));

    setTripsData(formattedTripsData);
  }, [data]);
  console.log(tripsData);
  // Ajouter 'data' dans le tableau de dépendances pour s'assurer que useEffect se déclenche lorsque les données changent

  // Calculer l'index de temps actuel dans la boucle
  //   const currentTimeIndex = Math.floor((Date.now() / 1000) % tripsData.length);

  // Utiliser cet index pour déterminer l'heure actuelle dans les données
  //   const currentTime = tripsData[currentTimeIndex].timestamps[0];

  const layers = [
    // Ajouter une couche TripsLayer pour afficher le trail sur la carte
    new TripsLayer({
      id: "trips-layer",
      data: tripsData,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: "#fff",
      opacity: 1,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 10, // Longueur du trail en secondes
      currentTime: (d) => d.timestamps, // Utiliser l'heure actuelle pour l'animation
      shadowEnabled: false,
    }),
  ];

  return (
    <DeckGL
      layers={layers}
      effects={theme.effects}
      initialViewState={initialViewState}
      controller={true}
    >
      <Map
        reuseMaps
        mapLib={maplibregl}
        mapStyle={mapStyle}
        preventStyleDiffing={true}
      />
    </DeckGL>
  );
}
