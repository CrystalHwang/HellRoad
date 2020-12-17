import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import OptimalRoute from './OptimalRoute';

import { getRoutesFromAPIs } from '../api';
import * as actions from '../actions';
import { COLOR, APIs, MAP_MODE } from '../constants';

const { width, height } = Dimensions.get('window');

const Route = ({
  mode,
  originName,
  destinationName,
  nameOfRenderingRoute
}) => {
  const isLoadingRoutes = useSelector(state => state.loadingReducer.routes);
  const currentLocation = useSelector(state => state.locationReducer.current);
  const originLocation = useSelector(state => state.locationReducer.origin);
  const destinationLocation = useSelector(state => state.locationReducer.destination);

  const mapBoxRoute = useSelector(state => state.routesReducer.mapBox.route);
  const mapQuestRoute = useSelector(state => state.routesReducer.mapQuest.route);
  const tMapRouteDefault = useSelector(state => state.routesReducer.tMapDefault.route);
  const tMapRouteBigRoad = useSelector(state => state.routesReducer.tMapBigRoad.route);
  const tMapRouteShortest = useSelector(state => state.routesReducer.tMapShortest.route);
  const tMapRouteExceptStairs = useSelector(state => state.routesReducer.tMapExceptStairs.route);

  const [isMark, setIsMark] = useState(originLocation && destinationLocation ? true : false);

  useEffect(() => {
    if (!nameOfRenderingRoute) return;

  }, [nameOfRenderingRoute]);

  return (
    isMark
      ? <>
        <Marker
          title={originName}
          coordinate={originLocation}
        >
          <Icon
            name='flag'
            style={styles.originIcon} />
        </Marker>
        <Marker
          title={destinationName}
          coordinate={destinationLocation} >
          <Icon
            name='flag-checkered'
            style={styles.destinationIcon} />
        </Marker>
        {
          mode === MAP_MODE.SEARCH
            ? <>
              <Polyline
                coordinates={mapBoxRoute}
                strokeColor={'red'}
                strokeWidth={8}
              />
              <Polyline
                coordinates={mapQuestRoute}
                strokeColor={'orange'}
                strokeWidth={6}
                zIndex={10}
              />
              <Polyline
                coordinates={tMapRouteDefault}
                strokeColor={'yellow'}
                strokeWidth={10}
              />
              <Polyline
                coordinates={tMapRouteBigRoad}
                strokeColor={'green'}
                strokeWidth={8}
              />
              <Polyline
                coordinates={tMapRouteShortest}
                strokeColor={'navy'}
                strokeWidth={4}
              />
              <Polyline
                coordinates={tMapRouteExceptStairs}
                strokeColor={'purple'}
                strokeWidth={2}
              />
            </>
            : <OptimalRoute mode={mode} />
        }
      </>
      : null
  );
};

const styles = StyleSheet.create({
  originIcon: {
    fontSize: 30,
    color: COLOR.MAIN_BLUE,
  },
  destinationIcon: {
    fontSize: 30,
    color: COLOR.MAIN_BLUE
  }
});

export default Route;
