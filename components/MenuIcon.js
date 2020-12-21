import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');

const MenuIcon = ({ navigation }) => {
  return (
    <View style={styles.iconContainer}>
      <Icon
        name='bars'
        style={styles.icon}
        onPress={() => navigation.openDrawer()} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: width * 0.15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: COLOR.WHITE,
  }
});

export default MenuIcon;
