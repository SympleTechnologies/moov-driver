// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';
import { Root } from 'native-base';

// screens
import { LandingPage, SignInPage } from './src/screen';

// container
import { Homepage } from "./src/container";

// component
import { FinalPage, FirstPage, SecondPage } from "./src/component/Registration";

const AppNavigator = StackNavigator({
  // LandingPage: {
  //   screen: LandingPage,
  //   navigationOptions: {
  //     header: null,
  //   }
  // },
  // SignInPage: {
  //   screen: SignInPage,
  //   navigationOptions: {
  //     header: null,
  //   }
  // },
  // FirstPage: {
	 //  screen: FirstPage,
	 //  navigationOptions: {
	 //    header: null,
	 //  }
  // },
  // SecondPage: {
	 //  screen: SecondPage,
	 //  navigationOptions: {
	 //    header: null,
	 //  }
  // },
  // FinalPage: {
	 //  screen: FinalPage,
	 //  navigationOptions: {
	 //    header: null,
	 //  }
  // },
	Homepage: {
    screen: Homepage,
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