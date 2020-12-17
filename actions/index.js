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
  NAVIGATION_DATA,
  DANGER_LOCATION

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

export const updateMapBoxRoute = (routeData) => {
  return {
    type: MAP_BOX_ROUTE,
    payload: routeData
  };
};

export const updateMapQuestRoute = (routeData) => {
  return {
    type: MAP_QUEST_ROUTE,
    payload: routeData
  };
};

export const updateTMapRouteDefault = (routeData) => {
  return {
    type: T_MAP_ROUTE_DEFAULT,
    payload: routeData
  };
};

export const updateTMapRouteBigRoad = (routeData) => {
  return {
    type: T_MAP_ROUTE_BIG_ROAD,
    payload: routeData
  };
};

export const updateTMapRouteShortest = (routeData) => {
  return {
    type: T_MAP_ROUTE_SHORTEST,
    payload: routeData
  };
};

export const updateTMapRouteExceptStairs = (routeData) => {
  return {
    type: T_MAP_ROUTE_EXCEPT_STAIRS,
    payload: routeData
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

export const updateDangerLocations = (dangerLocations) => {
  return {
    type: DANGER_LOCATION,
    payload: dangerLocations
  };
};

export const updateNavigationDatas = (navigationDatas) => {
  return {
    type: NAVIGATION_DATA,
    payload: navigationDatas
  };
};
