import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Polyline } from 'react-native-maps';
import { MAP_MODE } from '../constants';

const Route = () => {
  const originLocation = useSelector(state => state.locationReducer.origin);
  const destinationLocation = useSelector(state => state.locationReducer.destination);
  const isStartNavigate = useSelector(state => state.startReducer.navigate);
  const isFinishNavigate = useSelector(state => state.finishReducer.navigate);

  const mapBoxRoute = useSelector(state => state.routesReducer.mapBox.route);
  const mapQuestRoute = useSelector(state => state.routesReducer.mapQuest.route);
  const tMapRouteDefault = useSelector(state => state.routesReducer.tMapDefault.route);
  const tMapRouteBigRoad = useSelector(state => state.routesReducer.tMapBigRoad.route);
  const tMapRouteShortest = useSelector(state => state.routesReducer.tMapShortest.route);
  const tMapRouteExceptStairs = useSelector(state => state.routesReducer.tMapExceptStairs.route);

  const mapMode = useSelector(state => state.mapModeReducer);

  const [isMark, setIsMark] = useState(originLocation && destinationLocation ? true : false);
  console.log("값 있어야 합니다", isMark);

  return (
    isMark && mapMode === MAP_MODE.SEARCH && isStartNavigate && !isFinishNavigate
      ? <>
        <Polyline
          coordinates={mapBoxRoute}
          strokeColor={'red'}
          strokeWidth={8} />
        <Polyline
          coordinates={mapQuestRoute}
          strokeColor={'orange'}
          strokeWidth={6}
          zIndex={10} />
        <Polyline
          coordinates={tMapRouteDefault}
          strokeColor={'yellow'}
          strokeWidth={10} />
        <Polyline
          coordinates={tMapRouteBigRoad}
          strokeColor={'green'}
          strokeWidth={8} />
        <Polyline
          coordinates={tMapRouteShortest}
          strokeColor={'navy'}
          strokeWidth={4} />
        <Polyline
          coordinates={tMapRouteExceptStairs}
          strokeColor={'purple'}
          strokeWidth={2} />
      </>
      : null
  );
};

export default Route;
