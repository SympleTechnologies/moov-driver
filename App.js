// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';
import { Root } from 'native-base';

// screens
import { LandingPage, SignInPage, MoovPages } from './src/screen';

// component
import {FinalPage, FirstPage, SecondPage} from "./src/component/Registration";

const AppNavigator = StackNavigator({
  LandingPage: {
    screen: LandingPage,
    navigationOptions: {
      header: null,
    }
  },
  SignInPage: {
    screen: SignInPage,
    navigationOptions: {
      header: null,
    }
  },
  FirstPage: {
    screen: FirstPage,
    navigationOptions: {
      header: null,
    }
  },
  SecondPage: {
    screen: SecondPage,
    navigationOptions: {
      header: null,
    }
  },
  FinalPage: {
    screen: FinalPage,
    navigationOptions: {
      header: null,
    }
  },
  MoovPages: {
    screen: MoovPages,
    navigationOptions: {
      header: null,
    }
  },
}, {
  navigationOptions: {
    header: 'screen',
  }
});

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
