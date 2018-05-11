// react library
import React from 'react';

// third-party libraries
import { StackNavigator, TabNavigator } from 'react-navigation';

// containers
import { RequestPage } from '../container';

export const RequestHome = StackNavigator({
  RequestPage: {
    screen: RequestPage,
    navigationOptions: {
      header: null,
    }
  },
}, {
  navigationOptions: {
    header: 'screen',
  },
});

export const Tabs = TabNavigator({
  RequestHome: {
    screen: RequestHome,
    navigationOptions: {
      tabBarLabel: 'RIDES',
      color: 'white',
      style: {
        color: '#004a80',
      },
    },
  },
}, {
  // tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    showIcon: true,
    style: {
      backgroundColor: 'white',
      padding: 2,
      // tabBarLabelColor: ''
      // marginTop: STATUS_BAR_HEIGHT
    },
    indicatorStyle: {
      borderBottomColor: 'black',
      // borderBottomColor: '#ffffff',
      // borderBottomWidth: 1,
      backgroundColor:'black'
    },
    tabStyle: {
      borderRightColor: 'white',
      borderRightWidth: 1,
    },
    activeTintColor: 'black',
    inactiveTintColor: '#b3b4b4',
    animationEnabled: true,
  },
});