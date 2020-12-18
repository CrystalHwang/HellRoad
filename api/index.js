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
    //console.log("MAPBOX", mapBoxResponse);
  } catch (err) {
    routes.mapBox = {
      valid: false,
      distance: 0,
      duration: 0,
      countOfDanger: 0,
      route: [],
      boundingBox: {}
    };

    console.error(err);
  }

  try {
    const mapQuestResponse = await axios.get(`http://www.mapquestapi.com/directions/v2/alternateroutes?key=${MAPQUEST_API_KEY}&from=${originLocation.latitude},${originLocation.longitude}&to=${destinationLocation.latitude},${destinationLocation.longitude}&maxRoutes=5&timeOverage=100&routeType=pedestrian`);
    const dataOfRoute = mapQuestResponse.data.route;
    //console.log("MAPQUEST", mapQuestResponse.data);

    const routeFromMapQuest = transformCoordinatesArrayForMapQuest(dataOfRoute.shape.shapePoints);
    const boundingBox = findBoundingBoxCoordinates(routeFromMapQuest);
    //console.log("MAPQUEST", mapQuestResponse);
    //console.log('거리', mapQuestResponse.data.route.distance);
    //console.log('boundingBox', mapQuestResponse.data.route.boundingBox);
    //console.log('예상 소요 시간', mapQuestResponse.data.route.formattedTime);
    //console.log('?!!!!!!!!!', routeFromMapQuest);
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

    console.error(err);
  }

  try {
    const tMapDefaultResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=0`, tMapOption);
    const dataOfRoute = tMapDefaultResponse.data.features;
    const routeFromTMapDefault = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapDefault);
    //console.log('t1', tMapDefaultResponse);
    //console.log('arr length', tMapDefaultResponse.data.features.length);
    //console.log(`거리, ${tMapDefaultResponse.data.features[0].properties.totalDistance}미터, 약 ${Math.ceil(tMapDefaultResponse.data.features[0].properties.totalTime / 60)}분`);

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

    console.error(err);
  }

  try {
    const tMapBigRoadResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=4`, tMapOption);
    const dataOfRoute = tMapBigRoadResponse.data.features;
    const routeFromTMapBigRoad = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapBigRoad);
    //console.log('t2', tMapBigRoadResponse);
    //console.log('arr length', tMapBigRoadResponse.data.features.length);
    //console.log(`거리 ${tMapBigRoadResponse.data.features[0].properties.totalDistance}미터, 약 ${Math.ceil(tMapBigRoadResponse.data.features[0].properties.totalTime / 60)}분`);

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

    console.error(err);
  }

  try {
    const tMapExceptStairsResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=30`, tMapOption);
    const dataOfRoute = tMapExceptStairsResponse.data.features;
    const routeFromTMapExceptStairs = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapExceptStairs);

    //console.log('t3', tMapExceptStairsResponse);
    //console.log('arr length', tMapExceptStairsResponse.data.features.length);
    //console.log(`거리 ${tMapExceptStairsResponse.data.features[0].properties.totalDistance}미터, 약 ${Math.ceil(tMapExceptStairsResponse.data.features[0].properties.totalTime / 60)}분`);
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

    //console.error('T map stairs', err);
  }

  try {
    const tMapShortestResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=10`, tMapOption);
    const dataOfRoute = tMapShortestResponse.data.features;
    const routeFromTMapShortest = transformCoordinatesArrayForTMap(dataOfRoute);
    const boundingBox = findBoundingBoxCoordinates(routeFromTMapShortest);

    //console.log('t4', tMapShortestResponse);
    //console.log('arr length', tMapShortestResponse.data.features.length);
    //console.log(`거리 ${tMapShortestResponse.data.features[0].properties.totalDistance}미터 약 ${Math.ceil(tMapShortestResponse.data.features[0].properties.totalTime) / 60}분`);

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

    //console.error('T map shortest', err);
  }

  return routes;
};