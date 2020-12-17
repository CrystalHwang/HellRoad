import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';

import { COLOR, APIs, MAP_MODE } from '../constants';
import * as actions from '../actions';

const OptimalRoute = (mode) => {
  const mapBox = useSelector(state => state.routesReducer.mapBox);
  const mapQuest = useSelector(state => state.routesReducer.mapQuest);
  const tMapDefault = useSelector(state => state.routesReducer.tMapDefault);
  const tMapBigRoad = useSelector(state => state.routesReducer.tMapBigRoad);
  const tMapShortest = useSelector(state => state.routesReducer.tMapShortest);
  const tMapExceptStairs = useSelector(state => state.routesReducer.tMapExceptStairs);

  const dispatch = useDispatch();

  switch (mode) {
    case APIs.MAP_BOX:
      dispatch(actions.updateNavigationDatas({
        distance: mapBox.distance,
        duration: mapBox.duration,
      }));
      return (
        <Polyline
          coordinates={mapBox.route}
          strokeColor={'red'}
          strokeWidth={8}
        />);

    case APIs.MAP_QUEST:
      dispatch(actions.updateNavigationDatas({
        distance: mapQuest.distance,
        duration: mapQuest.duration,
      }));
      return (
        <Polyline
          coordinates={mapQuest.route}
          strokeColor={'orange'}
          strokeWidth={6}
          zIndex={10}
        />);

    default:
    case APIs.tMapRouteDefault:
      dispatch(actions.updateNavigationDatas({
        distance: tMapDefault.distance,
        duration: tMapDefault.duration,
      }));
      return (
        <Polyline
          coordinates={tMapDefault.route}
          strokeColor={'yellow'}
          strokeWidth={10}
        />);

    case APIs.tMapRouteBigRoad:
      dispatch(actions.updateNavigationDatas({
        distance: tMapBigRoad.distance,
        duration: tMapBigRoad.duration,
      }));
      return (
        <Polyline
          coordinates={tMapBigRoad.route}
          strokeColor={'green'}
          strokeWidth={8}
        />
      );

    case APIs.tMapRouteShortest:
      dispatch(actions.updateNavigationDatas({
        distance: tMapShortest.distance,
        duration: tMapShortest.duration,
      }));
      return (
        <Polyline
          coordinates={tMapShortest.route}
          strokeColor={'navy'}
          strokeWidth={4}
        />);

    case APIs.tMapRouteExceptStairs:
      dispatch(actions.updateNavigationDatas({
        distance: tMapExceptStairs.distance,
        duration: tMapExceptStairs.duration,
      }));
      return (
        <Polyline
          coordinates={tMapExceptStairs.route}
          strokeColor={'purple'}
          strokeWidth={2}
        />);
  }
};

export default OptimalRoute;
