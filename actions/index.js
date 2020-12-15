import {
  CURRENT_LOCATION,
  ORIGIN,
  DESTINATION,
  MAP_BOX_ROUTE,
  MAP_QUEST_ROUTE,
  T_MAP_ROUTE_DEFAULT,
  T_MAP_ROUTE_BIG_ROAD,
  T_MAP_ROUTE_SHORTEST,
  T_MAP_ROUTE_EXCEPT_STAIRS,
  LOADING_COVID_STATUS,
  LOADING_CURRENT_LOCATION,
  LOADING_ROUTES,

} from '../constants/actionTypes';

/* location은 Obj -> {'latitude' : latitude, 'longitude': longitude} */
export const updateCurrentLocation = (location) => {
  return {
    type: CURRENT_LOCATION,
    payload: location
  };
};

export const updateOriginLocation = (location) => {
  return {
    type: ORIGIN,
    payload: location
  };
};

export const updateDestinationLocation = (location) => {
  return {
    type: DESTINATION,
    payload: location
  };
};

/* route는 arr*/
export const updateMapBoxRoute = (route) => {
  return {
    type: MAP_BOX_ROUTE,
    payload: route
  };
};

export const updateMapQuestRoute = (route) => {
  return {
    type: MAP_QUEST_ROUTE,
    payload: route
  };
};

export const updateTMapRouteDefault = (route) => {
  return {
    type: T_MAP_ROUTE_DEFAULT,
    payload: route
  };
};

export const updateTMapRouteBigRoad = (route) => {
  return {
    type: T_MAP_ROUTE_BIG_ROAD,
    payload: route
  };
};

export const updateTMapRouteShortest = (route) => {
  return {
    type: T_MAP_ROUTE_SHORTEST,
    payload: route
  };
};

export const updateTMapRouteExceptStairs = (route) => {
  return {
    type: T_MAP_ROUTE_EXCEPT_STAIRS,
    payload: route
  };
};

export const updateIsLoadingCovidStatus = (isLoading) => {
  return {
    type: LOADING_COVID_STATUS,
    payload: isLoading
  };
};

export const updateIsLoadingCurrentLocation = (isLoading) => {
  return {
    type: LOADING_CURRENT_LOCATION,
    payload: isLoading
  };
};

export const updateIsLoadingRoutes = (isLoading) => {
  return {
    type: LOADING_ROUTES,
    payload: isLoading
  };
};
