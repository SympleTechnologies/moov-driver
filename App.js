// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';

// screens
import { LandingPage, SignInPage, SignUpPage } from './src/screen';

// component
import { SignUpScreenTwo, SignUpScreenThree } from './src/component/SignUp';

export default MainStack = StackNavigator({
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
}, {
  navigationOptions: {
    header: 'screen',
  }
});


// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
//
// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <Text>Changes you make will automatically reload.</Text>
//         <Text>Shake your phone to open the developer menu.</Text>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
