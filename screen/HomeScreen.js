import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Dimensions, Button, Image } from 'react-native';
import MapView from 'react-native-maps';

import CovidNoticeBoard from '../components/CovidNoticeBoard';
import CurrentLocationMarker from '../components/CurrentLocationMarker';

import getCovidStatusData from '../utils/scraper';
import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [covidStatusData, setCovidStatusData] = useState([]);
  const currentLocation = useSelector(state => state.locationReducer);

  useEffect(() => {
    (async () => {
      const data = await getCovidStatusData();
      setCovidStatusData(data);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <CovidNoticeBoard />
      <View style={styles.wrap}>
        <MapView
          style={styles.map}
          maxZoomLevel={20}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0.009
          }}
          region={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0.009,
          }}>
          <CurrentLocationMarker />
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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  covidNoticeBoard: {
    width: width * 0.8,
    height: height * 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue'
  },
  wrap: {
    width: width * 0.8,
    height: height * 0.6
  },
  map: {
    width: '100%',
    height: '100%'
  },
  searchButton: {
    backgroundColor: 'red',
  }
});

export default HomeScreen;
