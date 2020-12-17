import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, TouchableHighlight } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CurrentLocationMarker from '../components/CurrentLocationMarker';
import DangerCircle from '../components/DangerCircle';
import Route from '../components/Route';

import * as actions from '../actions';
import covidMockData from '../covidMockData.json';
import getCovidStatusData from '../utils/scraper';
import { COLOR, DELTA, MAP_MODE, APIs } from '../constants';

const { width, height } = Dimensions.get('window');

const Map = ({
  mode,
  originName,
  destinationName,
  isShowLoadingSpinner
}) => {
  const currentLocation = useSelector(state => state.locationReducer.current);
  const originLocation = useSelector(state => state.locationReducer.origin);
  const isLoadingRoutes = useSelector(state => state.loadingReducer.routes);

  const boundingBoxOfMapBoxRoute = useSelector(state => state.routesReducer.mapBox.boundingBox);
  const boundingBoxOfMapQuestRoute = useSelector(state => state.routesReducer.mapQuest.boundingBox);
  const boundingBoxOfTMapRouteDefault = useSelector(state => state.routesReducer.tMapDefault.boundingBox);
  const boundingBoxOfTMapRouteBigRoad = useSelector(state => state.routesReducer.tMapBigRoad.boundingBox);
  const boundingBoxOfTMapRouteShortest = useSelector(state => state.routesReducer.tMapShortest.boundingBox);
  const boundingBoxOfTMapRouteExceptStairs = useSelector(state => state.routesReducer.tMapExceptStairs.boundingBox);

  const dispatch = useDispatch();

  const [covidStatusData, setCovidStatusData] = useState([]);
  const [markersOnMap, setMarkersOnMap] = useState();
  const [nameOfRenderingRoute, setNameOfRenderingRoute] = useState();


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
      latitude: originLocation.latitude,
      longitude: originLocation.longitude,
      latitudeDelta: DELTA.LATITUDE_FOR_SMALL,
      longitudeDelta: DELTA.LONGITUDE_FOR_SMALL
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  const handleChangeRegionOnMap = useCallback((region, markers) => {
    console.log("태민이", region, markers.length);
    console.log(markers);
    //여기서 마커 정보 저장하고 나서, 그거를 유즈셀렉터로 다 비교하고... 띄울 라우트 모드만 라우트에 넘겨주자

    switch (mode) {
      case MAP_MODE.SERARCH:
        const arrayOfDanger = [];

        markers.forEach((marker, index) => {
          const longitude = marker.geometry.coordinates[0];
          const latitude = marker.geometry.coordinates[1];

          const latlng = { latitude, longitude };
          arrayOfDanger.push(latlng);
        });

        return dispatch(actions.updateDangerLocations(arrayOfDanger));


      case MAP_MODE.WALKING:
      // markers.forEach((marker, index) => {
      //   if (marker.)
      //  });
    }
  }, []);

  useEffect(() => {
    if (!markersOnMap) return;

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

      if (boundingBoxOfMapBoxRoute.left < longitude && longitude < boundingBoxOfMapBoxRoute.right) {
        if (boundingBoxOfMapBoxRoute.down < latitude && latitude < boundingBoxOfMapBoxRoute.up) {
          if (marker.properties.point_count === 0) {
            countOfMapBox++;
          } else {
            countOfMapBox += marker.properties.point_count;
          }

          minCount = minCount > countOfMapBox ? countOfMapBox : minCount;
          nameOfMinDangerRoute = APIs.MAP_BOX;
        }
      }

      if (boundingBoxOfMapQuestRoute.left < longitude && longitude < boundingBoxOfMapQuestRoute.right) {
        if (boundingBoxOfMapQuestRoute.down < latitude && latitude < boundingBoxOfMapQuestRoute.up) {
          if (marker.properties.point_count === 0) {
            countOfMapQuest++;
          } else {
            countOfMapQuest += marker.properties.point_count;
          }

          minCount = minCount > countOfMapQuest ? countOfMapQuest : minCount;
          nameOfMinDangerRoute = APIs.MAP_QUEST;
        }
      }

      if (boundingBoxOfTMapRouteDefault.left < longitude && longitude < boundingBoxOfTMapRouteDefault.right) {
        if (boundingBoxOfTMapRouteDefault.down < latitude && latitude < boundingBoxOfTMapRouteDefault.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapDefault++;
          } else {
            countOfTMapDefault += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapDefault ? countOfTMapDefault : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_DEFAULT;
        }
      }

      if (boundingBoxOfTMapRouteBigRoad.left < longitude && longitude < boundingBoxOfTMapRouteBigRoad.right) {
        if (boundingBoxOfTMapRouteBigRoad.down < latitude && latitude < boundingBoxOfTMapRouteBigRoad.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapBigRoad++;
          } else {
            countOfTMapBigRoad += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapBigRoad ? countOfTMapBigRoad : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_BIGROAD;
        }
      }

      if (boundingBoxOfTMapRouteShortest.left < longitude && longitude < boundingBoxOfTMapRouteShortest.right) {
        if (boundingBoxOfTMapRouteShortest.down < latitude && latitude < boundingBoxOfTMapRouteShortest.up) {

          if (marker.properties.point_count === 0) {
            countOfTMapShortest++;
          } else {
            countOfTMapShortest += marker.properties.point_count;
          }

          minCount = minCount > countOfTMapShortest ? countOfTMapShortest : minCount;
          nameOfMinDangerRoute = APIs.T_MAP_SHORTEST;
        }
      }

      if (boundingBoxOfTMapRouteExceptStairs.left < longitude && longitude < boundingBoxOfTMapRouteExceptStairs.right) {
        if (boundingBoxOfTMapRouteExceptStairs.down < latitude && latitude < boundingBoxOfTMapRouteExceptStairs.up) {

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
      setNameOfRenderingRoute(APIs.T_MAP_DEFAULT);
    } else {
      setNameOfRenderingRoute(nameOfMinDangerRoute);
    }
  }, [markersOnMap]);

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
        onMarkersChange={(markers) => console.log("Markers", markers)}
        onRegionChange={(region) => {
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
              <Marker
                key={index}
                coordinate={{
                  latitude: latlng[0],
                  longitude: latlng[1]
                }}>
                <Icon
                  name='skull'
                  size={15}
                  color={COLOR.MAIN_RED} />
              </Marker>
            );
          })
        }
        {
          mode !== MAP_MODE.HOME
            ? <Route
              mode={mode}
              originName={originName}
              destinationName={destinationName}
              nameOfRenderingRoute={nameOfRenderingRoute} />
            : null
        }
      </MapView>
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
