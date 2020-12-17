import {
  MAP_BOX_ROUTE,
  MAP_QUEST_ROUTE,
  T_MAP_ROUTE_DEFAULT,
  T_MAP_ROUTE_BIG_ROAD,
  T_MAP_ROUTE_SHORTEST,
  T_MAP_ROUTE_EXCEPT_STAIRS
} from '../constants/actionTypes';

const initialConfig = {
  valid: false,
  distance: '',
  duration: '',
  countOfDanger: '',
  route: [],
  boundingBox: {
    up: '',
    down: '',
    left: '',
    right: ''
  }
};

const initialState = {
  mapBox: { ...initialConfig },
  mapQuest: { ...initialConfig },
  tMapDefault: { ...initialConfig },
  tMapBigRoad: { ...initialConfig },
  tMapShortest: { ...initialConfig },
  tMapExceptStairs: { ...initialConfig }
};

const routesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_BOX_ROUTE:
      return {
        ...state,
        mapBox: {
          valid: action.payload.valid,
          distance: action.payload.distance,
          duration: action.payload.duration,
          countOfDanger: action.payload.countOfDanger,
          route: [...action.payload.route],
          boundingBox: { ...state.mapBox.boundingBox, ...action.payload.boundingBox }
        }
      };

    case MAP_QUEST_ROUTE:
      return {
        ...state,
        mapQuest: {
          valid: action.payload.valid,
          distance: action.payload.distance,
          duration: action.payload.duration,
          countOfDanger: action.payload.countOfDanger,
          route: [...action.payload.route],
          boundingBox: { ...state.mapQuest.boundingBox, ...action.payload.boundingBox }
        }
      };

    case T_MAP_ROUTE_DEFAULT:
      return {
        ...state,
        tMapDefault: {
          valid: action.payload.valid,
          distance: action.payload.distance,
          duration: action.payload.duration,
          countOfDanger: action.payload.countOfDanger,
          route: [...action.payload.route],
          boundingBox: { ...state.tMapDefault.boundingBox, ...action.payload.boundingBox }
        }
      };

    case T_MAP_ROUTE_BIG_ROAD:
      return {
        ...state,
        tMapBigRoad: {
          valid: action.payload.valid,
          distance: action.payload.distance,
          duration: action.payload.duration,
          countOfDanger: action.payload.countOfDanger,
          route: [...action.payload.route],
          boundingBox: { ...state.tMapBigRoad.boundingBox, ...action.payload.boundingBox }
        }
      };

    case T_MAP_ROUTE_SHORTEST:
      return {
        ...state,
        tMapShortest: {
          valid: action.payload.valid,
          distance: action.payload.distance,
          duration: action.payload.duration,
          countOfDanger: action.payload.countOfDanger,
          route: [...action.payload.route],
          boundingBox: { ...state.tMapShortest.boundingBox, ...action.payload.boundingBox }
        }
      };

    case T_MAP_ROUTE_EXCEPT_STAIRS:
      return {
        ...state,
        tMapExceptStairs: {
          valid: action.payload.valid,
          distance: action.payload.distance,
          duration: action.payload.duration,
          countOfDanger: action.payload.countOfDanger,
          route: [...action.payload.route],
          boundingBox: { ...state.tMapExceptStairs.boundingBox, ...action.payload.boundingBox }
        }
      };

    default:
      return state;
  }
};

export default routesReducer;
