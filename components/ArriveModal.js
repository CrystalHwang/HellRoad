import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Dimensions, Text, Modal, TouchableHighlight } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
//import Modal from 'react-native-modal';

import * as actions from '../actions';
import { MESSAGE } from '../constants';
const { width, height } = Dimensions.get('window');

const ArriveModal = ({ isDangerInDestination }) => {
  const [isShowModal, setIsShowModal] = useState(true);
  const message = isDangerInDestination ? MESSAGE.ARRIVE_IN_DANGER_LOCATION : MESSAGE.ARRIVE_IN_SAFE_LOCATION;

  console.log("모달 안으로 들어옴");
  const dispatch = useDispatch();
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
          <View style={styles.modalView}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>{message}</Text>
            </View>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setIsShowModal(!isShowModal);
              }}
            >
              <Text style={styles.textStyle}>안내 완료</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalTextContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    width: '100%',
    textAlign: 'center',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default ArriveModal;
