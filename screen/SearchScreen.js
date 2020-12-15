import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, Dimensions, Alert, Button, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { COLOR, MAP_MODE, MESSAGE } from '../constants';
import { getLatLngFromAddress, getRoutesFromAPIs } from '../api';

import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import * as actions from '../actions';

const { width, height } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const currentLocation = useSelector(state => state.locationReducer.current);
  const originLocation = useSelector(state => state.locationReducer.origin);
  const destinationLocation = useSelector(state => state.locationReducer.destination);
  const dispatch = useDispatch();

  const [originState, setOriginState] = useState({ ...originLocation });
  const [destinationState, setDestinationState] = useState({ ...destinationLocation });

  const [isLoading, setIsLoading] = useState(true);
  const [isShowLoadingSpinner, setIsShowLoadingSpinner] = useState(false);
  const [isDoneGettingRouteData, setIsDoneGettingRouteData] = useState(false);
  const [isClickedSearchButton, setIsClickedSearchButton] = useState(false);

  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');

  const [mapMode, setMapMode] = useState(MAP_MODE.SEARCH);


  useEffect(() => {
    if ((originState.latitude !== originLocation.latitude) || (originState.longitude !== originLocation.longitude)) return;

    if ((destinationState.latitude !== destinationLocation.latitude) || (destinationState.longitude !== destinationLocation.longitude)) return;

    if (!isClickedSearchButton) return;

    (async () => {
      console.log('따뜻한겨울');
      const routes = await getRoutesFromAPIs(originLocation, destinationLocation, originName, destinationName);

      dispatch(actions.updateMapBoxRoute(routes.mapBoxRoute));
      dispatch(actions.updateMapQuestRoute(routes.mapQuestRoute));
      dispatch(actions.updateTMapRouteDefault(routes.tMapRouteDefault));
      dispatch(actions.updateTMapRouteBigRoad(routes.tMapRouteBigRoad));
      dispatch(actions.updateTMapRouteShortest(routes.tMapRouteShortest));
      dispatch(actions.updateTMapRouteExceptStairs(routes.tMapRouteExceptStairs));

      dispatch(actions.updateIsLoadingRoutes(false));
    })();

    setIsClickedSearchButton(false);
    setIsDoneGettingRouteData(true);
    setIsShowLoadingSpinner(false);
  }, [originState, destinationState]);

  useEffect(() => {
    if (!isClickedSearchButton) return;

    setIsShowLoadingSpinner(true);
    dispatch(actions.updateIsLoadingRoutes(true));

    (async () => {
      const originLatLng = await getLatLngFromAddress(originName);
      dispatch(actions.updateOriginLocation(originLatLng));

      const destinationLatLng = await getLatLngFromAddress(destinationName);
      dispatch(actions.updateDestinationLocation(destinationLatLng));

      setOriginState(originLatLng);
      setDestinationState(destinationLatLng);
    })();

  }, [isClickedSearchButton]);

  const handleClickSearchButton = async () => {
    if (!originName) {
      return Alert.alert(MESSAGE.DEPARTURE_SKIPPED);
    }

    if (!destinationName) {
      return Alert.alert(MESSAGE.DESTINATION_SKIPPED);
    }

    Keyboard.dismiss();
    setIsClickedSearchButton(true);
  };

  const handleClickStartButton = () => {
    //valid check -> 내 위치와 출발지가 너무 멀 경우 거부 알람! 해주기 
    // 
    setMapMode(MAP_MODE.WALKING);

    //navigation.navigate('Walking');
  };

  return (
    isLoading
      ?
      <TouchableWithoutFeedback
        style={styles.screenContainerForKeyboardDismiss}
        onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {
            mapMode === MAP_MODE.SEARCH
              ?
              <View style={styles.searchBarWrapper}>
                <View style={styles.searchInputWrapper}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="출발지"
                    onChangeText={text => setOriginName(text)}
                    defaultValue={originName}
                    paddingLeft={10} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="도착지"
                    onChangeText={text => setDestinationName(text)}
                    defaultValue={destinationName}
                    paddingLeft={10}
                  />
                  {/* <SearchBar /> */}
                </View>
                <View style={styles.searchButton}>
                  <Button
                    title="길찾기"
                    onPress={handleClickSearchButton} />
                </View>
              </View>
              : null
          }
          <Spinner
            visible={isShowLoadingSpinner}
            textContent={'길을 찾고 있어요'}
            textStyle={styles.spinner}
            animation='fade'
            color='blue'
            size='large'
          />
          <Map
            searchMode={true}
            originName={originName}
            destinationName={destinationName}
            isClickedSearchButton={isClickedSearchButton}
            setIsClickedSearchButton={setIsClickedSearchButton}
            isDoneGettingRouteData={isDoneGettingRouteData} />
          {
            isDoneGettingRouteData && mapMode === MAP_MODE.SEARCH
              ?
              <TouchableOpacity
                style={styles.startButtonContainer}
                onPress={handleClickStartButton}>
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
  screenContainer: {
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
    backgroundColor: COLOR.LIGHT_GREY,
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
    borderBottomColor: COLOR.DARK_GREY,
    borderBottomWidth: 1,
    color: COLOR.DARK_BLUE,
  },
  searchButton: {
    width: '15%',
    height: '80%',
    justifyContent: 'flex-end',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  spinner: {
    color: COLOR.LIGHT_BLUE,
    backgroundColor: COLOR.DARK_GREY,
  },
  startButtonContainer: {
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
