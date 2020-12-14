import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Dimensions, Button, Image, TouchableHighlight, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CovidNoticeBoard from '../components/CovidNoticeBoard';
import CurrentLocationMarker from '../components/CurrentLocationMarker';
import DangerCircle from '../components/DangerCircle';

import getCovidStatusData from '../utils/scraper';
import { COLOR } from '../constants';
import covidMockData from '../covidMockData.json';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [covidStatusData, setCovidStatusData] = useState([]);
  const currentLocation = useSelector(state => state.locationReducer);
  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      const data = await getCovidStatusData();
      setCovidStatusData(data);
    })();
  }, []);

  const animateToRegion = () => {
    let region = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    mapRef.current.animateToRegion(region, 1000);
  };

  return (
    <View style={styles.container}>
      <CovidNoticeBoard />
      <View style={styles.wrap}>
        <TouchableHighlight
          style={styles.currentLocationContainer}
          onPress={animateToRegion}>
          <View style={styles.currentLocation}>
            <Icon
              name="map-marker-alt"
              style={styles.locationIcon}
              onPress={animateToRegion} />
          </View>
        </TouchableHighlight>
        <MapView
          style={styles.map}
          ref={mapRef}
          maxZoomLevel={25}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          clusterColor={COLOR.LIGHT_RED}
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
        </MapView>
        <Button
          title='안전 경로 찾기'
          color={COLOR.DARK_BLUE}
          onPress={() => navigation.navigate('Search')}>
        </Button>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  covidNoticeBoard: {
    width: width * 0.8,
    height: height * 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    width: width * 0.8,
    height: height * 0.6
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

export default HomeScreen;
