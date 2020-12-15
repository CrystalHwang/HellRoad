import axios from 'axios';

import { GOOGLE_API_KEY, MAPBOX_PUBLIC_KEY, MAPQUEST_API_KEY, T_MAP_APP_KEY } from '@env';
import { getLatLngFromAPIData, transformCoordinatesArray, transformCoordinatesArrayForMapQuest, transformCoordinatesArrayForTMap } from '../utils';

export const getLatLngFromAddress = async (addressName) => {
  const addressData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressName}&key=${GOOGLE_API_KEY}`);
  const latLng = getLatLngFromAPIData(addressData);

  return latLng;
};

export const getRoutesFromAPIs = async (originLocation, destinationLocation, originName, destinationName) => {
  try {
    const tMapOption = {
      startX: originLocation.longitude,
      startY: originLocation.latitude,
      endX: destinationLocation.longitude,
      endY: destinationLocation.latitude,
      startName: originName,
      endName: destinationName
    };

    const mapBoxResponse = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${originLocation.longitude},${originLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}?geometries=geojson&access_token=${MAPBOX_PUBLIC_KEY}`);
    const routeFromMapBox = transformCoordinatesArray(mapBoxResponse.data.routes[0].geometry.coordinates);
    alert('1');
    const mapQuestResponse = await axios.get(`http://www.mapquestapi.com/directions/v2/alternateroutes?key=${MAPQUEST_API_KEY}&from=${originLocation.latitude},${originLocation.longitude}&to=${destinationLocation.latitude},${destinationLocation.longitude}&maxRoutes=5&timeOverage=100&routeType=pedestrian`);
    const routeFromMapQuest = transformCoordinatesArrayForMapQuest(mapQuestResponse.data.route.shape.shapePoints);
    //alert('2');
    const tMapDefaultResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=0`, tMapOption);
    const routeFromTMapDefault = transformCoordinatesArrayForTMap(tMapDefaultResponse.data.features);
    //alert('3');

    const tMapBigRoadResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=4`, tMapOption);
    const routeFromTMapBigRoad = transformCoordinatesArrayForTMap(tMapBigRoadResponse.data.features);
    //alert('4');
    //const tMapExceptStairsResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=30`, tMapOption);
    const tMapExceptStairsResponse = [];
    //const routeFromTMapExceptStairs = transformCoordinatesArrayForTMap(tMapExceptStairsResponse.data.features);
    const routeFromTMapExceptStairs = [];

    //const tMapShortestResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=10`, tMapOption);
    const tMapShortestResponse = [];
    //const routeFromTMapShortest = transformCoordinatesArrayForTMap(tMapShortestResponse.data.features);
    const routeFromTMapShortest = [];

    const routes = {
      mapBoxRoute: routeFromMapBox,
      mapQuestRoute: routeFromMapQuest,
      tMapRouteDefault: routeFromTMapDefault,
      tMapRouteBigRoad: routeFromTMapBigRoad,
      tMapRouteShortest: routeFromTMapShortest,
      tMapRouteExceptStairs: routeFromTMapExceptStairs
    };

    return routes;
  } catch (err) {
    console.error(err);
  }
};