import {
  MAP_BOX_ROUTE,
  MAP_QUEST_ROUTE,
  T_MAP_ROUTE_DEFAULT,
  T_MAP_ROUTE_BIG_ROAD,
  T_MAP_ROUTE_SHORTEST,
  T_MAP_ROUTE_EXCEPT_STAIRS
} from '../constants/actionTypes';

const initialState = {
  mapBoxRoute: [],
  mapQuestRoute: [],
  tMapRouteDefault: [],
  tMapRouteBigRoad: [],
  tMapRouteShortest: [],
  tMapRouteExceptStairs: []
};

const routesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_BOX_ROUTE:
      return {
        ...state,
        mapBoxRoute: [...action.payload]
      };

    case MAP_QUEST_ROUTE:
      return {
        ...state,
        mapQuestRoute: [...action.payload]
      };

    case T_MAP_ROUTE_DEFAULT:
      return {
        ...state,
        tMapRouteDefault: [...action.payload]
      };

    case T_MAP_ROUTE_BIG_ROAD:
      return {
        ...state,
        tMapRouteBigRoad: [...action.payload]
      };

    case T_MAP_ROUTE_SHORTEST:
      return {
        ...state,
        tMapRouteShortest: [...action.payload]
      };

    case T_MAP_ROUTE_EXCEPT_STAIRS:
      return {
        ...state,
        tMapRouteExceptStairs: [...action.payload]
      };

    default:
      return state;
  }
};

export default routesReducer;
