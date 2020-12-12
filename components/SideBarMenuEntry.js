import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { COLOR } from '../constants';

const { width, height } = Dimensions.get('window');
const drawerNavigatorWidth = width * 0.8;

const SideBarMenuEntry = ({ navigation }) => {
  const menuEntryArray = [
    { 'screenName': 'Home', 'icon': 'home' },
    { 'screenName': 'COVID-19 Zone', 'icon': 'skull-crossbones' },
    { 'screenName': 'Crime Zone', 'icon': 'exclamation-triangle' },
    { 'screenName': 'About', 'icon': 'address-card' }
  ];

  const handleTextPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <>
      {
        menuEntryArray.map((menu, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.menuEntryContainer}
              activeOpacity={0.3}
              onPress={() => handleTextPress(`${menu.screenName}`)}>
              <View style={styles.iconContainer}>
                <Icon
                  name={menu.icon}
                  size={25}
                  color={COLOR.DARK_RED} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{menu.screenName}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      }
    </>
  );
};

const styles = StyleSheet.create({
  menuEntryContainer: {
    width: drawerNavigatorWidth * 0.9,
    height: 70,
    borderBottomColor: COLOR.MAIN_GREY,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconContainer: {
    width: drawerNavigatorWidth * 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textContainer: {
    width: drawerNavigatorWidth * 0.7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.DARK_RED,
  }
});

export default SideBarMenuEntry;
