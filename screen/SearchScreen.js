import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Button, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import MapView, { Marker, MarkerAnimated, Polyline } from 'react-native-maps';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import axios from 'axios';

import { COLOR, USER_LOCATION, DESTINATION, MESSAGE, BACKGROUND_LOCATION_TASK } from '../constants';
import { transformCoordinatesArray, transformCoordinatesArrayForMapQuest, getLatLngFromAPIData, transformCoordinatesArrayForTMap } from '../utils';
import { GOOGLE_API_KEY, MAPBOX_PUBLIC_KEY, MAPQUEST_API_KEY, T_MAP_APP_KEY } from '@env';
import { LOCATION } from 'expo-permissions';

const { width, height } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([{ 'latitude': USER_LOCATION.LATITUDE, 'longitude': USER_LOCATION.LONGITUDE }]);
  const [wayPoints, setWayPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowLoadingSpinner, setIsShowLoadingSpinner] = useState(false);
  const [isDoneGettingRouteData, setIsDoneGettingRouteData] = useState(false);

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureLocation, setDepartureLocation] = useState({});
  const [destinationLocation, setDestinationLocation] = useState({});
  const [focusedLocation, setFocusedLocation] = useState({ 'latitude': USER_LOCATION.LATITUDE, 'longitude': USER_LOCATION.LONGITUDE });

  const [locations, setLocations] = useState([]);
  const [mapquestRoutes, setMapquestRoutes] = useState([]);
  const [tMapRoutes, setTMapRoutes] = useState([]);
  const [tMapRoutes4, setTMapRoutes4] = useState([]);
  const [tMapRoutes10, setTMapRoutes10] = useState([]);
  const [tMapRoutes30, setTMapRoutes30] = useState([]);
  const [boundingBox, setBoundingBox] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {

      setFocusedLocation({
        'latitude': position.coords.latitude,
        'longitude': position.coords.longitude,
        'accuracy': position.coords.accuracy
      });


      //console.log("focusedLocation", focusedLocation);
      setIsLoading(true);
    },
      (err) => { console.error(err); },
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 },
    );
  }, []);

  const getRoutes = async (departureLocation, destinationLocation) => {
    try {

      const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${departureLocation.longitude},${departureLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}?geometries=geojson&access_token=${MAPBOX_PUBLIC_KEY}`);

      const mapquestResponse = await axios.get(`http://www.mapquestapi.com/directions/v2/alternateroutes?key=QH4QoKjva8IQDruhKbIGYNWZQY0AQnXR&from=${departureLocation.latitude},${departureLocation.longitude}&to=${destinationLocation.latitude},${destinationLocation.longitude}&maxRoutes=5&timeOverage=100&routeType=pedestrian`);

      const tmp = transformCoordinatesArrayForMapQuest(mapquestResponse.data.route.shape.shapePoints);
      setMapquestRoutes(tmp);

      const handleCallback = (result) => {
        console.log("t Map", result);
      };

      const tMapResponse = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}`, {
        startX: departureLocation.longitude,
        startY: departureLocation.latitude,
        endX: destinationLocation.longitude,
        endY: destinationLocation.latitude,
        startName: departure,
        endName: destination
      });

      setTMapRoutes(transformCoordinatesArrayForTMap(tMapResponse.data.features));

      const tMapResponse4 = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=4`, {
        startX: departureLocation.longitude,
        startY: departureLocation.latitude,
        endX: destinationLocation.longitude,
        endY: destinationLocation.latitude,
        startName: departure,
        endName: destination
      });
      setTMapRoutes4(transformCoordinatesArrayForTMap(tMapResponse4.data.features));

      const tMapResponse10 = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=10`, {
        startX: departureLocation.longitude,
        startY: departureLocation.latitude,
        endX: destinationLocation.longitude,
        endY: destinationLocation.latitude,
        startName: departure,
        endName: destination
      });
      setTMapRoutes10(transformCoordinatesArrayForTMap(tMapResponse10.data.features));

      const tMapResponse30 = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&searchOption=30`, {
        startX: departureLocation.longitude,
        startY: departureLocation.latitude,
        endX: destinationLocation.longitude,
        endY: destinationLocation.latitude,
        startName: departure,
        endName: destination
      });
      setTMapRoutes30(transformCoordinatesArrayForTMap(tMapResponse30.data.features));


      // const tMapPass = await axios.post(`https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${T_MAP_APP_KEY}&passList=127.04266977305423,37.50230496617563`, {
      //   startX: departureLocation.longitude,
      //   startY: departureLocation.latitude,
      //   endX: destinationLocation.longitude,
      //   endY: destinationLocation.latitude,
      //   startName: departure,
      //   endName: destination
      // });

      // setTMapRoutes(transformCoordinatesArrayForTMap(tMapPass.data.features));


      const arrayOfRoutes = transformCoordinatesArray(response.data.routes[0].geometry.coordinates);

      setRoutes(arrayOfRoutes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickSearchButton = async () => {
    if (!departure) {
      return Alert.alert(MESSAGE.DEPARTURE_SKIPPED);
    }

    if (!destination) {
      return Alert.alert(MESSAGE.DESTINATION_SKIPPED);
    }

    Keyboard.dismiss();

    setIsShowLoadingSpinner(true);
    const departureData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${departure}&key=${GOOGLE_API_KEY}`);
    const departureLatLng = getLatLngFromAPIData(departureData);
    setDepartureLocation(departureLatLng);

    //console.log("DEPARTURE", departureLocation);

    const destinationData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${GOOGLE_API_KEY}`);
    const destinationLatLng = getLatLngFromAPIData(destinationData);
    setDestinationLocation(destinationLatLng);

    //console.log("DESTINATION", destinationLocation);
    // console.log("departure", departure, "destination", destination);

    await getRoutes(departureLatLng, destinationLatLng);

    setFocusedLocation({ 'latitude': departureLatLng.latitude, 'longitude': departureLatLng.longitude });
    setIsDoneGettingRouteData(true);
    setIsShowLoadingSpinner(false);
  };

  const handleClickStartButton = () => {
    //valid check -> 내 위치와 출발지가 너무 멀 경우 거부 알람! 해주기 
    // 
    navigation.navigate('Walking');

  };

  return (
    isLoading
      ?
      <TouchableWithoutFeedback
        style={styles.screenContainerForKeyboardDismiss}
        onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchInputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="출발지"
                onChangeText={text => setDeparture(text)}
                defaultValue={departure}
                paddingLeft={10}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="도착지"
                onChangeText={text => setDestination(text)}
                defaultValue={destination}
                paddingLeft={10}
              />
            </View>
            <View style={styles.searchButton}>
              <Button
                title="길찾기"
                onPress={handleClickSearchButton}
              >
              </Button>
            </View>
          </View>
          <Spinner
            visible={isShowLoadingSpinner}
            textContent={'길을 찾고 있어요'}
            textStyle={styles.spinner}
            animation='fade'
            color='blue'
            size='large'
          />
          <MapView
            style={styles.map}
            maxZoomLevel={20}
            initialRegion={{
              latitude: focusedLocation.latitude,
              longitude: focusedLocation.longitude,
              latitudeDelta: 0,
              longitudeDelta: 0.009
            }}
            region={{
              latitude: focusedLocation.latitude,
              longitude: focusedLocation.longitude,
              latitudeDelta: 0,
              longitudeDelta: 0.009,
              accuracy: focusedLocation.accuracy
            }}
          >
            <Polyline
              coordinates={routes}
              strokeColor={'red'}
              strokeWidth={8}
            />
            <Polyline
              coordinates={mapquestRoutes}
              strokeColor={'blue'}
              strokeWidth={5}
            />
            <Polyline
              coordinates={tMapRoutes}
              strokeColor={'green'}
              strokeWidth={9}
            />
            <Polyline
              coordinates={tMapRoutes4}
              strokeColor={'black'}
              strokeWidth={9}
            />
            <Polyline
              coordinates={tMapRoutes10}
              strokeColor={'purple'}
              strokeWidth={20}
            />
            <Polyline
              coordinates={tMapRoutes30}
              strokeColor={'pink'}
              strokeWidth={5}
            />
            {
              isDoneGettingRouteData
                ? <>
                  <Marker
                    title={departure}
                    coordinate={departureLocation}
                    pinColor={'red'} />
                  <Marker
                    title={destination}
                    coordinate={destinationLocation}
                    pinColor={'blue'} />

                  {mapquestRoutes.map((path, index) => {
                    return (
                      <Marker
                        key={index}
                        title={`${path.latitude}, ${path.longitude}`}
                        coordinate={path}
                        pinColor={'yellow'}
                      />
                    );
                  })}
                  {
                    tMapRoutes.map((path, index) => {
                      return (
                        <Marker
                          key={index}
                          title={`${path.latitude}, ${path.longitude}`}
                          coordinate={path}
                          pinColor={'green'}
                        />
                      );
                    })
                  }
                </>
                : <Marker
                  title='여기 있어요!'
                  coordinate={focusedLocation} />
            }
          </MapView>
          {
            isDoneGettingRouteData
              ?
              <TouchableOpacity
                style={styles.startButtonContainer}
                onPress={handleClickStartButton}
              >
                <Text style={styles.startButtonText}>경로 안내 시작</Text>
              </TouchableOpacity>
              : null
          }
        </View>
      </TouchableWithoutFeedback>
      :
      <View>
        <Spinner
          visible={true}
          textContent={'위치 정보를 가져오고 있어요 :)'}
        ></Spinner>
      </View>
  );
};

const styles = StyleSheet.create({
  screenContainerForKeyboardDismiss: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.MAIN,
    width: width,
    height: height,
  },
  scrrenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.MAIN,
    width: width,
    height: height,
  },
  searchBarWrapper: {
    width: width,
    height: height * 0.15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#98376D',
    color: 'white',
  },
  searchInputWrapper: {
    width: '80%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    color: 'white',
  },
  searchInput: {
    width: '100%',
    height: '40%',
    borderColor: 'grey',
    borderWidth: 1,
    color: 'white'
  },
  searchButton: {
    width: '15%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  spinner: {
    color: 'blue'
  }, startButtonContainer: {
    width: width * 0.8,
    height: 70,
    position: 'absolute',
    top: height * 0.7,
    left: width * 0.5,
    transform: [{ translateX: -width * 0.4 }],
    backgroundColor: COLOR.MAIN,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 25
  },
});

export default SearchScreen;
