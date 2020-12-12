import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, useWindowDimensions, Alert, Button } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';

import { COLOR, USER_LOCATION, DESTINATION } from '../constants';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.covidNoticeBoard}>
        <Text> 코로나 대응 2.5단계 </Text>
      </View>
      <View style={styles.wrap}>
        <MapView
          style={styles.map}
          maxZoomLevel={20}
          initialRegion={{
            latitude: USER_LOCATION.LATITUDE,
            longitude: USER_LOCATION.LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0.009
          }}
        >
          <Polyline
            coordinates={[
              { latitude: 37.50610, longitude: 127.05913 },
              { latitude: 37.50885, longitude: 127.06279 },
            ]}
            strokeColor={'red'}
            strokeWidth={6}
          />
          <Circle
            key='1'
            center={{
              latitude: USER_LOCATION.LATITUDE,
              longitude: USER_LOCATION.LONGITUDE
            }}
            fillColor={'rgba(194,24,7,0.5)'}
            radius={200}
            strokeWidth={3}
            strokeColor={'rgb(194,24,7)'}
          />
          <Marker
            coordinate={{
              latitude: USER_LOCATION.LATITUDE,
              longitude: USER_LOCATION.LONGITUDE
            }}
          />
        </MapView>

        <Button
          title="안전경로찾기"
          onPress={() => {
            navigation.navigate('Search');
          }}>
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
  }
});

export default HomeScreen;