import axios from 'axios';

import { GOOGLE_API_KEY, MAPBOX_PUBLIC_KEY, MAPQUEST_API_KEY, T_MAP_APP_KEY } from '@env';
import {
  getLatLngFromAPIData,
  transformCoordinatesArrayForMapBox,
  transformCoordinatesArrayForMapQuest,
  transformCoordinatesArrayForTMap,
  convertedToRoundedMinutes,
  findBoundingBoxCoordinates
} from '../utils';

export const getLatLngFromAddress = async (addressName) => {
  const addressData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressName}&key=${GOOGLE_API_KEY}`);
  const latLng = getLatLngFromAPIData(addressData);

  return latLng;
};

export const getRoutesFromAPIs = async (originLocation, destinationLocation, originName, destinationName) => {
  const tMapOption = {
    startX: originLocation.longitude,
    startY: originLocation.latitude,
    endX: destinationLocation.longitude,
    endY: destinationLocation.latitude,
    startName: originName,
    endName: destinationName
  };

  const routes = {
    mapBox: {},
    mapQuest: {},
    tMapRouteDefault: {},
    tMapRouteBigRoad: {},
    tMapRouteShortest: {},
    tMapRouteExceptStairs: {}
  };

  try {
    const mapBoxResponse = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${originLocation.longitude},${originLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}?geometries=geojson&steps=true&voice_instructions=true&access_token=${MAPBOX_PUBLIC_KEY}`);
    const dataOfRoute = mapBoxResponse.data.routes[0];

    const routeFromMapBox = transformCoordinatesArrayForMapBox(dataOfRoute.geometry.coordinates);
    const boundingBox = findBoundingBoxCoordinates(routeFromMapBox);

    routes.mapBox = {
      valid: true,
      distance: dataOfRoute.distance,
      duration: convertedToRoundedMinutes(dataOfRoute.duration),
      countOfDanger: 0,
      route: [...routeFromMapBox],
      boundingBox: { ...boundingBox }
    };
  } catch (err) {
    routes.mapBox = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };
  }

  try {
    const mapQuestResponse = await axios.get(`http://www.mapquestapi.com/directions/v2/alternateroutes?key=${MAPQUEST_API_KEY}&from=${originLocation.latitude},${originLocation.longitude}&to=${destinationLocation.latitude},${destinationLocation.longitude}&maxRoutes=5&timeOverage=100&routeType=pedestrian`);
    const dataOfRoute = mapQuestResponse.data.route;

    const routeFromMapQuest = transformCoordinatesArrayForMapQuest(dataOfRoute.shape.shapePoints);
    const boundingBox = findBoundingBoxCoordinates(routeFromMapQuest);

    routes.mapQuest = {
      valid: true,
      distance: dataOfRoute.distance * 1000,
      duration: convertedToRoundedMinutes(dataOfRoute.formattedTime),
      countOfDanger: 0,
      route: [...routeFromMapQuest],
      boundingBox: { ...boundingBox }
    };
  } catch (err) {
    routes.mapQuest = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };
  }

  try {
    const tMapDefaultResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=0`, tMapOption);
    const dataOfRoute = tMapDefaultResponse.data.features;
    const routeFromTMapDefault = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapDefault);

    routes.tMapDefault = {
      valid: true,
      distance: dataOfRoute[0].properties.totalDistance,
      duration: convertedToRoundedMinutes(dataOfRoute[0].properties.totalTime),
      countOfDanger: 0,
      route: [...routeFromTMapDefault],
      boundingBox: { ...boundingBox }
    };
  } catch (err) {
    routes.tMapDefulat = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };
  }

  try {
    const tMapBigRoadResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=4`, tMapOption);
    const dataOfRoute = tMapBigRoadResponse.data.features;
    const routeFromTMapBigRoad = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapBigRoad);

    routes.tMapBigRoad = {
      valid: true,
      distance: dataOfRoute[0].properties.totalDistance,
      duration: convertedToRoundedMinutes(dataOfRoute[0].properties.totalTime),
      countOfDanger: 0,
      route: [...routeFromTMapBigRoad],
      boundingBox: { ...boundingBox }
    };
  } catch (err) {
    routes.tMapBigRoad = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };
  }

  try {
    const tMapExceptStairsResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=30`, tMapOption);
    const dataOfRoute = tMapExceptStairsResponse.data.features;
    const routeFromTMapExceptStairs = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapExceptStairs);

    routes.tMapExceptStairs = {
      valid: true,
      distance: dataOfRoute[0].properties.totalDistance,
      duration: convertedToRoundedMinutes(dataOfRoute[0].properties.totalTime),
      countOfDanger: 0,
      route: [...routeFromTMapExceptStairs],
      boundingBox: { ...boundingBox }
    };

  } catch (err) {
    routes.tMapExceptStairs = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };
  }

  try {
    const tMapShortestResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=10`, tMapOption);
    const dataOfRoute = tMapShortestResponse.data.features;
    const routeFromTMapShortest = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapShortest);

    routes.tMapShortest = {
      valid: true,
      distance: dataOfRoute[0].properties.totalDistance,
      duration: convertedToRoundedMinutes(dataOfRoute[0].properties.totalTime),
      countOfDanger: 0,
      route: [...routeFromTMapShortest],
      boundingBox: { ...boundingBox }
    };
  } catch (err) {
    routes.tMapShortest = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };
  }

  return routes;
};