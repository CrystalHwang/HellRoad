import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

import SideBarMenuEntry from '../components/SideBarMenuEntry';
import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');
const navigatorWidth = width * 0.8;

const SideBarMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Covid19.png')} style={styles.image} />
      <SideBarMenuEntry navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  image: {
    width: navigatorWidth,
    height: height * 0.3,
  },
});

export default SideBarMenu;
