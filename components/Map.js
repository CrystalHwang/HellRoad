import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, TouchableHighlight } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { Button, Overlay } from 'react-native-elements';
import Modal from 'modal-react-native-web';

import CurrentLocationMarker from '../components/CurrentLocationMarker';
import DangerCircle from '../components/DangerCircle';
import Route from '../components/Route';
import OptimalRoute from '../components/OptimalRoute';
import AlertDanger from '../components/AlertDanger';
import ToastMessage from '../components/ToastMessage';
import ArriveModal from '../components/ArriveModal';

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

}) => {
  const mapModeInStore = useSelector(state => state.mapModeReducer);
  const isStartNavigate = useSelector(state => state.startReducer.navigate);
  const isFinishNavigate = useSelector(state => state.finishReducer.navigate);
  const nearestDangerDistance = useSelector(state => state.nearestDangerReducer.distance);

  console.log("모드", mode);
  console.log("스토어에 저장된 모드", mapModeInStore);
  console.log("스타트 모드", isStartNavigate);
  console.log("피니시 모드", isFinishNavigate);
  console.log("===댄져어어엉====", nearestDangerDistance);

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
    console.log('이게 얼마나 실행되는거얌');
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
    console.log("태민이", region, markers.length);
    //console.log(markers);
    switch (mapModeInStore) {
      case MAP_MODE.HOME:
        return;

      case MAP_MODE.SEARCH:
        alert('저장하려고하는 중인데..');
        if (isStartNavigate && !nearestDangerDistance) {
          setMarkersOnMap(markers);
          console.log('markersOnMap에 저장');
          const dangerLocation = getTheNearestDangerousPoint(currentLocation, markers);
          const { minDistance, nearestLocation } = dangerLocation;

          console.log("가장 가까운 위험한 곳!!!!!!!!!!!!!!", minDistance, nearestLocation);


          setIsStartedGuidingRoute(true);
          //setNearestDangerDistance(minDistance);
          dispatch(actions.updateNearestDangerLocation(dangerLocation));
          moveToCurrentLocation();
          alert('위험한 곳 저장');
          //setIsDoneSaveDangerData(true);
        }

        return;

      case MAP_MODE.WALKING:
        console.log("위험한 곳 저장 했는데!,", nearestDangerDistance);
        return;

    }
  }, [isStartNavigate]);


  useEffect(() => {
    if (mapModeInStore === MAP_MODE.SEARCH) {
      setIsNotifyDanger(false);
    }

    if (mapModeInStore !== MAP_MODE.WALKING) return;
    console.log("모드 확인!!!", isStartNavigate, isFinishNavigate);


    //moveToCurrentLocation();

    //if (isDoneToNavigate) return;
    // if (!isStartedGuidingRoute) return;
    //alert('nearestDanger!');

    // setIsStartedGuidingRoute(true);

    console.log("가까운 곳 판단해깅!", nearestDangerDistance);
    // alert('위험한 곳 저장하고 들어옴...');
    if (!nearestDangerDistance) {
      moveToCurrentLocation();
      return;
    }

    const remainingDistance = getDistanceFromDestination(currentLocation, destinationLocation);
    console.log("남은거리!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", remainingDistance, '위험한거리', nearestDangerDistance);

    // if (isGetDistance) return;
    if (remainingDistance < 70) {
      setIsNotifyDanger(false);
      if (nearestDangerDistance < 100) {
        setIsShowArriveModal(true);
        setIsDangerInDestination(true);
        //alert('다 왔어요! 힘내세요 🏃🏻‍♀️ 조심, 조심, 목적지 주변이 위험해요 😷');
      } else {
        setIsShowArriveModal(true);
        // alert('다 왔어요! 힘내세요 🏃🏻‍♀️ 목적지 주변이 안전합니다 😄');
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
        showsUserLocation={true}
        showsBuildings={true}
        clusterColor={COLOR.LIGHT_RED}
        tracksViewChanges={true}
        followsUserLocation={mapModeInStore === MAP_MODE.WALKING ? true : false}
        zoomEnabled={mapModeInStore === MAP_MODE.SEARCH ? false : true}
        loadingEnabled={true}
        moveOnMarkerPress={false}
        //onMarkersChange={(markers) => console.log("Markers", markers)}
        onRegionChange={(region) => {
          console.log("----------------------------------지도 위치 바뀜----------------------------------", region);
        }}
        onRegionChangeComplete={handleChangeRegionOnMap}
      >
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
        {
          mapModeInStore === MAP_MODE.WALKING && isNotifyDanger
            ? <>
              <AlertDanger />
            </>
            : null
        }
      </MapView>
      {
        mapModeInStore === MAP_MODE.WALKING && !isNotifyDanger && isShowArriveModal
          ? <ArriveModal
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
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
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
    fontSize: 25,
    padding: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  }
});

export default Map;
