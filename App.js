// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';

// screens
import { LandingPage, SignInPage, SignUpPage, MoovPages } from './src/screen';

// component
import { SignUpScreenTwo, SignUpScreenThree } from './src/component/SignUp';

export default MainStack = StackNavigator({
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
  SignUpPage: {
    screen: SignUpPage,
    navigationOptions: {
      header: null,
    }
  },
  SignUpScreenTwo: {
    screen: SignUpScreenTwo,
    navigationOptions: {
      header: null,
    }
  },
  SignUpScreenThree: {
    screen: SignUpScreenThree,
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
