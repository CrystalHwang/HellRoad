import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

const Home = () => {
  return (
    <View style={styles.touch}>
      <Text>HOME</Text>
    </View>
  );
};

const Detail = () => {
  return (
    <View>
      <Text>Detail</Text>
    </View>
  );
};


const About = () => {
  return (
    <View>
      <Text>About</Text>
    </View>
  );
};

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    Detail: {
      screen: Detail,
      navigationOptions: {
        drawerLabel: 'Detail',
      },
    },
    About: {
      screen: About,
      navigationOptions: {
        drawerLabel: 'About',
      },
    },
  },
  {
    drawerWidth: Dimensions.get('window').width - 200,
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touch: {
    flex: 0.3,
    backgroundColor: 'red',
    flexDirection: 'row',
    width: 500,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

//export default createAppContainer(DrawerNavigator);
export default DrawerNavigator;
