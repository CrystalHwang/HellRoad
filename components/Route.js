import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { getRoutesFromAPIs } from '../api';
import * as actions from '../actions';
import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const Route = ({
  originName,
  destinationName
}) => {
  const isLoadingRoutes = useSelector(state => state.loadingReducer.routes);
  const currentLocation = useSelector(state => state.locationReducer.current);
  const originLocation = useSelector(state => state.locationReducer.origin);
  const destinationLocation = useSelector(state => state.locationReducer.destination);

  const mapBoxRoute = useSelector(state => state.routesReducer.mapBoxRoute);
  const mapQuestRoute = useSelector(state => state.routesReducer.mapQuestRoute);
  const tMapRouteDefault = useSelector(state => state.routesReducer.tMapRouteDefault);
  const tMapRouteBigRoad = useSelector(state => state.routesReducer.tMapRouteBigRoad);
  const tMapRouteShortest = useSelector(state => state.routesReducer.tMapRouteShortest);
  const tMapRouteExceptStairs = useSelector(state => state.routesReducer.tMapRouteExceptStairs);

  const [isMark, setIsMark] = useState(originLocation && destinationLocation ? true : false);

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
        <Polyline
          coordinates={mapBoxRoute}
          strokeColor={'red'}
          strokeWidth={5}
        />
        <Polyline
          coordinates={mapQuestRoute}
          strokeColor={'orange'}
          strokeWidth={5}
        />
        <Polyline
          coordinates={tMapRouteDefault}
          strokeColor={'yellow'}
          strokeWidth={6}
        />
        <Polyline
          coordinates={tMapRouteBigRoad}
          strokeColor={'green'}
          strokeWidth={5}
        />
        <Polyline
          coordinates={tMapRouteShortest}
          strokeColor={'navy'}
          strokeWidth={5}
        />
        <Polyline
          coordinates={tMapRouteExceptStairs}
          strokeColor={'purple'}
          strokeWidth={5}
        />
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
