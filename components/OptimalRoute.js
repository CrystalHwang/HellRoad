import React from 'react';
import { useSelector } from 'react-redux';
import { Polyline } from 'react-native-maps';

import { APIs } from '../constants';

const OptimalRoute = () => {
  const mapBox = useSelector(state => state.routesReducer.mapBox);
  const mapQuest = useSelector(state => state.routesReducer.mapQuest);
  const tMapDefault = useSelector(state => state.routesReducer.tMapDefault);
  const tMapBigRoad = useSelector(state => state.routesReducer.tMapBigRoad);
  const tMapShortest = useSelector(state => state.routesReducer.tMapShortest);
  const tMapExceptStairs = useSelector(state => state.routesReducer.tMapExceptStairs);

  const optimalRoute = useSelector(state => state.navigationReducer.nameOfAPI);

  switch (optimalRoute) {
    case APIs.MAP_BOX:
      return (
        <Polyline
          coordinates={mapBox.route}
          strokeColor={'red'}
          strokeWidth={8}
        />);

    case APIs.MAP_QUEST:
      return (
        <Polyline
          coordinates={mapQuest.route}
          strokeColor={'orange'}
          strokeWidth={6}
          zIndex={10}
        />);

    default:
    case APIs.tMapRouteDefault:
      return (
        <Polyline
          coordinates={tMapDefault.route}
          strokeColor={'yellow'}
          strokeWidth={10}
        />);

    case APIs.tMapRouteBigRoad:
      return (
        <Polyline
          coordinates={tMapBigRoad.route}
          strokeColor={'green'}
          strokeWidth={8}
        />
      );

    case APIs.tMapRouteShortest:
      return (
        <Polyline
          coordinates={tMapShortest.route}
          strokeColor={'navy'}
          strokeWidth={4}
        />);

    case APIs.tMapRouteExceptStairs:
      return (
        <Polyline
          coordinates={tMapExceptStairs.route}
          strokeColor={'purple'}
          strokeWidth={2}
        />);
  }
};

export default OptimalRoute;
