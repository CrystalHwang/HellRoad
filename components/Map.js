import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, TouchableHighlight } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CurrentLocationMarker from '../components/CurrentLocationMarker';
import DangerCircle from '../components/DangerCircle';
import Route from '../components/Route';

import covidMockData from '../covidMockData.json';
import getCovidStatusData from '../utils/scraper';
import { COLOR, DELTA, MAP_MODE } from '../constants';

const { width, height } = Dimensions.get('window');

const Map = ({
  searchMode,
  originName,
  destinationName,
  isClickedSearchButton,
  setIsClickedSearchButton,
  isDoneGettingRouteData
}) => {
  const currentLocation = useSelector(state => state.locationReducer.current);
  const originLocation = useSelector(state => state.locationReducer.origin);
  const isLoadingRoutes = useSelector(state => state.loadingReducer.routes);

  const [covidStatusData, setCovidStatusData] = useState([]);

  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      const data = await getCovidStatusData();
      setCovidStatusData(data);
    })();
  }, []);

  useEffect(() => {
    mapRef.current.animateToRegion({
      'latitude': originLocation.latitude,
      'longitude': originLocation.longitude,
      'latitudeDelta': DELTA.LATITUDE_FOR_SMALL,
      'longitudeDelta': DELTA.LONGITUDE_FOR_SMALL
    }, 1000);
  }, [isLoadingRoutes]);

  const moveToCurrentLocation = () => {
    let region = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: DELTA.LATITUDE_FOR_BIG,
      longitudeDelta: DELTA.LONGITUDE_FOR_BIG
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  const handleChangeRegionOnMap = useCallback((region, markers) => {
    console.log("태민이", region, markers.length);
  }, []);



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
        maxZoomLevel={18}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: DELTA.LATITUDE_FOR_SMALL,
          longitudeDelta: DELTA.LONGITUDE_FOR_SMALL
        }}
        showsUserLocation={true}
        showsBuildings={true}
        clusterColor={COLOR.LIGHT_RED}
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
          searchMode
            ? <Route
              originName={originName}
              destinationName={destinationName} />
            : null
        }
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%'
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
    height: '100%'
  }
});

export default Map;
