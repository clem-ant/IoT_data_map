# Lancer le projet

### Ce projet nécessite node.js

1. Clonner le repo : `git clone https://github.com/clem-ant/IoT_data_map.git`
2. Installer les dépendance : `npm install`
3. Lancer le projet : `npm start`
4. Normalement, l'app s'ouvre toute seule sur [http://localhost:3000](http://localhost:3000).
5. Dans ce cas, statique, les données sont prises directement dans le fichier src/data/data.json

Le script python permet de parser le CAMS.log de ce format la et de le mettre sous json avec son timestamp :

```log
19:34:10|219|root|INFO|{"itsPduHeader": {"protocolVersion": 1, "messageId": 2, "stationId": 1}, "camPayload": {"generationDeltaTime": 219, "camParameters": {"basicContainer": {"trafficParticipantType": 7, "referencePosition": {"lat": 435619913, "lon": 14701428, "alt": 0, "hAcc": 127}}, "highFrequencyContainer": {"heading": {"headingValue": 0, "headingConfidence": 180.0}, "speed": {"speedValue": 93, "speedConfidence": 599}, "driveDirection": 2, "vehicleLength": {"vehicleLengthValue": 1023, "vehicleLengthConfidenceIndication": 4}, "vehicleWidth": 62, "longitudinalAcceleration": {"longitudinalAccelerationValue": 161, "longitudinalAccelerationConfidence": 102}, "curvature": {"curvatureValue": 1023, "curvatureConfidence": 7}, "curvatureCalculationMode": 2, "yawRate": {"yawRateValue": 32767, "yawRateConfidence": 8}}}}}
19:34:11|224|root|INFO|{"itsPduHeader": {"protocolVersion": 1, "messageId": 2, "stationId": 1}, "camPayload": {"generationDeltaTime": 224, "camParameters": {"basicContainer": {"trafficParticipantType": 7, "referencePosition": {"lat": 435619911, "lon": 14701436, "alt": 0, "hAcc": 127}}, "highFrequencyContainer": {"heading": {"headingValue": 0, "headingConfidence": 180.0}, "speed": {"speedValue": 56, "speedConfidence": 551}, "driveDirection": 2, "vehicleLength": {"vehicleLengthValue": 1023, "vehicleLengthConfidenceIndication": 4}, "vehicleWidth": 62, "longitudinalAcceleration": {"longitudinalAccelerationValue": 161, "longitudinalAccelerationConfidence": 102}, "curvature": {"curvatureValue": 1023, "curvatureConfidence": 7}, "curvatureCalculationMode": 2, "yawRate": {"yawRateValue": 32767, "yawRateConfidence": 8}}}}}
```

### Pour python

Comme indiqué plus haut, le script python permet uniquement de **parser** les logs afin d'en faire un **json utilisable** par l'application **react**.
Dans le cas ou il faudrait run ce genre de projet react en **prod**, il faudra utiliser une **api** ou des **web sockets** afin de donner au front, les informations en temps réel.
