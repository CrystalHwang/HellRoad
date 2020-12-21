import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, TouchableHighlight } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CurrentLocationMarker from '../components/CurrentLocationMarker';
import Route from '../components/Route';
import OptimalRoute from '../components/OptimalRoute';
import AlertDanger from '../components/AlertDanger';
import ArriveModal from '../components/ArriveModal';
import ChangeColor from '../components/ChangeColor';

import * as actions from '../actions';
import covidMockData from '../covidMockData.json';
import getCovidStatusData from '../utils/scraper';
import { getTheNearestDangerousPoint, getDistanceFromDestination } from '../utils';
import { COLOR, DELTA, MAP_MODE, APIs, DEFAULT_LOCATION } from '../constants';

const { width, height } = Dimensions.get('window');

const Map = ({
  mode,
  originName,
  destinationName,
  isShowLoadingSpinner,
  isDoneGettingRouteData,
  isDoneToNavigate,
  setIsDoneSaveDangerData,
  handleClickNavigationCancelButton,
}) => {
  const mapModeInStore = useSelector(state => state.mapModeReducer);
  const isStartNavigate = useSelector(state => state.startReducer.navigate);
  const isFinishNavigate = useSelector(state => state.finishReducer.navigate);
  const nearestDangerDistance = useSelector(state => state.nearestDangerReducer.distance);

  const currentLocation = useSelector(state => state.locationReducer.current);
  const originLocation = useSelector(state => state.locationReducer.origin);
  const destinationLocation = useSelector(state => state.locationReducer.destination);
  const isLoadingRoutes = useSelector(state => state.loadingReducer.routes);

  const mapBoxRoute = useSelector(state => state.routesReducer.mapBox);
  const mapQuestRoute = useSelector(state => state.routesReducer.mapQuest);
  const tMapRouteDefault = useSelector(state => state.routesReducer.tMapDefault);
  const tMapRouteBigRoad = useSelector(state => state.routesReducer.tMapBigRoad);
  const tMapRouteShortest = useSelector(state => state.routesReducer.tMapShortest);
  const tMapRouteExceptStairs = useSelector(state => state.routesReducer.tMapExceptStairs);

  const dispatch = useDispatch();

  const [covidStatusData, setCovidStatusData] = useState([]);
  const [markersOnMap, setMarkersOnMap] = useState([]);
  const [isStartedGuidingRoute, setIsStartedGuidingRoute] = useState(false);
  const [isNotifyDanger, setIsNotifyDanger] = useState(false);
  const [isShowArriveModal, setIsShowArriveModal] = useState(false);
  const [isDangerInDestination, setIsDangerInDestination] = useState(false);

  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      const data = await getCovidStatusData();
      setCovidStatusData(data);
    })();
  }, []);

  useEffect(() => {
    if (isShowLoadingSpinner || isLoadingRoutes) return;

    moveToOriginLocation();
  }, [isLoadingRoutes, isShowLoadingSpinner]);

  const moveToCurrentLocation = () => {
    const region = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: DELTA.LATITUDE_FOR_BIG,
      longitudeDelta: DELTA.LONGITUDE_FOR_BIG
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  const moveToOriginLocation = () => {
    const region = {
      latitude: originLocation.latitude ? originLocation.latitude : currentLocation.latitude,
      longitude: originLocation.longitude ? originLocation.longitude : currentLocation.longitude,
      latitudeDelta: DELTA.LATITUDE_FOR_SMALL,
      longitudeDelta: DELTA.LONGITUDE_FOR_SMALL
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  const showCurrentLocationForSmall = () => {
    const region = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: DELTA.LATITUDE_FOR_SMALL,
      longitudeDelta: DELTA.LONGITUDE_FOR_SMALL
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  const initialize = () => {
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

    dispatch(actions.updateMapBoxRoute(initialConfig));
    dispatch(actions.updateMapQuestRoute(initialConfig));
    dispatch(actions.updateTMapRouteDefault(initialConfig));
    dispatch(actions.updateTMapRouteBigRoad(initialConfig));
    dispatch(actions.updateTMapRouteExceptStairs(initialConfig));
    dispatch(actions.updateTMapRouteShortest(initialConfig));

    dispatch(actions.updateOriginLocation(currentLocation));
    dispatch(actions.updateDestinationLocation(currentLocation));

    const initialState = {
      distance: '',
      location: {
        latitude: '',
        longitude: ''
      }
    };

    dispatch(actions.updateNearestDangerLocation(initialState));

    dispatch(actions.updateStartState({ navigate: false }));
    dispatch(actions.updateFinishState({ navigate: false }));
  };

  useEffect(() => {
    if (mapModeInStore === MAP_MODE.HOME) return;

    if (!isFinishNavigate) return;

    showCurrentLocationForSmall();
    initialize();
  }, [isFinishNavigate]);

  const handleChangeRegionOnMap = useCallback((region, markers) => {
    switch (mapModeInStore) {
      case MAP_MODE.HOME:
        return;

      case MAP_MODE.SEARCH:
        if (isStartNavigate && !nearestDangerDistance) {
          setMarkersOnMap(markers);

          const dangerLocation = getTheNearestDangerousPoint(currentLocation, markers);
          const { minDistance, nearestLocation } = dangerLocation;

          setIsStartedGuidingRoute(true);

          dispatch(actions.updateNearestDangerLocation(dangerLocation));
          moveToCurrentLocation();
        }

        return;

      case MAP_MODE.WALKING:
        return;

    }
  }, [isStartNavigate]);


  useEffect(() => {
    if (mapModeInStore === MAP_MODE.SEARCH) {
      setIsNotifyDanger(false);
    }

    if (mapModeInStore !== MAP_MODE.WALKING) return;

    if (!nearestDangerDistance) {
      moveToCurrentLocation();
      return;
    }

    const remainingDistance = getDistanceFromDestination(currentLocation, destinationLocation);

    if (remainingDistance < 70) {
      setIsNotifyDanger(false);
      if (nearestDangerDistance < 100) {
        setIsShowArriveModal(true);
        setIsDangerInDestination(true);
      } else {
        setIsShowArriveModal(true);
      }
      return;
    }

    if (nearestDangerDistance < 100) {
      setIsNotifyDanger(true);
    } else {
      setIsNotifyDanger(false);
    }
  }, [mapModeInStore, nearestDangerDistance, isStartNavigate]);

  useEffect(() => {
    if (mapModeInStore !== MAP_MODE.SEARCH) return;

    if (!isDoneGettingRouteData) return;

    let countOfMapBox = 0;
    let countOfMapQuest = 0;
    let countOfTMapDefault = 0;
    let countOfTMapBigRoad = 0;
    let countOfTMapShortest = 0;
    let countOfTMapExceptStairs = 0;
    let minCount = 9999;
    let nameOfMinDangerRoute = APIs.T_MAP_DEFAULT;

    markersOnMap.forEach((marker) => {
      const longitude = marker.geometry.coordinates[0];
      const latitude = marker.geometry.coordinates[1];

      if (mapBoxRoute.boundingBox.left < longitude && longitude < mapBoxRoute.boundingBox.right) {
        if (mapBoxRoute.boundingBox.down < latitude && latitude < mapBoxRoute.boundingBox.up) {
          if (marker.properties.point_count === 0) {
            countOfMapBox++;
          } else {
            countOfMapBox += marker.properties.point_count;
          }

          minCount = minCount > countOfMapBox ? countOfMapBox : minCount;
          nameOfMinDangerRoute = APIs.MAP_BOX;
        }
      }

      if (mapQuestRoute.boundingBox.left < longitude && longitude < mapQuestRoute.boundingBox.right) {
        if (mapQuestRoute.boundingBox.down < latitude && latitude < mapQuestRoute.boundingBox.up) {
          if (marker.properties.point_count === 0) {
            countOfMapQuest++;
          } else {
            countOfMapQuest += marker.properties.point_count;
          }

          minCount = minCount > countOfMapQuest ? countOfMapQuest : minCount;
          nameOfMinDangerRoute = APIs.MAP_QUEST;
        }
      }

      if (tMapRouteDefault.boundingBox.left < longitude && longitude < tMapRouteDefault.boundingBox.right) {
        if (tMapRouteDefault.boundingBox.down < latitude && latitude < tMapRouteDefault.boundingBox.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapDefault++;
          } else {
            countOfTMapDefault += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapDefault ? countOfTMapDefault : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_DEFAULT;
        }
      }

      if (tMapRouteBigRoad.boundingBox.left < longitude && longitude < tMapRouteBigRoad.boundingBox.right) {
        if (tMapRouteBigRoad.boundingBox.down < latitude && latitude < tMapRouteBigRoad.boundingBox.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapBigRoad++;
          } else {
            countOfTMapBigRoad += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapBigRoad ? countOfTMapBigRoad : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_BIGROAD;
        }
      }

      if (tMapRouteShortest.boundingBox.left < longitude && longitude < tMapRouteShortest.boundingBox.right) {
        if (tMapRouteShortest.boundingBox.down < latitude && latitude < tMapRouteShortest.boundingBox.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapShortest++;
          } else {
            countOfTMapShortest += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapShortest ? countOfTMapShortest : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_SHORTEST;
        }
      }

      if (tMapRouteExceptStairs.boundingBox.left < longitude && longitude < tMapRouteExceptStairs.boundingBox.right) {
        if (tMapRouteExceptStairs.boundingBox.down < latitude && latitude < tMapRouteExceptStairs.boundingBox.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapExceptStairs++;
          } else {
            countOfTMapExceptStairs += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapExceptStairs ? countOfTMapExceptStairs : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_EXCEPT_STAIRS;
        }
      }
    });

    if (minCount === 9999) {
      dispatch(actions.updateNavigationDatas({
        distance: tMapRouteDefault.distance,
        duration: tMapRouteDefault.duration,
        numOfDanger: tMapRouteDefault.countOfDanger,
        nameOfAPI: APIs.T_MAP_DEFAULT
      }));
    } else {
      (() => {
        switch (nameOfMinDangerRoute) {
          case APIs.MAP_BOX:
            return dispatch(actions.updateNavigationDatas({
              distance: mapBoxRoute.distance,
              duration: mapBoxRoute.duration,
              numOfDanger: mapBoxRoute.countOfDanger,
              nameOfAPI: APIs.MAP_BOX
            }));

          case APIs.MAP_QUEST:
            return dispatch(actions.updateNavigationDatas({
              distance: mapQuestRoute.distance,
              duration: mapQuestRoute.duration,
              numOfDanger: mapQuestRoute.countOfDanger,
              nameOfAPI: APIs.MAP_QUEST
            }));

          case APIs.T_MAP_DEFAULT:
            return dispatch(actions.updateNavigationDatas({
              distance: tMapRouteDefault.distance,
              duration: tMapRouteDefault.duration,
              numOfDanger: tMapRouteDefault.countOfDanger,
              nameOfAPI: APIs.T_MAP_DEFAULT
            }));

          case APIs.T_MAP_BIGROAD:
            return dispatch(actions.updateNavigationDatas({
              distance: tMapRouteBigRoad.distance,
              duration: tMapRouteBigRoad.duration,
              numOfDanger: tMapRouteBigRoad.countOfDanger,
              nameOfAPI: APIs.T_MAP_BIGROAD
            }));

          case APIs.T_MAP_SHORTEST:
            return dispatch(actions.updateNavigationDatas({
              distance: tMapRouteShortest.distance,
              duration: tMapRouteShortest.duration,
              numOfDanger: tMapRouteShortest.countOfDanger,
              nameOfAPI: APIs.T_MAP_SHORTEST
            }));

          case APIs.T_MAP_EXCEPT_STAIRS:
            return dispatch(actions.updateNavigationDatas({
              distance: tMapRouteExceptStairs.distance,
              duration: tMapRouteExceptStairs.duration,
              numOfDanger: tMapRouteExceptStairs.countOfDanger,
              nameOfAPI: APIs.T_MAP_ExceptStairs
            }));
        }
      })();
    }
  }, [mapModeInStore, markersOnMap]);

  return (
    <View style={styles.mapContainer}>
      <TouchableHighlight
        style={styles.currentLocationContainer}
        onPress={moveToCurrentLocation}>
        <View style={styles.currentLocation}>
          <Icon
            name="map-marker-alt"
            style={styles.locationIcon}
            onPress={moveToCurrentLocation} />
        </View>
      </TouchableHighlight>
      <MapView
        ref={mapRef}
        style={styles.map}
        maxZoomLevel={20}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: DELTA.LATITUDE_FOR_SMALL,
          longitudeDelta: DELTA.LONGITUDE_FOR_SMALL
        }}
        loadingEnabled={true}
        showsBuildings={true}
        showsUserLocation={true}
        tracksViewChanges={true}
        moveOnMarkerPress={false}
        clusterColor={COLOR.LIGHT_RED}
        onRegionChangeComplete={handleChangeRegionOnMap}
        zoomEnabled={mapModeInStore === MAP_MODE.SEARCH ? false : true}
        followsUserLocation={mapModeInStore === MAP_MODE.WALKING ? true : false}>
        <CurrentLocationMarker />
        {
          covidMockData.map((data, index) => {
            const splitString = data.latlng.split(',');
            const latlng = splitString.map((string) => {
              string = string.trim();
              return Number(string);
            });

            return (
              <Marker key={index} coordinate={{ latitude: latlng[0], longitude: latlng[1] }}>
                <Icon name='skull' size={15} color={COLOR.MAIN_RED} />
              </Marker>
            );
          })
        }
        {
          originLocation && destinationLocation
            ?
            <>
              <Marker title={originName} coordinate={originLocation}>
                <Icon name='flag' style={styles.originIcon} />
              </Marker>
              <Marker title={destinationName} coordinate={destinationLocation}>
                <Icon name='flag-checkered' style={styles.destinationIcon} />
              </Marker>
            </>
            : null
        }
        {
          mapModeInStore === MAP_MODE.SEARCH
            ? <Route />
            : null
        }
        {
          mapModeInStore === MAP_MODE.WALKING
            ? <OptimalRoute />
            : null
        }
      </MapView>
      {
        mapModeInStore === MAP_MODE.WALKING && isNotifyDanger
          ? <View style={styles.changeColor}>
            <ChangeColor />
            <AlertDanger />
          </View>
          : null
      }
      {
        mapModeInStore === MAP_MODE.WALKING && !isNotifyDanger && isShowArriveModal
          ? <ArriveModal
            handleClickNavigationCancelButton={handleClickNavigationCancelButton}
            isDangerInDestination={isDangerInDestination}
            initialize={initialize} />
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  currentLocationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: 50,
    height: 70,
    borderRadius: 50,
  },
  currentLocation: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  locationIcon: {
    width: 30,
    height: 40,
    color: COLOR.MAIN_BLUE,
    fontSize: 20,
    padding: 3,
  },
  originIcon: {
    fontSize: 20,
    zIndex: 10,
  },
  destinationIcon: {
    fontSize: 20,
    zIndex: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  changeColor: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  }
});

export default Map;
