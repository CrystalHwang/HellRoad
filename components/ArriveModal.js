import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, Text, Modal, TouchableHighlight } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';

import * as actions from '../actions';
import { COLOR, MESSAGE } from '../constants';
const { width, height } = Dimensions.get('window');

const ArriveModal = ({ handleClickNavigationCancelButton, isDangerInDestination }) => {
  const [isShowModal, setIsShowModal] = useState(true);
  const arriveMassage = MESSAGE.ARRIVE;
  const additionalMessage = isDangerInDestination ? MESSAGE.ARRIVE_IN_DANGER_LOCATION : MESSAGE.ARRIVE_IN_SAFE_LOCATION;

  const backgroundColorOfModal = isDangerInDestination ? COLOR.MAIN_RED : COLOR.LIGHT_BLUE;
  const colorOfModal = isDangerInDestination ? COLOR.WHITE : 'black';

  const dispatch = useDispatch();

  const handleClickFinishButton = () => {
    setIsShowModal(false);
    handleClickNavigationCancelButton();
  };

  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowModal}
        onRequestClose={() => {
          dispatch(actions.updateFinishState({ navigate: true }));
          setIsShowModal(false);
        }}>
        <View style={styles.modalViewContainer}>
          <View style={{ ...styles.modalView, backgroundColor: backgroundColorOfModal }}>
            <View style={styles.modalTextContainer}>
              <Text style={{ ...styles.modalTitleText, color: colorOfModal }}>{arriveMassage}</Text>
              <Text style={{ ...styles.modalSubText, color: colorOfModal }}> {additionalMessage}</Text>
            </View>
            <TouchableHighlight
              style={styles.finishButton}
              onPress={handleClickFinishButton}>
              <Text style={styles.finishTextStyle}>길 안내 종료</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal >
    </View >
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.CLEAR_GREY,
  },
  modalView: {
    width: '80%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  finishButton: {
    width: '60%',
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalTextContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 28,
  },
  modalSubText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
  },
  finishTextStyle: {
    width: '100%',
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default ArriveModal;
